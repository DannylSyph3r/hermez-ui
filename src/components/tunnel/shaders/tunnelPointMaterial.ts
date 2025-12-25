import * as THREE from 'three'
import { periodicNoiseGLSL } from './utils'

export class TunnelPointMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: /* glsl */ `
      uniform sampler2D positions;
      uniform sampler2D initialPositions; // Needed for stable sparkle seed
      uniform float uTime;
      uniform float uFocus;
      uniform float uFov; // Not strictly used if projectionMatrix handles it, but Skkall uses it for scaling logic maybe?
      uniform float uBlur;
      uniform float uPointSize;
      
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;

      void main() { 
        vec3 pos = texture2D(positions, position.xy).xyz;
        vec3 initialPos = texture2D(initialPositions, position.xy).xyz;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // DOF Logic
        // Distance from focus plane
        // mvPosition.z is negative. Focus is positive distance from camera? 
        // Skkall uses: abs(uFocus - -mvPosition.z)
        vDistance = abs(uFocus + mvPosition.z); // uFocus is distance, mvPosition.z is negative coordinate
        
        vPosY = pos.y;
        vWorldPosition = pos;
        vInitialPosition = initialPos;
        
        // DOFSizing
        gl_PointSize = max(vDistance * uBlur * uPointSize * 0.1, 3.0); // Adjusted scale
      }`,
      fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform float uTime;
      
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;

      // Sparkle Noise from Skkall
      float sparkleNoise(vec3 seed, float time) {
        float hash = sin(seed.x * 127.1 + seed.y * 311.7 + seed.z * 74.7) * 43758.5453;
        hash = fract(hash);
        float slowTime = time * 1.0;
        float sparkle = 0.0;
        sparkle += sin(slowTime + hash * 6.28318) * 0.5;
        sparkle += sin(slowTime * 1.7 + hash * 12.56636) * 0.3;
        sparkle += sin(slowTime * 0.8 + hash * 18.84954) * 0.2;
        
        float hash2 = sin(seed.x * 113.5 + seed.y * 271.9 + seed.z * 97.3) * 37849.3241;
        hash2 = fract(hash2);
        
        float sparkleMask = sin(hash2 * 6.28318) * 0.7;
        sparkleMask += sin(hash2 * 12.56636) * 0.3;
        
        if (sparkleMask < 0.3) {
          sparkle *= 0.05;
        }
        
        float normalizedSparkle = (sparkle + 1.0) * 0.5;
        float smoothCurve = pow(normalizedSparkle, 4.0);
        float blendFactor = normalizedSparkle * normalizedSparkle;
        float finalBrightness = mix(normalizedSparkle, smoothCurve, blendFactor);
        return 0.7 + finalBrightness * 1.3;
      }

      float sdCircle(vec2 p, float r) {
        return length(p) - r;
      }

      void main() {
        // Circular particle shape
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float sdf = sdCircle(cxy, 0.5);
        if(sdf > 0.0) discard;

        // Sparkle
        float sparkleBrightness = sparkleNoise(vInitialPosition, uTime);
        
        // Clean White Appearance
        vec3 color = vec3(1.0);
        
        // Alpha / Opacity
        // Fade out based on distance/DOF?
        // Skkall: (1.04 - clamp(vDistance...))
        // We want particles visible but maybe softer when out of focus
        
        // Tunnel Fade: Fade out far away (simple fog effect)
        // pos.z goes from roughly -20 to +2
        float depthFade = smoothstep(-20.0, -5.0, vWorldPosition.z);
        
        float alpha = uOpacity * sparkleBrightness * depthFade;

        gl_FragColor = vec4(color, alpha);
      }`,
      uniforms: {
        positions: { value: null },
        initialPositions: { value: null }, // Needs to be set!
        uPointSize: { value: 4.0 },
        uTime: { value: 0 },
        uOpacity: { value: 1.0 },
        uFocus: { value: 5.0 },
        uBlur: { value: 0.5 },
        uFov: { value: 60 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  }
}
