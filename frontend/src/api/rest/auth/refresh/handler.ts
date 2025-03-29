import { TOKEN_REFRESH_PATH } from "./constants";
import { baseApiClient } from "@/api/instances/base";
import { RefreshTokenResponse } from "./types";

export async function refreshTokens() {
  const res = await baseApiClient.post<RefreshTokenResponse>(
    TOKEN_REFRESH_PATH,
    {},
    { withCredentials: true },
  );
  return res.data;
}
