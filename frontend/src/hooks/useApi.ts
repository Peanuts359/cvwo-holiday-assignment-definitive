import axios, { AxiosResponse } from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const useApi = () => {
    const login = async (data: { username: string; password: string }): Promise<any> => {
        try {
            const response: AxiosResponse<any> = await axios.post(`${backendUrl}/`, data);
            return response.data; // Return the token or response body
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error("An unexpected error occurred.");
        }
    };

    const register = async (data: { username: string; email: string; password: string }) => {
        const response = await axios.post(`${backendUrl}/register`, data);
        return response.data;
    };

    const reset = async (data: { email: string; newPassword: string }) => {
        const response = await axios.post(`${backendUrl}/reset`, data);
        return response.data;
    };

    const menu = async (): Promise<any> => {
        const response: AxiosResponse<any> = await axios.get(`${backendUrl}/menu`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    const createThread = async (): Promise<any> => {
        const response: AxiosResponse<any> = await axios.get(`${backendUrl}/create`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    const getThreads = async (): Promise<any> => {
        const response: AxiosResponse<any> = await axios.get(`${backendUrl}/threads`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    const deleteThread = async (id: number): Promise<any> => {
        const response: AxiosResponse<any> = await axios.delete(`${backendUrl}/threads/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    };

    return { login, register, reset, menu, createThread, getThreads, deleteThread };
};