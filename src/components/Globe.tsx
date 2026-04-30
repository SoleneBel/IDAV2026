import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { FESTIVALS, Festival } from '../constants';
import { useLoader } from '@react-three/fiber';

function Pin({ festival, onSelect, radius }: { festival: Festival; onSelect: (f: Festival) => void; radius: number }) {
  const LAT_OFFSET = -6; // To shift a bit bc the coordinates aren't good with my map model

  const [rawLat, lng] = festival.coordinates;
  const lat = rawLat + LAT_OFFSET;
  const [hovered, setHovered] = useState(false);
  
  const position = useMemo(() => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);

    const pos = new THREE.Vector3(x, y, z).multiplyScalar(1.5);

  return pos;
  }, [lat, lng]);

  return (
    <group position={position}>
      <mesh 
        onClick={() => onSelect(festival)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#FFFFFF" : "#FF6321"} 
          emissive={hovered ? "#FFFFFF" : "#FF6321"} 
          emissiveIntensity={hovered ? 2 : 0.8} 
        />
      </mesh>
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#FF6321" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Earth({ radius }: { radius: number }) {
  const earthRef = useRef<THREE.Mesh>(null);

  const texture = useLoader(THREE.TextureLoader, '/earth.jpg');

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

export default function Globe({ onSelect }: { onSelect: (f: Festival) => void }) {
  const radius = 1.5;

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <React.Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <spotLight position={[-10, -10, 10]} intensity={0.5} />
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <Earth radius={radius} />
            {FESTIVALS.map((f) => (
              <Pin key={f.id} festival={f} onSelect={onSelect} radius={radius} />
            ))}
          </Float>
          <OrbitControls 
            enablePan={false} 
            enableZoom={false}
            minDistance={4} 
            maxDistance={4}
            rotateSpeed={0.5}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
