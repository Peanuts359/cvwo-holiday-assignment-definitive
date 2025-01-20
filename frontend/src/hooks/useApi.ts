import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080";

export const useApi = () => {
    const login = async (data: { username: string; password: string }): Promise<any> => {
        try {
            const response: AxiosResponse<any> = await axios.post(`${API_URL}/`, data);
            return response.data; // Return the token or response body
        } catch (error: any) {
            console.error("Login API error:", error);
            throw error.response?.data?.error || "An unexpected error occurred.";
        }
    };

    const register = async (data: { username: string; email: string; password: string }) => {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    };

    const reset = async (data: { email: string; newPassword: string }) => {
        const response = await axios.post(`${API_URL}/reset`, data);
        return response.data;
    };

    const menu = async (): Promise<any> => {
        const response: AxiosResponse<any> = await axios.get(`${API_URL}/menu`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    const createThread = async (): Promise<any> => {
        const response: AxiosResponse<any> = await axios.get(`${API_URL}/create`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    const getThreads = async (): Promise<any> => {
        const response: AxiosResponse<any> = await axios.get(`${API_URL}/threads`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    const deleteThread = async (id: number): Promise<any> => {
        const response: AxiosResponse<any> = await axios.delete(`${API_URL}/threads/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    return { login, register, reset, menu, createThread, getThreads, deleteThread };
};