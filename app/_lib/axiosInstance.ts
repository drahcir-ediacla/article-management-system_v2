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
export const refreshAccessToken = async () => {
    try {
        await axios.get("/api/refresh-token", { withCredentials: true });
    } catch {
        return null;
    }
};


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🚫 If login fails (401 on login route), do NOT attempt refresh
        if (originalRequest.url.includes("/login")) {
            return Promise.reject(error);
        }

        // 🔄 If 401 occurs on protected routes, attempt refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loops
            await refreshAccessToken();
            return axiosInstance(originalRequest); // Retry request after refresh
        }

        return Promise.reject(error);
    }
);
