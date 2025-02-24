import axios from "axios";

export const axiosPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ Automatically sends HTTP-only cookies
});

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ Automatically sends HTTP-only cookies
});

// ✅ Function to Refresh Access Token
const refreshAccessToken = async () => {
    try {
        await axios.get("/api/refresh-token", { withCredentials: true });
    } catch {
        return null;
    }
};

// ✅ Response Interceptor (Auto-Refresh on 401)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await refreshAccessToken();
            return axiosInstance(error.config); // ✅ Retry request after refresh
        }
        return Promise.reject(error);
    }
);
