import * as THREE from 'three'
import { periodicNoiseGLSL } from './utils'

export class TunnelPointMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: /* glsl */ `
      uniform sampler2D positions;
      uniform float uPointSize;
      uniform float uTime;
      varying vec3 vPos;
      varying float vDepth; // 0 to 1 based on Z distance

      void main() { 
        vec3 pos = texture2D(positions, position.xy).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        vPos = pos;
        
        // Calculate depth for coloring (assuming tunnel length ~20)
        // Map -20..0 to 0..1
        vDepth = smoothstep(-20.0, 2.0, pos.z);

        // Size attenuation based on depth
        float dist = -mvPosition.z;
        gl_PointSize = uPointSize * (20.0 / dist);
      }`,
      fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform float uTime;
      varying vec3 vPos;
      varying float vDepth;

      // HSL to RGB helper
      vec3 hsl2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
      }

      void main() {
      // Circular particle shape
      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      if(dot(cxy, cxy) > 1.0) discard;

        // Rainbow Color Logic
        // Hue shifts based on time and depth (spiral effect)
        float hue = vDepth * 0.5 + uTime * 0.1; 
        vec3 color = hsl2rgb(vec3(hue, 0.8, 0.6));

        // Pulse Logic
        // Brightness pulse moving down the tunnel
        float pulse = sin(vDepth * 10.0 - uTime * 3.0) * 0.5 + 0.5;
    color += pulse * 0.3; // Add brightness on pulse

    gl_FragColor = vec4(color, uOpacity);
  }`,
      uniforms: {
        positions: { value: null },
        uPointSize: { value: 4.0 },
        uTime: { value: 0 },
        uOpacity: { value: 1.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  }
}
