import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "./handler";
import { TOKEN_KEY } from "@/constants/localStorage";
import { USER_QUERY_KEY } from "@/api/rest/users/me/constants";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      localStorage.removeItem(TOKEN_KEY);
      queryClient.removeQueries({ queryKey: [USER_QUERY_KEY] });
      navigate("/");
    },
  });
};
