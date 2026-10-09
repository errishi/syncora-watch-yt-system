import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
});

export const roomService = {
    createNewRoom: async (roomData, token) => {
        const response = await apiClient.post(`/api/v1/rooms/create-room`, roomData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    joinRoom: async (roomData, token) => {
        const response = await apiClient.post(`/api/v1/rooms/join-room`, roomData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    enterToRoom: async (roomCode, token) => {
        const response = await apiClient.get(`/api/v1/rooms/${roomCode}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getDashboardData: async (token) => {
        const response = await apiClient.get(`/api/v1/rooms/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
}