import { authApiClient } from "@/api/instances/auth";
import { GET_USERS_ME_PATH } from "./constants";
import { User } from "./types";

export async function getMe({ signal }: { signal: AbortSignal }) {
  const res = await authApiClient.get<User>(GET_USERS_ME_PATH, {
    signal,
  });

  return res.data;
}
