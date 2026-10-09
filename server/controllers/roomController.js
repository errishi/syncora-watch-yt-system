import { getAuth, clerkClient } from "@clerk/express";
import roomModel from "../models/roomModel.js";
import userModel from "../models/userModel.js";

// Generate unique room code
const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

/**
 * @route POST /api/v1/rooms/create-room
 * @desc Create a new room
 * @access Private
 */
export const createRoom = async (req, res) => {
    try {
        const auth = getAuth(req);

        if (!auth.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const clerkId = auth.userId;
        const { roomName, displayName } = req.body;
        
        if (!roomName || !displayName) {
            return res.status(400).json({ message: "Room name and display name are required" });
        }

        let user = await userModel.findOne({ clerkId });
        if (!user) {
            console.log("User not found in DB. Auto-creating for testing...");

            const clerkUser = await clerkClient.users.getUser(clerkId);
    
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const avatar = clerkUser.imageUrl;
            const fetchedUsername = clerkUser.username || clerkUser.firstName || email.split('@')[0];

            user = await userModel.create({
                clerkId: clerkId,
                username: displayName || fetchedUsername,
                email: email,
                avatar: avatar,
            });
            console.log("User successfully synced to database!");
        }

        let roomCode;

        do {
            roomCode = generateRoomCode();
        } while (await roomModel.exists({ roomCode }));

        const newRoom = await roomModel.create({
            roomCode,
            roomName,
            hostId: user._id,
            participants: [{
                userId: user._id,
                username: displayName || user.username,
                role: "host"
            }],
            historicalParticipants: [user._id]
        });

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            room: newRoom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create room",
        });
    }
};

/**
 * @route POST /api/v1/rooms/join-room
 * @desc Join an existing room
 * @access Private
 */

export const joinRoom = async (req, res) => {
    try {
        const auth = getAuth(req);
        if(!auth.userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        const clerkId = auth.userId;
        let { roomCode, displayName } = req.body;

        if (!roomCode || typeof roomCode !== "string" || roomCode.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Valid room code is required" 
            });
        }

        roomCode = roomCode.trim().toUpperCase();

        const user = await userModel.findOne({ clerkId });
        if(!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        const room = await roomModel.findOne({ roomCode, isActive: true });
        if(!room) {
            return res.status(404).json({ 
                success: false,
                message: "Room not found or is no longer active" 
            });
        }

        if (room.bannedUsers && room.bannedUsers.includes(user._id.toString())) {
            return res.status(200).json({
                success: true,
                message: "You have been removed from this room by a moderator",
                isBanned: true,
                room: { roomCode: room.roomCode },
                currentUser: {
                    userId: user._id,
                    username: user.username,
                    role: "participant"
                }
            });
        }

        const isAlreadyParticipant = room.participants.some((p) => p.userId.toString() === user._id.toString());

        if (!isAlreadyParticipant) {
            const finalName = displayName || user.username;
            const role = room.hostId.toString() === user._id.toString() ? "host" : "participant";
            const isHistorical = room.historicalParticipants && room.historicalParticipants.includes(user._id.toString());

            if (role !== "host" && !isHistorical) {
                return res.status(200).json({
                    success: true,
                    message: "Awaiting host approval to join",
                    isWaiting: true,
                    room: { roomCode: room.roomCode },
                    currentUser: {
                        userId: user._id,
                        username: finalName,
                        role: "participant"
                    }
                });
            }

            if (role === "host") {
                room.participants.forEach(p => {
                    if (p.role === "host") p.role = "participant";
                });
                room.markModified('participants');
            }

            // Restore preserved role (moderator/viewer) if host had assigned one
            const preservedRole = role !== "host" && room.preservedRoles?.get(user._id.toString());
            const assignedRole = role === "host" ? "host" : (preservedRole || "participant");

            room.participants.push({
                userId: user._id,
                username: finalName,
                role: assignedRole
            });
            
            room.lastActivityAt = Date.now();
            await room.save();
        }

        res.status(200).json({
            success: true,
            message: isAlreadyParticipant ? "Rejoined room successfully" : "User joined the room successfully",
            room
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to join room",
        });
    }
};

/**
 * @route GET /api/v1/rooms/:roomCode
 * @desc Get details of a specific room
 * @access Private
 */

export const getRoomDetails = async (req, res) => {
    try {
        const auth = getAuth(req);
        if(!auth.userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        const { roomCode } = req.params;
        const { displayName } = req.query;

        if (!roomCode || typeof roomCode !== "string" || roomCode.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Valid room code is required" 
            });
        }

        const room = await roomModel.findOne({ 
            roomCode: roomCode.trim().toUpperCase(), 
            isActive: true 
        });

        if(!room) {
            return res.status(404).json({ 
                success: false,
                message: "Room not found or is no longer active" 
            });
        }

        // Check if the user is a participant of the room
        const user = await userModel.findOne({ clerkId: auth.userId });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found. Please ensure you have joined the room first."
            });
        }

        if (room.bannedUsers && room.bannedUsers.includes(user._id.toString())) {
            return res.status(200).json({
                success: true,
                message: "You have been removed from this room by a moderator",
                isBanned: true,
                room: { roomCode: room.roomCode },
                currentUser: {
                    userId: user._id,
                    username: displayName || user.username,
                    role: "participant"
                }
            });
        }

        let isParticipant = room.participants.some(
            (p) => p.userId.toString() === user._id.toString()
        );

        if (!isParticipant) {
            const role = room.hostId.toString() === user._id.toString() ? "host" : "participant";
            const isHistorical = room.historicalParticipants && room.historicalParticipants.includes(user._id.toString());

            if (role !== "host" && !isHistorical) {
                return res.status(200).json({
                    success: true,
                    message: "Awaiting host approval to join",
                    isWaiting: true,
                    room: { roomCode: room.roomCode },
                    currentUser: {
                        userId: user._id,
                        username: displayName || user.username,
                        role: "participant"
                    }
                });
            }

            // Auto-join them back since they already know the room code and were allowed
            if (role === "host") {
                room.participants.forEach(p => {
                    if (p.role === "host") p.role = "participant";
                });
                room.markModified('participants');
            }

            // Restore preserved role (moderator/viewer) if host had assigned one
            const preservedRole = role !== "host" && room.preservedRoles?.get(user._id.toString());
            const assignedRole = role === "host" ? "host" : (preservedRole || "participant");

            room.participants.push({
                userId: user._id,
                username: displayName || user.username,
                role: assignedRole
            });
            await room.save();
        }

        const currentParticipant = room.participants.find(
            (participant) => participant.userId.toString() === user._id.toString()
        );

        res.status(200).json({
            success: true,
            message: "Room details retrieved successfully",
            room,
            currentUser: {
                userId: user._id,
                username: currentParticipant.username,
                role: currentParticipant.role,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve room details",
        });
    }
};

/**
 * @route GET /api/v1/rooms/dashboard/stats
 * @desc Get dashboard overview stats and room history
 * @access Private
 */
export const getDashboardData = async (req, res) => {
    try {
        const auth = getAuth(req);
        if (!auth.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await userModel.findOne({ clerkId: auth.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find all rooms where the user is either the host or a participant
        const rooms = await roomModel.find({
            $or: [
                { hostId: user._id },
                { "participants.userId": user._id },
                { historicalParticipants: user._id }
            ]
        }).sort({ lastActivityAt: -1 });

        let partiesHosted = 0;
        let uniqueFriends = new Set();
        let history = [];
        let totalWatchTimeMs = 0;
        let videoCounts = {};

        rooms.forEach(room => {
            const isHost = room.hostId.toString() === user._id.toString();
            if (isHost) {
                partiesHosted++;
                if (room.historicalParticipants) {
                    room.historicalParticipants.forEach(pId => {
                        if (pId.toString() !== user._id.toString()) {
                            uniqueFriends.add(pId.toString());
                        }
                    });
                }
            }

            // Estimate watch time for this room
            let roomDurationString = "0m";
            if (room.lastActivityAt && room.createdAt) {
                const durationMs = room.lastActivityAt.getTime() - room.createdAt.getTime();
                if (durationMs > 0) {
                    totalWatchTimeMs += durationMs;
                    const h = Math.floor(durationMs / (1000 * 60 * 60));
                    const m = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                    roomDurationString = h > 0 ? `${h}h ${m}m` : `${m}m`;
                }
            }

            if (room.videoId) {
                videoCounts[room.videoId] = (videoCounts[room.videoId] || 0) + 1;
            }

            // Find user's role in this room (use participants array to get their last known role, or fallback)
            const participant = room.participants.find(p => p.userId.toString() === user._id.toString());
            let role = isHost ? "Host" : "Guest";
            if (participant && participant.role) {
                role = participant.role.charAt(0).toUpperCase() + participant.role.slice(1);
            }

            const thumbnail = room.videoId 
                ? `https://img.youtube.com/vi/${room.videoId}/hqdefault.jpg` 
                : 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400';

            history.push({
                id: room.roomCode,
                title: room.roomName,
                date: new Date(room.createdAt).toLocaleDateString() + ", " + new Date(room.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                duration: roomDurationString, 
                participants: room.historicalParticipants ? room.historicalParticipants.length : room.participants.length,
                role: role,
                thumbnail: thumbnail,
                status: room.isActive ? "Active" : "Completed"
            });
        });

        // Convert ms to hours and minutes
        const hours = Math.floor(totalWatchTimeMs / (1000 * 60 * 60));
        const minutes = Math.floor((totalWatchTimeMs % (1000 * 60 * 60)) / (1000 * 60));
        const watchTimeString = `${hours}h ${minutes}m`;

        let topVideoId = "None";
        let maxCount = 0;
        for (const [vid, count] of Object.entries(videoCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topVideoId = vid;
            }
        }
        let mostWatchedStr = maxCount > 0 ? `ID: ${topVideoId.substring(0, 8)}...` : 'None';

        res.status(200).json({
            success: true,
            stats: {
                totalWatchTime: watchTimeString,
                partiesHosted: partiesHosted.toString(),
                friendsJoined: uniqueFriends.size.toString(),
                mostWatched: mostWatchedStr
            },
            history: history
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
};