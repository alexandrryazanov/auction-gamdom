import { AxiosInstance } from "axios";
import { TOKEN_KEY } from "@/constants/localStorage";
import { NO_TOKEN_ERROR_MESSAGE } from "@/api/rest/auth/constants";

export function addTokenToHeadersInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(async (request) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error(NO_TOKEN_ERROR_MESSAGE);
    request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  });
}
