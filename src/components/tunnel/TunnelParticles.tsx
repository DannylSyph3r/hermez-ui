'use client'

import * as THREE from 'three'
import { useMemo, useState, useRef } from 'react'
import { createPortal, useFrame, extend } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import { TunnelSimulationMaterial } from './shaders/tunnelSimulationMaterial'
import { TunnelPointMaterial } from './shaders/tunnelPointMaterial'

// Extend materials to make them available as JSX elements if needed (though we use primitives here)
extend({ TunnelSimulationMaterial, TunnelPointMaterial })

interface TunnelParticlesProps {
    speed?: number
    radius?: number
    length?: number
    count?: number // size * size
}

export function TunnelParticles({
    speed = 1.0,
    radius = 5.0,
    length = 40.0,
    count = 512
}: TunnelParticlesProps) {
    const size = count // Texture dimensions (size x size)

    // 1. Setup Simulation Material
    const simulationMaterial = useMemo(() => {
        return new TunnelSimulationMaterial(radius, length)
    }, [radius, length])

    // 2. Setup FBO (Frame Buffer Object) to store particle positions
    // This is our "GPU Memory" for positions
    const target = useFBO(size, size, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType, // vital for precision
    })

    // 3. Setup Render Material (reads from FBO)
    const renderMaterial = useMemo(() => {
        const m = new TunnelPointMaterial()
        m.uniforms.positions.value = target.texture
        return m
    }, []) // Depend on target only via ref, but texture object is stable

    // 4. Setup Off-screen Scene/Camera for Simulation
    const [scene] = useState(() => new THREE.Scene())
    const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1))

    // A simple quad to render the simulation shader onto the FBO
    const [quadPositions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
    const [quadUvs] = useState(() => new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]))

    // 5. Generate Particles Geometry (just points with IDs/UVs)
    const particles = useMemo(() => {
        const length = size * size
        const data = new Float32Array(length * 3)
        for (let i = 0; i < length; i++) {
            // We don't actually need positions here as they are read from texture
            // But we can store UV reference to look up the texture
            // Actually, we usually pass UVs via attribute or just compute in vertex shader
            // Let's pass simple indices or rely on gl_VertexID (if supported) or just UVs.
            // Standard way:
            data[i * 3 + 0] = (i % size) / size
            data[i * 3 + 1] = Math.floor(i / size) / size
            data[i * 3 + 2] = 0
        }
        return data
    }, [size])

    // 6. Simulation Loop
    useFrame((state) => {
        const { gl, clock } = state

        // Update Simulation Uniforms
        simulationMaterial.uniforms.uTime.value = clock.elapsedTime
        simulationMaterial.uniforms.uSpeed.value = speed
        simulationMaterial.uniforms.uTunnelLength.value = length

        // Render Simulation to FBO
        gl.setRenderTarget(target)
        gl.clear()
        gl.render(scene, camera)
        gl.setRenderTarget(null)

        // Update Render Uniforms
        renderMaterial.uniforms.uTime.value = clock.elapsedTime
        renderMaterial.uniforms.positions.value = target.texture
    })

    return (
        <>
            {/* Simulation Pass (Off-screen) */}
            {createPortal(
                <mesh>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[quadPositions, 3]} />
                        <bufferAttribute attach="attributes-uv" args={[quadUvs, 2]} />
                    </bufferGeometry>
                    {/* @ts-ignore */}
                    <primitive object={simulationMaterial} attach="material" />
                </mesh>,
                scene
            )}

            {/* Render Pass (On-screen) */}
            <points>
                <bufferGeometry>
                    {/* We use the UVs calculated in particles useMemo as 'position' attribute 
              so vertex shader can look up the FBO. 
              The actual world position is set in vertex shader from the texture. */}
                    <bufferAttribute attach="attributes-position" args={[particles, 3]} />
                </bufferGeometry>
                {/* @ts-ignore */}
                <primitive object={renderMaterial} attach="material" />
            </points>
        </>
    )
}
