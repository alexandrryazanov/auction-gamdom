import { AxiosInstance, HttpStatusCode } from "axios";
import { LOGIN_PATH } from "@/api/rest/auth/login/constants";
import { refreshTokens } from "@/api/rest/auth/refresh/handler";
import { TOKEN_KEY } from "@/constants/localStorage";

export function refreshTokenInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const needToRefresh =
        error.response?.status === HttpStatusCode.Unauthorized &&
        !originalRequest?.sent &&
        !originalRequest?.url?.includes(LOGIN_PATH);

      if (needToRefresh) {
        try {
          const data = await refreshTokens();
          originalRequest.sent = true;
          localStorage.setItem(TOKEN_KEY, data.accessToken);
          return instance(originalRequest);
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = "/login";
        }
      }

      throw error;
    },
  );
}
