import { User } from "@/api/rest/users/me/types.ts";

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
  winner: Pick<User, "id" | "email"> | null;
}

export interface Bid {
  userId: number;
  email: string;
  value: number;
}
