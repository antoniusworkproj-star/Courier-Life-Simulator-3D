import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import World from './game/World';
import { Courier, setTouchKey, useCourierControls } from './game/Courier';
import { distance2D, getNextAction, INITIAL_DELIVERIES, INTERACTION_RADIUS } from './game/mission';
import type { Delivery } from './game/types';

function TouchButton({ label, control }: { label: string; control: string }) {
  return <button className="touch-button" aria-label={label}
    onPointerDown={event => { event.preventDefault(); setTouchKey(control, true); }}
    onPointerUp={() => setTouchKey(control, false)}
    onPointerLeave={() => setTouchKey(control, false)}
    onContextMenu={event => event.preventDefault()}>{label}</button>;
}
export default function App() {
  useCourierControls();
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [cash, setCash] = useState(0);
  const [message, setMessage] = useState('Find the gold parcel to start your first delivery.');
  const [nearby, setNearby] = useState(false);
  const active = useMemo(() => getNextAction(deliveries), [deliveries]);
  const updatePosition = useCallback((next: [number, number, number]) => {
    if (!active) { setNearby(false); return; }
    const target = active.status === 'ready' ? active.pickup : active.dropoff;
    setNearby(distance2D(next, target) <= INTERACTION_RADIUS);
  }, [active]);
  const interact = useCallback(() => {
    if (!active || !nearby) return;
    if (active.status === 'ready') {
      setDeliveries(current => current.map(d => d.id === active.id ? { ...d, status: 'picked-up' } : d));
      setMessage('Parcel collected. Head to the green drop-off marker!');
    } else {
      setDeliveries(current => current.map(d => d.id === active.id ? { ...d, status: 'delivered' } : d));
      setCash(value => value + 25);
      setMessage('Delivery complete! +$25. Find the next parcel.');
    }
  }, [active, nearby]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key.toLowerCase() === 'e') interact(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [interact]);
  const reset = () => {
    setDeliveries(INITIAL_DELIVERIES); setCash(0);
    setMessage('Route reset. Find the gold parcel to start again.');
  };
  return <main className="game-shell">
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7, 8, 10], fov: 55 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#9dc8dc']} />
      <fog attach="fog" args={['#9dc8dc', 28, 72]} />
      <ambientLight intensity={0.8} />
      <directionalLight castShadow position={[12, 20, 8]} intensity={2.2} shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={null}><Physics gravity={[0, -9.81, 0]}><World deliveries={deliveries} /><Courier onPosition={updatePosition} /></Physics></Suspense>
    </Canvas>
    <section className="hud" aria-live="polite">
      <div className="brand"><span className="brand-mark">CL</span><div><strong>COURIER LIFE</strong><small>NEIGHBORHOOD SHIFT · DAY 01</small></div></div>
      <div className="stats"><div><small>WALLET</small><strong>${cash}</strong></div><div><small>DELIVERIES</small><strong>{deliveries.filter(d => d.status === 'delivered').length}/{deliveries.length}</strong></div></div>
      <div className="mission-card">
        <small>{active ? (active.status === 'ready' ? 'CURRENT JOB · PICKUP' : 'CURRENT JOB · DROP-OFF') : 'SHIFT COMPLETE'}</small>
        <strong>{active ? (active.status === 'ready' ? 'Collect the parcel' : 'Deliver the parcel') : 'All parcels delivered!'}</strong>
        <p>{message}</p>
        {active && <button className="action-button" disabled={!nearby} onClick={interact}>{nearby ? 'INTERACT · E' : 'GET CLOSER'}</button>}
        {!active && <button className="action-button" onClick={reset}>START NEW SHIFT</button>}
      </div>
    </section>
    <div className="controls-hint"><kbd>WASD</kbd> / <kbd>↑↓←→</kbd> Move <span>·</span> <kbd>E</kbd> Interact</div>
    <div className="touch-controls" aria-label="Touch movement controls">
      <div className="touch-row"><TouchButton label="▲" control="w" /></div>
      <div className="touch-row"><TouchButton label="◀" control="a" /><TouchButton label="▼" control="s" /><TouchButton label="▶" control="d" /></div>
    </div>
  </main>;
}
