export enum Status {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface Lot {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
}

export interface Bid {
  userId: number;
  email: string;
  value: number;
}
