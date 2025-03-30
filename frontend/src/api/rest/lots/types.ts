export interface Lot {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  userId: number;
  email: string;
  value: number;
}
