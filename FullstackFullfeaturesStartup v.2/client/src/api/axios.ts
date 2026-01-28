import axios from "axios";
import plainApi from "./plainAxios";

let accessToken: string | null = null;

export const setAxiosAccessToken = (token: string | null) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<(token?: string) => void> = [];

const processQueue = (token?: string) => {
  failedQueue.forEach((cb) => cb(token));
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh");

    // === Handle 401 (token expired) ===
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push((token?: string) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await plainApi.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        setAxiosAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(newAccessToken);

        return api(originalRequest);
      } catch (refreshError: any) {
        // If refresh fails with 403 (deactivated) -> block access
        if (refreshError.response?.status === 403) {
          alert("Your account is deactivated. You cannot refresh your session.");
        }

        setAxiosAccessToken(null);
        processQueue(undefined);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // === Handle other errors normally ===
    return Promise.reject(error);
  }
);

export default api;
