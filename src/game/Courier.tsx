import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { Vector3 } from 'three';

const SPEED = 6.2;
const keys = new Set<string>();
export function useCourierControls() {
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault();
      keys.add(event.key.toLowerCase());
    };
    const up = (event: KeyboardEvent) => { keys.delete(event.key.toLowerCase()); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); keys.clear(); };
  }, []);
}
export function setTouchKey(key: string, pressed: boolean) {
  if (pressed) keys.add(key); else keys.delete(key);
}
export function Courier({ onPosition }: { onPosition: (position: [number, number, number]) => void }) {
  const body = useRef<RapierRigidBody>(null);
  const reportTimer = useRef(0);
  const direction = useRef(new Vector3());
  useFrame(({ camera }, delta) => {
    const rigidBody = body.current;
    if (!rigidBody) return;
    const forward = Number(keys.has('w') || keys.has('arrowup')) - Number(keys.has('s') || keys.has('arrowdown'));
    const side = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
    direction.current.set(side, 0, -forward);
    if (direction.current.lengthSq() > 1) direction.current.normalize();
    const velocity = direction.current.multiplyScalar(SPEED);
    const current = rigidBody.linvel();
    rigidBody.setLinvel({ x: velocity.x, y: current.y, z: velocity.z }, true);
    const p = rigidBody.translation();
    camera.position.lerp(new Vector3(p.x + 7, p.y + 7, p.z + 10), Math.min(1, delta * 3.5));
    camera.lookAt(p.x, p.y + 0.6, p.z);
    reportTimer.current += delta;
    if (reportTimer.current > 0.12) { onPosition([p.x, p.y, p.z]); reportTimer.current = 0; }
  });
  return <RigidBody ref={body} colliders={false} position={[0, 1.2, 0]} enabledRotations={[false, false, false]} linearDamping={4} mass={1}>
    <CapsuleCollider args={[0.48, 0.38]} />
    <group>
      <mesh castShadow position={[0, 0.1, 0]}><capsuleGeometry args={[0.42, 0.72, 5, 10]} /><meshStandardMaterial color="#2563eb" roughness={0.7} /></mesh>
      <mesh castShadow position={[0, 0.72, -0.05]}><sphereGeometry args={[0.27, 16, 12]} /><meshStandardMaterial color="#e8b995" roughness={0.85} /></mesh>
      <mesh castShadow position={[0, -0.35, 0.2]}><boxGeometry args={[0.7, 0.26, 0.42]} /><meshStandardMaterial color="#f5b942" roughness={0.8} /></mesh>
    </group>
  </RigidBody>;
}
