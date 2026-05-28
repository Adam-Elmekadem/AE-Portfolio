"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

export default function FloatingGeometry() {
  const torusRef = useRef<THREE.Mesh>(null);
  const icosaRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3;
      torusRef.current.rotation.y = t * 0.2;
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.x = -t * 0.2;
      icosaRef.current.rotation.z = t * 0.15;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.25;
      octaRef.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <>
      {/* Central torus knot */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={torusRef} position={[0, 0, -2]}>
          <torusKnotGeometry args={[2, 0.5, 128, 16]} />
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.8}
            transparent
            opacity={0.6}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* Orbiting icosahedron */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.8}>
        <mesh ref={icosaRef} position={[4, 1.5, -3]}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>

      {/* Octahedron */}
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.6}>
        <mesh ref={octaRef} position={[-4.5, -1, -2]}>
          <octahedronGeometry args={[0.9]} />
          <meshStandardMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>

      {/* Small floating spheres */}
      {[
        { pos: [3, -2, -1] as [number, number, number], color: "#ec4899", size: 0.3 },
        { pos: [-3, 2, -1] as [number, number, number], color: "#f59e0b", size: 0.25 },
        { pos: [2, 3, -3] as [number, number, number], color: "#22d3ee", size: 0.2 },
        { pos: [-2, -3, -2] as [number, number, number], color: "#6366f1", size: 0.35 },
      ].map((sphere, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={1}>
          <mesh position={sphere.pos}>
            <sphereGeometry args={[sphere.size, 16, 16]} />
            <meshStandardMaterial
              color={sphere.color}
              emissive={sphere.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      ))}

      {/* Lights */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#22d3ee" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#a855f7" />
    </>
  );
}
