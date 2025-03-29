import { LOGOUT_PATH } from "./constants";
import { authApiClient } from "@/api/instances/auth";

export async function logout() {
  const res = await authApiClient.post(
    LOGOUT_PATH,
    {},
    { withCredentials: true },
  );
  return res.data;
}
