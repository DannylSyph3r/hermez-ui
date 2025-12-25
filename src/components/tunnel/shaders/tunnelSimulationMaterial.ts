import * as THREE from 'three'
import { periodicNoiseGLSL } from './utils'

// Function to generate particles in structured Spiral Arms
function getCylinder(count: number, components: number, size: number = 512, radius: number = 5.0, length: number = 20.0) {
  const totallength = count * components
  const data = new Float32Array(totallength)

  // Configuration for Spiral Arms
  const numArms = 5; // Distinct arms
  const armWidth = 0.3; // Width of each arm (0 to 1, where 1 is touching neighbors)
  const spiralTwist = 2.0; // How many full rotations along the length

  for (let i = 0; i < count; i++) {
    const i4 = i * components

    // 1. Z Position (Depth)
    // Distributed randomly along length
    const z = (Math.random() * length) - length // -20 to 0

    // 2. Angle (Spiral Logic)
    // Determine which arm this particle belongs to
    const armIndex = Math.floor(Math.random() * numArms);
    // Base angle for this arm
    const armBaseAngle = (armIndex / numArms) * Math.PI * 2;

    // Twist based on Z: The spiral rotates as we go deeper
    // Normalize Z (-length to 0) to 0..1
    const zNorm = Math.abs(z) / length;
    const twistOffset = zNorm * Math.PI * 2 * spiralTwist;

    // Spread within the arm (Gaps!)
    // Random offset within the allowed arm width
    const armSpread = (Math.random() - 0.5) * (Math.PI * 2 / numArms) * armWidth;

    const theta = armBaseAngle + twistOffset + armSpread;

    // 3. Radius (Tube Thickness)
    // Keep it relatively tight to form clean lines, but with slight variation for volume
    // The reference image has thick defined paths.
    const r = radius * (0.9 + Math.random() * 0.2);

    // Convert to Cartesian
    const x = Math.cos(theta) * r
    const y = Math.sin(theta) * r

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
        // Skkall noise params
        uniform float uNoiseScale;
        uniform float uNoiseIntensity;
        uniform float uTimeScale;
        
        varying vec2 vUv;

        ${periodicNoiseGLSL}

        void main() {
          vec3 originalPos = texture2D(positions, vUv).rgb;

          // 1. Continuous Flow along Z (Tunnel Effect)
          // Speed up slightly for the "warp speed" feel of the reference
          float zFlow = uTime * uSpeed * 6.0; 
          float currentZ = originalPos.z + zFlow;
          
          float zRange = uTunnelLength; // Match length exactly for seamless loops if the geometry is periodic?
          // Our geometry twist is based on Z. If we wrap Z, we must ensure the twist matches at boundaries.
          // Or we just let it flow. The random scatter along Z helps hide seams.
          
          // Wrap with buffer
          float zBuffer = 2.0;
          float wrapHeight = uTunnelLength + zBuffer;
          
          float zOffset = currentZ + uTunnelLength; 
          float zWrapped = mod(zOffset, wrapHeight);
          float finalZ = zWrapped - uTunnelLength;
          
          vec3 flowingPos = vec3(originalPos.x, originalPos.y, finalZ);

          // 2. Rotation
          // Rotate the entire tunnel for dynamic feel (separate from the static spiral geometry)
          float globalRot = uTime * 0.5;
          float c = cos(globalRot);
          float s = sin(globalRot);
          mat2 rotation = mat2(c, -s, s, c);
          flowingPos.xy = rotation * flowingPos.xy;

          // 3. Skkall Noise (Subtle)
          // Just enough to make it "alive", but not enough to break the spiral lines
          float noiseTime = uTime * uTimeScale;
          vec3 noiseInput = flowingPos * uNoiseScale;
          
          float displacementX = periodicNoise(noiseInput + vec3(0.0), noiseTime);
          float displacementY = periodicNoise(noiseInput + vec3(50.0, 0.0, 0.0), noiseTime + 2.094);
          float displacementZ = periodicNoise(noiseInput + vec3(0.0, 50.0, 0.0), noiseTime + 4.188);
          
          // Significantly reduced intensity to preserve the geometric "Gaps"
          vec3 distortion = vec3(displacementX, displacementY, displacementZ) * uNoiseIntensity;
          
          vec3 finalPos = flowingPos + distortion;

          gl_FragColor = vec4(finalPos, 1.0);
        }
      `,
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uSpeed: { value: 1.0 },
        uTunnelLength: { value: length },
        // New Skkall uniforms
        uNoiseScale: { value: 0.5 },
        uNoiseIntensity: { value: 0.2 }, // Reduced from 0.5 to keep lines clean
        uTimeScale: { value: 1.0 }
      }
    })
  }
}
