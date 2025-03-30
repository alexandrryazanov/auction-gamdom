import { User } from "@/api/rest/users/me/types.ts";

export interface HeaderProps {
  user: User | undefined;
}
