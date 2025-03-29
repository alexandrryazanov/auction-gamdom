import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "./handler";
import { TOKEN_KEY } from "@/constants/localStorage";
import { USER_QUERY_KEY } from "@/api/rest/users/me/constants";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      await queryClient.fetchQuery({ queryKey: [USER_QUERY_KEY] });
      navigate("/");
    },
  });
};
