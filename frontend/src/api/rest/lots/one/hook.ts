import { useQuery } from "@tanstack/react-query";
import { Lot } from "@/api/rest/lots/types.ts";
import { LOT_QUERY_KEY } from "@/api/rest/lots/constants.ts";
import { getLotById } from "@/api/rest/lots/one/handler.ts";

export const useLot = ({ id }: { id: number | null }) => {
  return useQuery<Lot>({
    queryKey: [LOT_QUERY_KEY, id],
    queryFn: ({ signal }) => getLotById({ signal, id }),
    enabled: !!id,
  });
};
