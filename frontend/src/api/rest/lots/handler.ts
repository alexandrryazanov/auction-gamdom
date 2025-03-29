import { GET_LOTS_PATH } from "./constants";
import { Lot } from "./types";
import { baseApiClient } from "@/api/instances/base";

export async function getAllLots({
  signal,
  limit,
  offset,
}: {
  signal: AbortSignal;
  limit: number;
  offset: number;
}) {
  const res = await baseApiClient.get<Lot[]>(GET_LOTS_PATH, {
    params: { limit, offset },
    signal,
  });

  return res.data;
}
