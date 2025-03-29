import { useQuery } from "@tanstack/react-query";
import { Lot } from "@/api/rest/lots/types.ts";
import { LOTS_QUERY_KEY } from "@/api/rest/lots/constants.ts";
import { getAllLots } from "@/api/rest/lots/handler.ts";

export const useLots = ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  return useQuery<Lot[]>({
    queryKey: [LOTS_QUERY_KEY, limit, offset],
    queryFn: ({ signal }) => getAllLots({ signal, limit, offset }),
  });
};
