import { GET_LOTS_PATH } from "../constants.ts";
import { authApiClient } from "@/api/instances/auth";
import { LotFullInfo } from "@/api/rest/lots/one/types.ts";

export async function getLotById({
  signal,
  id,
}: {
  signal: AbortSignal;
  id: number | null;
}) {
  if (!id) return {} as LotFullInfo;
  const res = await authApiClient.get<LotFullInfo>(`${GET_LOTS_PATH}/${id}`, {
    signal,
  });

  return res.data;
}
