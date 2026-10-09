import roomModel from "../models/roomModel.js";
import { resolveParticipantId, hasPermission } from "./permissions.js";

export const setupRoomEvents = (socket, io) => {
    socket.on("join_room", async (payload) => {
        const { roomCode, userId, username } = payload;
        
        // Attach data to socket for disconnect handling
        socket.roomCode = roomCode;
        socket.userId = userId;
        socket.username = username;

        try {
            let room = await roomModel.findOne({ roomCode });
            if (room) {
                const participantId = await resolveParticipantId(userId);
                
                if (room.bannedUsers && room.bannedUsers.includes(participantId)) {
                    socket.emit("waiting_for_approval", { message: "You were removed previously. Waiting for host approval to rejoin..." });
                    io.in(roomCode).emit("join_request", {
                        userId: userId,
                        participantId: participantId,
                        username: username,
                        socketId: socket.id
                    });
                    return;
                }

                const role = room.hostId.toString() === participantId.toString() ? "host" : "participant";
                
                let joinedUser = room.participants.find(
                    (participant) => participant.userId.toString() === participantId?.toString()
                );
                const isHistorical = room.historicalParticipants && room.historicalParticipants.includes(participantId);

                if (role !== "host" && !joinedUser && !isHistorical) {
                    socket.emit("waiting_for_approval", { message: "Waiting for host approval to join..." });
                    io.in(roomCode).emit("join_request", {
                        userId: userId,
                        participantId: participantId,
                        username: username,
                        socketId: socket.id
                    });
                    return;
                }

                socket.join(roomCode);

                if (!joinedUser && participantId) {
                    const isHost = room.hostId.toString() === participantId.toString();
                    
                    if (isHost) {
                        await roomModel.updateOne(
                            { roomCode },
                            { $set: { "participants.$[elem].role": "participant" } },
                            { arrayFilters: [{ "elem.role": "host" }] }
                        );
                    }

                    // Restore preserved role (moderator/viewer) if set, otherwise default
                    const preservedRole = room.preservedRoles?.get(participantId.toString());
                    const assignedRole = isHost ? "host" : (preservedRole || "participant");

                    joinedUser = {
                        userId: participantId,
                        username: username,
                        role: assignedRole
                    };
                    room = await roomModel.findOneAndUpdate(
                        { roomCode },
                        { 
                            $push: { participants: joinedUser },
                            $addToSet: { historicalParticipants: participantId }
                        },
                        { new: true }
                    );
                } else if (participantId) {
                    // Ensure they are in historicalParticipants even if already in participants
                    room = await roomModel.findOneAndUpdate(
                        { roomCode },
                        { $addToSet: { historicalParticipants: participantId } },
                        { new: true }
                    );
                }
                
                io.in(roomCode).emit("user_joined", { 
                    userId: userId, 
                    username: username,
                    role: joinedUser ? joinedUser.role : "participant",
                    participants: room.participants 
                });

                if (room.videoId) {
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
                    
                    // Send current playback state after a short delay to allow the video to load
                    setTimeout(() => {
                        socket.emit("sync_state", {
                            playState: room.playState || "paused",
                            currentTime: actualCurrentTime, // Use the calculated time
                            videoId: room.videoId
                        });
                    }, 2000);
                }
            }
        } catch (error) {
            console.error("Error occurred while joining room:", error);
        }
    });

    socket.on("leave_room", async (payload) => {
        const { roomCode, userId, username } = payload;
        socket.leave(roomCode);

        try {
            // Remove the user from the database array
            const participantId = await resolveParticipantId(userId);
            if (!participantId) return;

            let updatedRoom = await roomModel.findOneAndUpdate(
                { roomCode },
                { $pull: { participants: { userId: participantId } } },
                { returnDocument: "after" }
            );

            if (updatedRoom) {
                // If the room has participants left, ensure at least one has host or moderator privileges
                if (updatedRoom.participants.length > 0) {
                    const hasHost = updatedRoom.participants.some(p => p.role === "host");
                    if (!hasHost) {
                        // Promote the first available participant to host
                        const newHostId = updatedRoom.participants[0].userId;
                        updatedRoom = await roomModel.findOneAndUpdate(
                            { roomCode, "participants.userId": newHostId },
                            { $set: { "participants.$.role": "host" } },
                            { new: true }
                        );
                        
                        if (updatedRoom) {
                            io.in(roomCode).emit("role_assigned", {
                                userId: newHostId,
                                username: updatedRoom.participants[0].username,
                                role: "host",
                                participants: updatedRoom.participants,
                                message: `${updatedRoom.participants[0].username} has been promoted to host.`
                            });
                        }
                    }
                }

                // Notify all clients in the room that a user has left
                socket.to(roomCode).emit("user_left", { 
                    userId: userId, 
                    username: username,
                    participants: updatedRoom ? updatedRoom.participants : [],
                    message: "A user has left the room." 
                });
            }
        } catch (error) {
            console.error("Error occurred while leaving room:", error);
        }
    });

    // role and participant events

    socket.on("assign_role", async (payload) => {
        const { roomCode, requesterId, targetUserId, newRole } = payload;
        
        if (await hasPermission(roomCode, requesterId, ["host", "moderator"])) {
            const resolvedRequesterId = await resolveParticipantId(requesterId);
            const room = await roomModel.findOne({ roomCode });
            if (!room) return;

            // Prevent moderators from changing the host's role or assigning the host role
            const targetUser = room.participants.find(p => p.userId.toString() === targetUserId);
            if (!targetUser) return;
            
            const requesterRole = room.participants.find(p => p.userId.toString() === resolvedRequesterId?.toString())?.role;
            if (requesterRole === "moderator") {
                if (targetUser.role === "host" || newRole === "host") {
                    socket.emit("error", { message: "Moderators cannot modify or assign the host role." });
                    return;
                }
                if (targetUser.role === "moderator" && targetUserId !== resolvedRequesterId?.toString()) {
                    socket.emit("error", { message: "Moderators cannot modify the role of another moderator." });
                    return;
                }
            }

            const updatedRoom = await roomModel.findOneAndUpdate(
                { roomCode, "participants.userId": targetUserId },
                { 
                    $set: { 
                        "participants.$.role": newRole,
                        [`preservedRoles.${targetUserId}`]: newRole  // persist so role survives disconnect/rejoin
                    } 
                },
                { new: true }
            );
            
            if (updatedRoom) {
                io.in(roomCode).emit("role_assigned", { 
                    userId: targetUserId, 
                    username: targetUser.username,
                    role: newRole,
                    participants: updatedRoom.participants,
                    message: `Role of ${targetUser.username} has been changed to ${newRole}.`
                });
            }
        } else {
            socket.emit("error", { message: "You do not have permission to change roles." });
        }
    });

    socket.on("remove_participant", async (payload) => {
        const { roomCode, requesterId, targetUserId } = payload;

        if (await hasPermission(roomCode, requesterId, ["host", "moderator"])) {
            const resolvedRequesterId = await resolveParticipantId(requesterId);
            const room = await roomModel.findOne({ roomCode });
            if (!room) return;

            // Prevent moderators from removing the host
            const targetUser = room.participants.find(p => p.userId.toString() === targetUserId);
            if (!targetUser) return;
            
            const requesterRole = room.participants.find(p => p.userId.toString() === resolvedRequesterId?.toString())?.role;
            if (requesterRole === "moderator") {
                if (targetUser.role === "host") {
                    socket.emit("error", { message: "Moderators cannot remove the host." });
                    return;
                }
                if (targetUser.role === "moderator" && targetUserId !== resolvedRequesterId?.toString()) {
                    socket.emit("error", { message: "Moderators cannot remove another moderator." });
                    return;
                }
            }

            // Remove the user from the database array using $pull
            const updatedRoom = await roomModel.findOneAndUpdate(
                { roomCode },
                { 
                    $pull: { participants: { userId: targetUserId } },
                    $addToSet: { bannedUsers: targetUserId }
                },
                { returnDocument: "after" }
            );

            if (updatedRoom) {
                // Notify all clients in the room that a participant has been removed
                io.in(roomCode).emit("participant_removed", { 
                    userId: targetUserId,
                    participants: updatedRoom.participants,
                    message: `A participant has been removed from the room.`
                });
            }
        } else {
            socket.emit("error", { message: "You do not have permission to remove participants." });
        }
    });

    socket.on("handle_join_request", async (payload) => {
        const { roomCode, requesterId, targetParticipantId, targetSocketId, targetUsername, approve } = payload;
        
        if (await hasPermission(roomCode, requesterId, ["host"])) {
            if (approve) {
                const joinedUser = {
                    userId: targetParticipantId,
                    username: targetUsername || "User",
                    role: "participant"
                };

                await roomModel.findOneAndUpdate(
                    { roomCode },
                    { 
                        $pull: { bannedUsers: targetParticipantId },
                        $addToSet: { historicalParticipants: targetParticipantId },
                        $push: { participants: joinedUser }
                    }
                );
                io.to(targetSocketId).emit("join_request_approved");
            } else {
                io.to(targetSocketId).emit("join_request_denied");
            }
        } else {
            socket.emit("error", { message: "Only the host can approve join requests." });
        }
    });

    socket.on("end_session", async (payload) => {
        const { roomCode, requesterId } = payload;
        
        // Only the host can end the session
        if (await hasPermission(roomCode, requesterId, ["host"])) {
            const room = await roomModel.findOneAndUpdate(
                { roomCode },
                { isActive: false, lastActivityAt: Date.now() },
                { new: true }
            );

            if (room) {
                // Notify everyone that the session has ended
                io.in(roomCode).emit("session_ended", {
                    message: "The host has ended the session."
                });
            }
        }
    });

    socket.on("chat_message", (payload) => {
        const { roomCode, message } = payload;
        // Broadcast to everyone else in the room
        socket.to(roomCode).emit("chat_message", message);
    });

    // cleanup on disconnect
    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.id}`);
        
        if (socket.roomCode && socket.userId) {
            try {
                const participantId = await resolveParticipantId(socket.userId);
                if (!participantId) return;

                let updatedRoom = await roomModel.findOneAndUpdate(
                    { roomCode: socket.roomCode },
                    { $pull: { participants: { userId: participantId } } },
                    { returnDocument: "after" }
                );

                if (updatedRoom) {
                    // If the room has participants left, ensure at least one has host or moderator privileges
                    if (updatedRoom.participants.length > 0) {
                        const hasHost = updatedRoom.participants.some(p => p.role === "host");
                        if (!hasHost) {
                            // Promote the first available participant to host
                            const newHostId = updatedRoom.participants[0].userId;
                            updatedRoom = await roomModel.findOneAndUpdate(
                                { roomCode: socket.roomCode, "participants.userId": newHostId },
                                { $set: { "participants.$.role": "host" } },
                                { new: true }
                            );
                            
                            if (updatedRoom) {
                                io.in(socket.roomCode).emit("role_assigned", {
                                    userId: newHostId,
                                    username: updatedRoom.participants[0].username,
                                    role: "host",
                                    participants: updatedRoom.participants,
                                    message: `${updatedRoom.participants[0].username} has been promoted to host.`
                                });
                            }
                        }
                    }

                    socket.to(socket.roomCode).emit("user_left", { 
                        userId: socket.userId, 
                        username: socket.username,
                        participants: updatedRoom ? updatedRoom.participants : [],
                        message: "A user has left the room." 
                    });
                }
            } catch (error) {
                console.error("Error handling disconnect:", error);
            }
        }
    });
};
