import * as THREE from 'three'
import { periodicNoiseGLSL } from './utils'

// Generate equally distributed points on a plane
function getPlane(count: number, components: number, size: number = 512, scale: number = 1.0) {
  const length = count * components
  const data = new Float32Array(length)

  for (let i = 0; i < count; i++) {
    const i4 = i * components

    // Calculate grid position
    const x = (i % size) / (size - 1) // Normalize to [0, 1]
    const z = Math.floor(i / size) / (size - 1) // Normalize to [0, 1]

    // Convert to centered coordinates [-0.5, 0.5] and apply scale
    data[i4 + 0] = (x - 0.5) * 2 * scale // X position: scaled range
    data[i4 + 1] = 0 // Y position: flat plane at y=0
    data[i4 + 2] = (z - 0.5) * 2 * scale // Z position: scaled range
    data[i4 + 3] = 1.0 // W component (for RGBA texture)
  }

  return data
}

export class TunnelSimulationMaterial extends THREE.ShaderMaterial {
  constructor(scale: number = 10.0) {
    const positionsTexture = new THREE.DataTexture(getPlane(512 * 512, 4, 512, scale), 512, 512, THREE.RGBAFormat, THREE.FloatType)
    positionsTexture.needsUpdate = true

    super({
      vertexShader: /* glsl */`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
} `,
      fragmentShader: /* glsl */`uniform sampler2D positions;
      uniform float uTime;
      uniform float uNoiseScale;
      uniform float uNoiseIntensity;
      uniform float uTimeScale;
      uniform float uLoopPeriod;
      uniform float uSpiralStrength;
      uniform float uPulseSpeed;
      uniform float uPulseAmount;
      varying vec2 vUv;

      ${periodicNoiseGLSL}

void main() {
        // Get the original particle position
        vec3 originalPos = texture2D(positions, vUv).rgb;

        // Use continuous time for animation
        float continuousTime = uTime * uTimeScale * (6.28318530718 / uLoopPeriod);

        // ============================================
        // VORTEX EFFECT: Polar coordinate rotation
        // ALL particles rotate around center
        // Inner particles rotate FASTER (like a whirlpool/drain)
        // ============================================
        
        // Convert to polar coordinates
        vec2 xzPos = originalPos.xz;
        float r = length(xzPos);           // Distance from center
        float theta = atan(xzPos.y, xzPos.x);  // Current angle
        
        // Rotation speed inversely proportional to distance
        // Inner particles spin faster, outer particles spin slower
        // The "+ 0.3" prevents infinite speed at center
        float baseRotationSpeed = uSpiralStrength / (r * 0.5 + 0.3);
        
        // Add pulsing/breathing effect to rotation speed
        float pulseMultiplier = 1.0 + sin(continuousTime * uPulseSpeed) * uPulseAmount;
        float rotationSpeed = baseRotationSpeed * pulseMultiplier;
        
        // Continuously rotate the angle over time
        // This makes ALL particles spin around the center
        float newTheta = theta + continuousTime * rotationSpeed;
        
        // Convert back to Cartesian coordinates
        // This is the rotated position
        vec2 rotatedXZ = vec2(r * cos(newTheta), r * sin(newTheta));
        
        // ============================================
        // Add organic wave motion (keep the flowing feel)
        // ============================================
        vec3 noiseInput = originalPos * uNoiseScale;
        float noiseY = periodicNoise(noiseInput, continuousTime) * uNoiseIntensity * 0.4;
        float noiseXZ = periodicNoise(noiseInput + vec3(25.0, 0.0, 0.0), continuousTime) * uNoiseIntensity * 0.15;
        
        // Combine vortex rotation with organic wave noise
        vec3 finalPos = vec3(
          rotatedXZ.x + noiseXZ,
          originalPos.y + noiseY,
          rotatedXZ.y + noiseXZ
        );

  gl_FragColor = vec4(finalPos, 1.0);
} `,
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uNoiseScale: { value: 1.0 },
        uNoiseIntensity: { value: 0.5 },
        uTimeScale: { value: 1 },
        uLoopPeriod: { value: 24.0 },
        uSpiralStrength: { value: 0.5 },  // Controls rotation speed
        uPulseSpeed: { value: 0.8 },       // Breathing frequency
        uPulseAmount: { value: 0.15 }      // Breathing intensity
      }
    })
  }
}

