import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.33.16:3001",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;