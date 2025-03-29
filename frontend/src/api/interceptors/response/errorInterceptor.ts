import { AxiosError, AxiosInstance } from "axios";
import { GeneralError } from "@/api/types/errors";

export function errorInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      throw new GeneralError(
        error instanceof AxiosError ? error.response?.data : error.message,
      );
    },
  );
}
