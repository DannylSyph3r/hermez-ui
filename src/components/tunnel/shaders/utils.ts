// Shader utility functions

// Blackhole spiral force calculation
export const blackholeForceGLSL = /* glsl */ `
  // Calculates spiral inward force for blackhole effect
  // Returns a 2D force vector that pulls toward center with rotation
  vec2 blackholeForce(vec2 pos, float pullStrength, float spiralStrength) {
    float dist = length(pos);
    
    // Avoid division by zero near center
    if (dist < 0.001) return vec2(0.0);
    
    // Inward pull (stronger near center, falloff with distance)
    float pull = pullStrength / (dist * 0.5 + 0.1);
    
    // Spiral rotation (tangential force)
    float spiral = spiralStrength / (dist * 0.3 + 0.2);
    
    // Convert to directional forces
    vec2 radialDir = -normalize(pos);
    vec2 tangentDir = vec2(-radialDir.y, radialDir.x);
    
    return radialDir * pull + tangentDir * spiral;
  }
`;

// Pulsating strength modulation
export const pulsatingStrengthGLSL = /* glsl */ `
  // Creates a breathing/pulsing effect for the gravitational pull
  float pulsatingStrength(float time, float baseStrength, float pulseAmount, float pulseSpeed) {
    return baseStrength * (1.0 + sin(time * pulseSpeed) * pulseAmount);
  }
`;

export const periodicNoiseGLSL = /* glsl */ `
  // Periodic noise function
  // Periodic noise function using sine and cosine waves
  float periodicNoise(vec3 p, float time) {
    // Create multiple frequency components for more complex movement
    // All time multipliers are integer values to ensure perfect 2π periodicity
    float noise = 0.0;
    
    // Primary wave - period = 2π
    noise += sin(p.x * 2.0 + time) * cos(p.z * 1.5 + time);
    
    // Secondary wave - period = π (time * 2)
    noise += sin(p.x * 3.2 + time * 2.0) * cos(p.z * 2.1 + time) * 0.6;
    
    // Tertiary wave - period = 2π/3 (time * 3)
    noise += sin(p.x * 1.7 + time) * cos(p.z * 2.8 + time * 3.0) * 0.4;
    
    // Cross-frequency interaction - period = π (time * 2)
    noise += sin(p.x * p.z * 0.5 + time * 2.0) * 0.3;
    
    return noise * 0.3; // Scale down the result
  }
`;
