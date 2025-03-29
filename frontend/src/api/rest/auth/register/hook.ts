import { useMutation } from "@tanstack/react-query";
import { register } from "./handler";

export const useRegister = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: register,
    onSuccess: onSuccess,
  });
};
