import { useCallback, useState } from "react";
import { roomService } from "../services/roomService.js";
import { useAuth } from "@clerk/react";

export const useRoom = () => {
    const { getToken } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoomDetails = useCallback(async (roomCode) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const storedName = localStorage.getItem('syncora_display_name');
            const query = storedName ? `?displayName=${encodeURIComponent(storedName)}` : '';
            const roomData = await roomService.enterToRoom(roomCode + query, token);
            setRoom(roomData);
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to fetch room");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreateRoom = useCallback(async (roomData) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const newRoom = await roomService.createNewRoom(roomData, token);
            setRoom(newRoom);
            return newRoom;
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to create room");
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleJoinRoom = useCallback(async (roomData) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const joinedRoom = await roomService.joinRoom(roomData, token);
            setRoom(joinedRoom);
            return joinedRoom;
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to join room");
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        room, 
        loading, 
        error, 
        fetchRoomDetails, 
        handleJoinRoom,
        handleCreateRoom 
    };
}