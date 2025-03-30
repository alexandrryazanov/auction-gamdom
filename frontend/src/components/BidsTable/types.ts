import { Bid } from "@/api/rest/lots/all/types.ts";

export interface BidsTableProps {
  data: Bid[];
  isLoading?: boolean;
  error?: string;
}
