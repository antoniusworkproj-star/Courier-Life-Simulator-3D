import { describe, expect, it } from 'vitest';
import { distance2D, getNextAction, INITIAL_DELIVERIES } from './mission';

describe('delivery mission helpers', () => {
  it('measures distance on the ground plane', () => { expect(distance2D([0, 10, 0], [3, -10, 4])).toBe(5); });
  it('returns the first unfinished delivery', () => {
    expect(getNextAction(INITIAL_DELIVERIES)?.id).toBe(1);
    expect(getNextAction(INITIAL_DELIVERIES.map(d => ({ ...d, status: 'delivered' as const })))).toBeUndefined();
  });
  it('starts with two ready deliveries', () => {
    expect(INITIAL_DELIVERIES).toHaveLength(2);
    expect(INITIAL_DELIVERIES.every(d => d.status === 'ready')).toBe(true);
  });
});
