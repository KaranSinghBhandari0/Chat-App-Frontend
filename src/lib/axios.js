import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL : 'https://chat-app-backend-production-661f.up.railway.app/api',
    withCredentials: true,
});