import { User } from "@/api/rest/users/me/types.ts";
import { Lot } from "@/api/rest/lots/all/types.ts";

export interface LotFullInfo extends Lot {
  winner: Pick<User, "id" | "email"> | null;
  timeLeft: number;
}
