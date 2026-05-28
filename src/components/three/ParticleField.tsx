"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  mouseX?: number;
  mouseY?: number;
}

export default function ParticleField({
  count = 3000,
  mouseX = 0,
  mouseY = 0,
}: ParticleFieldProps) {
  const mesh = useRef<THREE.Points>(null);
  const { size } = useThree();

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorOptions = [
      new THREE.Color("#6366f1"),
      new THREE.Color("#22d3ee"),
      new THREE.Color("#a855f7"),
      new THREE.Color("#ec4899"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 12 + 2;
      const spinAngle = radius * 3;
      const branchAngle = ((i % 4) / 4) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY * 2;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorOptions[i % colorOptions.length].clone();
      const innerColor = new THREE.Color("#ffffff");
      const outerColor = colorOptions[i % colorOptions.length];
      mixedColor.lerp(outerColor, radius / 14);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const elapsed = state.clock.elapsedTime;
    mesh.current.rotation.y = elapsed * 0.05;
    mesh.current.rotation.x = mouseY * 0.1 + elapsed * 0.01;
    mesh.current.rotation.z = mouseX * 0.05;
    mesh.current.position.y = Math.sin(elapsed * 0.2) * 0.3;
  });

  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    uniform float time;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = 1.0 - (dist * 2.0);
      alpha = pow(alpha, 2.0);
      gl_FragColor = vec4(vColor, alpha * 0.8);
    }
  `;

  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}
