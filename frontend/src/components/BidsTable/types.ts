import { Bid } from "@/api/rest/lots/types.ts";

export interface BidsTableProps {
  data: Bid[];
  isLoading?: boolean;
  error?: string;
}
