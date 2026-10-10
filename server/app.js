import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import roomRouter from "./routes/roomRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setUpSocketIO } from "./socket/socketManager.js";

const app = express();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://syncorayt.vercel.app",
    "http://localhost:5173",
].filter(Boolean);

// Create HTTP server and Socket.IO server
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    }
});

setUpSocketIO(io);

// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
connectDB();

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/v1/rooms', roomRouter);

export { httpServer, app };