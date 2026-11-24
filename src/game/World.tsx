import { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { Delivery } from './types';

function Building({ position, size, color }: {
  position: [number, number, number]; size: [number, number, number]; color: string;
}) {
  return <RigidBody type="fixed" colliders="cuboid" position={position}>
    <mesh castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.88} /></mesh>
  </RigidBody>;
}
function Marker({ position, color }: { position: [number, number, number]; color: string }) {
  return <group position={[position[0], 0.08, position[2]]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.35, 1.75, 32]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[0.72, 0.72, 0.72]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
  </group>;
}
export default function World({ deliveries }: { deliveries: Delivery[] }) {
  const buildings = useMemo(() => {
    const blocks: Array<{ position: [number, number, number]; size: [number, number, number]; color: string }> = [];
    const palette = ['#64748b', '#7c8798', '#526477', '#8b8176', '#667b70'];
    for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) {
      if (Math.abs(x) <= 1 && Math.abs(z) <= 1) continue;
      const height = 2.4 + ((x * 7 + z * 11 + 40) % 4) * 0.7;
      blocks.push({ position: [x * 10, height / 2, z * 10], size: [6.2, height, 6.2], color: palette[Math.abs(x * 3 + z * 5) % palette.length] });
    }
    return blocks;
  }, []);
  return <>
    <RigidBody type="fixed" colliders="cuboid" position={[0, -0.3, 0]}>
      <mesh receiveShadow><boxGeometry args={[64, 0.5, 64]} /><meshStandardMaterial color="#34483f" /></mesh>
    </RigidBody>
    {buildings.map((building, i) => <Building key={i} {...building} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]}>
      <planeGeometry args={[64, 64]} /><meshStandardMaterial color="#303943" roughness={1} />
    </mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-40 + i * 10, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.16, 64]} /><meshBasicMaterial color="#d7c99a" />
    </mesh>)}
    {deliveries.filter(d => d.status === 'ready').map(d => <Marker key={d.id} position={d.pickup} color="#f5b942" />)}
    {deliveries.filter(d => d.status === 'picked-up').map(d => <Marker key={d.id} position={d.dropoff} color="#63d6ad" />)}
  </>;
}
