import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.1.90:3001",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;