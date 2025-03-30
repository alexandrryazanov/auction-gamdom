import { useQuery } from "@tanstack/react-query";
import { LOT_QUERY_KEY } from "@/api/rest/lots/constants.ts";
import { getLotById } from "@/api/rest/lots/one/handler.ts";
import { LotFullInfo } from "@/api/rest/lots/one/types.ts";

export const useLot = ({ id }: { id: number | null }) => {
  return useQuery<LotFullInfo>({
    queryKey: [LOT_QUERY_KEY, id],
    queryFn: ({ signal }) => getLotById({ signal, id }),
    enabled: !!id,
  });
};
