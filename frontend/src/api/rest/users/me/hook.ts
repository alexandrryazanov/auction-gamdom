import { useQuery } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "./constants";
import { getMe } from "./handler";
import { User } from "./types";

export const useUser = () => {
  return useQuery<User>({
    queryKey: [USER_QUERY_KEY],
    queryFn: getMe,
  });
};
