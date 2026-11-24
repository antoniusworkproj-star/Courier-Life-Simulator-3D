export type DeliveryStatus = 'ready' | 'picked-up' | 'delivered';
export interface Delivery {
  id: number;
  pickup: [number, number, number];
  dropoff: [number, number, number];
  status: DeliveryStatus;
}
