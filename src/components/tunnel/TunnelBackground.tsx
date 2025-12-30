'use client'

import React, { useState, useEffect } from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { Effects } from '@react-three/drei'
import { ShaderPass } from 'three-stdlib'
import { TunnelParticles } from './TunnelParticles'
import { VignetteShader } from './shaders/vignetteShader'
extend({ ShaderPass })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            shaderPass: any
        }
    }
}

export default function TunnelBackground() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        // Check on mount
        checkMobile()
        
        // Listen for resize
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const defaults = {
        speed: 1.0,
        focus: 3.8,
        aperture: 1.79,
        size: 512,
        noiseScale: 0.6,
        noiseIntensity: 0.52,
        timeScale: 1.0,
        pointSize: isMobile ? 12.0 : 10.0,
        opacity: 0.8,
        planeScale: isMobile ? 12.0 : 10.0,
        vignetteDarkness: 1.0,
        vignetteOffset: 0.7,
        useManualTime: false,
        manualTime: 0,
        // Vortex effect parameters
        spiralStrength: 0.5,
        pulseSpeed: 0.8,
        pulseAmount: 0.15,
        centerFadeRadius: 1.5,
        // showDebugPlane: false
    }

    // Camera adjustments for mobile - wider FOV and pulled back for better centering
    const cameraConfig = isMobile
        ? {
            position: [0.8, 2.2, -2.5] as [number, number, number],
            fov: 65,
            near: 0.01,
            far: 300,
        }
        : {
            position: [1.2629783123314589, 2.664606471394044, -1.8178993743288914] as [number, number, number],
            fov: 50,
            near: 0.01,
            far: 300,
        }

    return (
        <div className="absolute inset-0 z-0 bg-black">
            <Canvas
                gl={{ preserveDrawingBuffer: true }}
                camera={cameraConfig}
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
