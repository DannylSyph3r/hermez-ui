import * as THREE from 'three'
import { periodicNoiseGLSL } from './utils'

// Function to generate particles on a cylinder
function getCylinder(count: number, components: number, size: number = 512, radius: number = 5.0, length: number = 20.0) {
  const totallength = count * components
  const data = new Float32Array(totallength)

  for (let i = 0; i < count; i++) {
    const i4 = i * components

    // Random angle for cylinder mapping
    const theta = Math.random() * Math.PI * 2

    // Position along the length (Z-axis), distributed from -length to 0
    // We want them to spawn ahead and fly towards camera (or vice versa)
    // Let's spawn them along the whole tunnel initially
    const z = (Math.random() * length) - length // -20 to 0

    // X and Y based on radius and angle
    const x = Math.cos(theta) * radius
    const y = Math.sin(theta) * radius

    // Store positions
    data[i4 + 0] = x
    data[i4 + 1] = y
    data[i4 + 2] = z
    data[i4 + 3] = 1.0 // W component
  }

  return data
}

export class TunnelSimulationMaterial extends THREE.ShaderMaterial {
  constructor(radius: number = 5.0, length: number = 20.0) {
    // Initial particle positions
    const positionsTexture = new THREE.DataTexture(getCylinder(512 * 512, 4, 512, radius, length), 512, 512, THREE.RGBAFormat, THREE.FloatType)
    positionsTexture.needsUpdate = true

    super({
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform sampler2D positions;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uTunnelLength;
        varying vec2 vUv;

        ${periodicNoiseGLSL}

        void main() {
          vec3 pos = texture2D(positions, vUv).rgb;

          // 1. Move along Z axis (towards camera which is at +Z or 0)
          // We assume camera looks down -Z, so particles move +Z to fly past?
          // Let's say particles flow towards +Z (camera at 0, looking at -Z)
          // Actually, let's have them flow towards +Z.
          pos.z += uSpeed * 0.1;

          // 2. Loop logic
          // If particle passes the camera (z > 2.0), respawn at end of tunnel (-uTunnelLength)
          if (pos.z > 2.0) {
             pos.z -= uTunnelLength;
          }

          // 3. Spiral / Rotation effect
          // Rotate XY around Z axis based on speed
          float angle = uSpeed * 0.01;
          float c = cos(angle);
          float s = sin(angle);
          mat2 rotation = mat2(c, -s, s, c);
          pos.xy = rotation * pos.xy;
          
          // 4. Noise displacement for organic feel
          float noise = periodicNoise(pos, uTime * 0.5);
          pos.x += noise * 0.02;
          pos.y += noise * 0.02;

          gl_FragColor = vec4(pos, 1.0);
        }
      `,
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uSpeed: { value: 1.0 },
        uTunnelLength: { value: length }
      }
    })
  }
}
