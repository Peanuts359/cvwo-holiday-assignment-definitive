import axios from "axios";

const API_URL = "http://localhost:8080"; // Your backend URL

export const useApi = () => {
    const login = async (data: { username: string; password: string }) => {
        const response = await axios.post(`${API_URL}/login`, data);
        return response.data;
    };

    const register = async (data: { username: string; email: string; password: string }) => {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    };

    const reset = async (data: { email: string; newPassword: string }) => {
        const response = await axios.post(`${API_URL}/reset`, data);
        return response.data;
    };

    return { login, register, reset };
};