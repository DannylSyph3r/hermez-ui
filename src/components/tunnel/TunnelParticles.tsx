'use client'

import * as THREE from 'three'
import { useMemo, useState, useRef } from 'react'
import { createPortal, useFrame, extend } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as easing from 'maath/easing'

import { TunnelPointMaterial } from './shaders/tunnelPointMaterial'
import { TunnelSimulationMaterial } from './shaders/tunnelSimulationMaterial'

// Extend materials to make them available as JSX elements if needed
extend({ TunnelSimulationMaterial, TunnelPointMaterial })

interface TunnelParticlesProps {
    speed?: number
    aperture?: number
    focus?: number
    size?: number
    noiseScale?: number
    noiseIntensity?: number
    timeScale?: number
    pointSize?: number
    opacity?: number
    planeScale?: number
    useManualTime?: boolean
    manualTime?: number
    introspect?: boolean
}

export function TunnelParticles({
    // Skkall Defaults from index.tsx
    speed = 1.0,
    aperture = 1.79,
    focus = 3.8,
    size = 512,
    noiseScale = 0.6,
    noiseIntensity = 0.52,
    timeScale = 1.0,
    pointSize = 10.0,
    opacity = 0.8,
    planeScale = 10.0,
    useManualTime = false,
    manualTime = 0,
    introspect = false
}: TunnelParticlesProps) {
    // Reveal animation state
    const revealStartTime = useRef<number | null>(null);
    const [isRevealing, setIsRevealing] = useState(true);
    const revealDuration = 3.5; // seconds

    // 1. Setup Simulation Material (Exact Skkall Logic)
    const simulationMaterial = useMemo(() => {
        return new TunnelSimulationMaterial(planeScale)
    }, [planeScale])

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
        m.uniforms.initialPositions.value = simulationMaterial.uniforms.positions.value
        return m
    }, [simulationMaterial, target.texture])

    // 4. Setup Off-screen Scene/Camera for Simulation
    const [scene] = useState(() => new THREE.Scene())
    const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))

    const [positions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
    const [uvs] = useState(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])) // Skkall uses 0,1 etc (flipped?)

    // 5. Generate Particles Geometry
    const particles = useMemo(() => {
        const length = size * size
        const data = new Float32Array(length * 3)
        for (let i = 0; i < length; i++) {
            const i3 = i * 3;
            data[i3 + 0] = (i % size) / size;
            data[i3 + 1] = i / size / size;
        }
        return data
    }, [size])

    // 6. Simulation Loop
    useFrame((state, delta) => {
        const { gl, clock } = state
        if (!renderMaterial || !simulationMaterial) return;

        // Render Simulation to FBO
        gl.setRenderTarget(target)
        gl.clear()
        gl.render(scene, camera)
        gl.setRenderTarget(null)

        const currentTime = useManualTime ? manualTime : clock.elapsedTime;

        // Initialize reveal start time on first frame
        if (revealStartTime.current === null) {
            revealStartTime.current = currentTime;
        }

        // Calculate reveal progress
        const revealElapsed = currentTime - revealStartTime.current;
        const revealProgress = Math.min(revealElapsed / revealDuration, 1.0);

        // Ease out the reveal animation
        const easedProgress = 1 - Math.pow(1 - revealProgress, 3);

        // Map progress to reveal factor (0 = fully hidden, higher values = more revealed)
        // We want to start from center (0) and expand outward (higher values)
        const revealFactor = easedProgress * 4.0; // Doubled the radius for larger coverage

        if (revealProgress >= 1.0 && isRevealing) {
            setIsRevealing(false);
        }

        renderMaterial.uniforms.uTime.value = currentTime;
        renderMaterial.uniforms.uFocus.value = focus;
        renderMaterial.uniforms.uBlur.value = aperture;

        easing.damp(
            renderMaterial.uniforms.uTransition,
            "value",
            introspect ? 1.0 : 0.0,
            introspect ? 0.35 : 0.2,
            delta
        );

        simulationMaterial.uniforms.uTime.value = currentTime;
        simulationMaterial.uniforms.uNoiseScale.value = noiseScale;
        simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity;
        simulationMaterial.uniforms.uTimeScale.value = timeScale * speed;

        renderMaterial.uniforms.uPointSize.value = pointSize;
        renderMaterial.uniforms.uOpacity.value = opacity;
        renderMaterial.uniforms.uRevealFactor.value = revealFactor;
        renderMaterial.uniforms.uRevealProgress.value = easedProgress;
    })

    return (
        <>
            {/* Simulation Pass */}
            {createPortal(
                <mesh>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                        <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
                    </bufferGeometry>
                    <primitive object={simulationMaterial} attach="material" />
                </mesh>,
                scene
            )}

            {/* Render Pass */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particles, 3]} />
                </bufferGeometry>
                <primitive object={renderMaterial} attach="material" />
            </points>
        </>
    )
}
