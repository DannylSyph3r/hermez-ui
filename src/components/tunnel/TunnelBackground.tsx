'use client'

import { Canvas } from '@react-three/fiber'
import { TunnelParticles } from './TunnelParticles'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'

export default function TunnelBackground() {
    return (
        <div className="fixed inset-0 z-0 bg-black">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: false, alpha: false }}
                dpr={[1, 2]} // Optimize for pixel density
            >
                <color attach="background" args={['#000000']} />

                <Suspense fallback={null}>
                    <TunnelParticles
                        count={256} // 256x256 = 65k particles (Start conservative)
                        speed={1.5}
                        radius={2.0}
                        length={15.0} // Tunnel length
                    />
                </Suspense>

                <EffectComposer disableNormalPass>
                    {/* Add Bloom for that "Pulse" energy feel */}
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={1.5}
                        radius={0.6}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
