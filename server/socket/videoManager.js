import roomModel from "../models/roomModel.js";
import { hasPermission } from "./permissions.js";

export const setupVideoEvents = (socket, io) => {
    socket.on("play", async (payload) => {
        const { roomCode, timestamp, userId } = payload;
        if (await hasPermission(roomCode, userId, ["host", "moderator"])) {
            try {
                await roomModel.findOneAndUpdate({ roomCode }, { currentTime: timestamp, playState: "playing", videoUpdatedAt: Date.now() });
                socket.to(roomCode).emit("play", { timestamp });
            } catch(e) {}
        }
    });

    socket.on("pause", async (payload) => {
        const { roomCode, timestamp, userId } = payload;
        if (await hasPermission(roomCode, userId, ["host", "moderator"])) {
            try {
                await roomModel.findOneAndUpdate({ roomCode }, { currentTime: timestamp, playState: "paused", videoUpdatedAt: Date.now() });
                socket.to(roomCode).emit("pause", { timestamp });
            } catch(e) {}
        }
    });

    socket.on("seek", async (payload) => {
        const { roomCode, timestamp, userId } = payload;
        if (await hasPermission(roomCode, userId, ["host", "moderator"])) {
            try {
                await roomModel.findOneAndUpdate({ roomCode }, { currentTime: timestamp, videoUpdatedAt: Date.now() });
                socket.to(roomCode).emit("seek", { timestamp });
            } catch(e) {}
        }
    });

    socket.on("change_video", async (payload) => {
        const { roomCode, videoId, userId } = payload;
        if (await hasPermission(roomCode, userId, ["host", "moderator"])) {
            try {
                let extractedVideoId = videoId;
                const match = videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                if (match && match[1]) {
                    extractedVideoId = match[1];
                }

                // Update the videoId and videoUrl in the database for the room
                await roomModel.findOneAndUpdate(
                    { roomCode }, 
                    { videoId: extractedVideoId, videoUrl: videoId, currentTime: 0, playState: "playing", videoUpdatedAt: Date.now() }
                );

                // Broadcast the new videoId to all clients in the room
                io.in(roomCode).emit("change_video", { videoId: extractedVideoId });
                
                // Force a sync_state so everyone's player strictly loads and plays it
                io.in(roomCode).emit("sync_state", {
                    playState: "playing",
                    currentTime: 0,
                    videoId: extractedVideoId
                });
            } catch (error) {
                console.error("Error in change_video:", error);
            }
        }
    });

    socket.on("request_sync", async (payload) => {
        const { roomCode } = payload;
        try {
            const room = await roomModel.findOne({ roomCode });
            if (room && room.videoId) {
                let actualCurrentTime = room.currentTime || 0;
                if (room.playState === "playing" && room.videoUpdatedAt) {
                    const timeElapsed = (Date.now() - new Date(room.videoUpdatedAt).getTime()) / 1000;
                    actualCurrentTime += timeElapsed;
                }

                socket.emit("sync_state", {
                    playState: room.playState || "paused",
                    currentTime: actualCurrentTime,
                    videoId: room.videoId
                });
            }
        } catch (error) {
            console.error("Error in request_sync:", error);
        }
    });
};
