import { setupRoomEvents } from "./roomManager.js";
import { setupVideoEvents } from "./videoManager.js";

export const setUpSocketIO = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Set up modularized socket events
        setupRoomEvents(socket, io);
        setupVideoEvents(socket, io);
    });
};