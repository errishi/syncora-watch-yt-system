import express from "express";
import { createRoom, getRoomDetails, joinRoom, getDashboardData } from "../controllers/roomController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const roomRouter = express.Router();

// Apply auth middleware to all routes
roomRouter.use(requireAuth);

/**
 * @route POST /api/v1/rooms/create-room
 * @desc Create a new room
 * @access Private
 */
roomRouter.post("/create-room", createRoom);

/**
 * @route POST /api/v1/rooms/join-room
 * @desc Join an existing room
 * @access Private
 */
roomRouter.post("/join-room", joinRoom);

/**
 * @route GET /api/v1/rooms/dashboard/stats
 * @desc Get dashboard data
 * @access Private
 */
roomRouter.get("/dashboard/stats", getDashboardData);

/**
 * @route GET /api/v1/rooms/:roomCode
 * @desc Get details of a specific room
 * @access Private
 */
roomRouter.get("/:roomCode", getRoomDetails);

export default roomRouter;