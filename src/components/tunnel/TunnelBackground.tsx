'use client'

import React from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { Effects } from '@react-three/drei'
import { ShaderPass } from 'three-stdlib'
import { TunnelParticles } from './TunnelParticles'
import { VignetteShader } from './shaders/vignetteShader'

// Extend ShaderPass to make it available as JSX
extend({ ShaderPass })

// Add types for shaderPass
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shaderPass: any
        }
    }
}

export default function TunnelBackground() {
    // Hardcoded values from Skkall defaults (since we don't need Leva for end user yet)
    const defaults = {
        speed: 1.0,
        focus: 3.8,
        aperture: 1.79,
        size: 512,
        noiseScale: 0.6,
        noiseIntensity: 0.52,
        timeScale: 1.0,
        pointSize: 10.0,
        opacity: 0.8,
        planeScale: 10.0,
        vignetteDarkness: 1.5,
        vignetteOffset: 0.4,
        useManualTime: false,
        manualTime: 0,
        // Vortex effect parameters
        spiralStrength: 0.5,
        pulseSpeed: 0.8,
        pulseAmount: 0.15,
        centerFadeRadius: 1.5,
        // showDebugPlane: false
    }

    return (
        <div className="absolute inset-0 z-0 bg-black">
            <Canvas
                gl={{ preserveDrawingBuffer: true }}
                camera={{
                    position: [1.2629783123314589, 2.664606471394044, -1.8178993743288914],
                    fov: 50,
                    near: 0.01,
                    far: 300,
                }}
            >
                <color attach="background" args={["#000"]} />

                <TunnelParticles
                    speed={defaults.speed}
                    aperture={defaults.aperture}
                    focus={defaults.focus}
                    size={defaults.size}
                    noiseScale={defaults.noiseScale}
                    noiseIntensity={defaults.noiseIntensity}
                    timeScale={defaults.timeScale}
                    pointSize={defaults.pointSize}
                    opacity={defaults.opacity}
                    planeScale={defaults.planeScale}
                    useManualTime={defaults.useManualTime}
                    manualTime={defaults.manualTime}
                    spiralStrength={defaults.spiralStrength}
                    pulseSpeed={defaults.pulseSpeed}
                    pulseAmount={defaults.pulseAmount}
                    centerFadeRadius={defaults.centerFadeRadius}
                    // introspect prop from Skkall is usually controlled by hover state, we can default to false or pass it if needed
                    introspect={false}
                />

                <Effects multisamping={0} disableGamma>
                    <shaderPass
                        args={[VignetteShader]}
                        uniforms-darkness-value={defaults.vignetteDarkness}
                        uniforms-offset-value={defaults.vignetteOffset}
                    />
                </Effects>
            </Canvas>
        </div>
    )
}
