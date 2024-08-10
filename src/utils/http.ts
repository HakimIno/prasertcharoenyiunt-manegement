import axios from "axios";

export const endpoint = axios.create({
    baseURL: import.meta.env.VITE_STORAGE_ENDPOINT,
    timeout: 60000,
});