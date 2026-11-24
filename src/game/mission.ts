import type { Delivery } from './types';

export const INITIAL_DELIVERIES: Delivery[] = [
  { id: 1, pickup: [-7, 0.55, -5], dropoff: [8, 0.55, 7], status: 'ready' },
  { id: 2, pickup: [9, 0.55, -8], dropoff: [-9, 0.55, 8], status: 'ready' }
];
export const INTERACTION_RADIUS = 2.1;

export function distance2D(a: readonly [number, number, number], b: readonly [number, number, number]): number {
  return Math.hypot(a[0] - b[0], a[2] - b[2]);
}
export function getNextAction(deliveries: Delivery[]): Delivery | undefined {
  return deliveries.find((delivery) => delivery.status !== 'delivered');
}
