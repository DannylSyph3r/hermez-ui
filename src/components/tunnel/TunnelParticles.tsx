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
    noiseScale?: number
    noiseIntensity?: number
    timeScale?: number
    focus?: number
    aperture?: number
    fov?: number
}

export function TunnelParticles({
    speed = 0.5,
    radius = 5.0,
    length = 20.0,
    count = 512,
    // Geometric Spiral Props
    noiseScale = 0.5,
    noiseIntensity = 0.1, // Almost zero noise to keep lines sharp (Geometric)
    timeScale = 0.1,
    focus = 5.5,
    aperture = 0.4,       // Less blur to show off the structure
    fov = 60
}: TunnelParticlesProps) {
    const size = count

    // 1. Setup Simulation Material
    const simulationMaterial = useMemo(() => {
        return new TunnelSimulationMaterial(radius, length)
    }, [radius, length])

    // 2. Setup FBO
    const target = useFBO(size, size, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
    })

    // 3. Setup Render Material (reads from FBO)
    const renderMaterial = useMemo(() => {
        const m = new TunnelPointMaterial()
        m.uniforms.positions.value = target.texture
        // Link initial positions for stable sparkle noise
        m.uniforms.initialPositions.value = simulationMaterial.uniforms.positions.value
        return m
    }, [simulationMaterial])

    // 4. Setup Off-screen Scene/Camera for Simulation
    const [scene] = useState(() => new THREE.Scene())
    const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1))

    // A simple quad
    const [quadPositions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
    const [quadUvs] = useState(() => new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]))

    // 5. Generate Particles Geometry
    const particles = useMemo(() => {
        const length = size * size
        const data = new Float32Array(length * 3)
        for (let i = 0; i < length; i++) {
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
        simulationMaterial.uniforms.uNoiseScale.value = noiseScale
        simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity
        simulationMaterial.uniforms.uTimeScale.value = timeScale

        // Render Simulation to FBO
        gl.setRenderTarget(target)
        gl.clear()
        gl.render(scene, camera)
        gl.setRenderTarget(null)

        // Update Render Uniforms
        renderMaterial.uniforms.uTime.value = clock.elapsedTime
        renderMaterial.uniforms.positions.value = target.texture
        renderMaterial.uniforms.uFocus.value = focus
        renderMaterial.uniforms.uBlur.value = aperture
        renderMaterial.uniforms.uFov.value = fov
    })

    return (
        <>
            {/* Simulation Pass */}
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

            {/* Render Pass */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particles, 3]} />
                </bufferGeometry>
                {/* @ts-ignore */}
                <primitive object={renderMaterial} attach="material" />
            </points>
        </>
    )
}
