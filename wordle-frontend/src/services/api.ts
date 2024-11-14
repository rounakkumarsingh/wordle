import axios from "axios";
import { store } from "@/app/store";
import { logout, logoutUser, refreshToken } from "@/features/auth/authSlice";

const api = axios.create({
    baseURL: "https://api.wordle.rounakkumarsingh.me/api/v1",
    withCredentials: true,
    timeout: 10000,
});

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await store.dispatch(refreshTokenThunk()).unwrap();
                processQueue();
                return api(originalRequest);
            } catch (error) {
                processQueue(error);
                store.dispatch(manualLogout());
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
