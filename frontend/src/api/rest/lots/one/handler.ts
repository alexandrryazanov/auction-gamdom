import { GET_LOTS_PATH } from "../constants.ts";
import { Lot } from "../types.ts";
import { authApiClient } from "@/api/instances/auth";

export async function getLotById({
  signal,
  id,
}: {
  signal: AbortSignal;
  id: number | null;
}) {
  if (!id) return {} as Lot;
  const res = await authApiClient.get<Lot>(`${GET_LOTS_PATH}/${id}`, {
    signal,
  });

  return res.data;
}
