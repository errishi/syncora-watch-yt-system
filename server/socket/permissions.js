import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import roomModel from "../models/roomModel.js";

export const resolveParticipantId = async (userId) => {
    if (mongoose.isValidObjectId(userId)) {
        return userId;
    }

    const user = await userModel.findOne({ clerkId: userId }).select("_id");
    return user?._id || null;
};

export const hasPermission = async (roomCode, userId, allowedRoles) => {
    try {
        const room = await roomModel.findOne({ roomCode, isActive: true });
        if (!room) return false;

        const participantId = await resolveParticipantId(userId);
        if (!participantId) return false;

        const user = room.participants.find(
            (participant) => participant.userId.toString() === participantId.toString()
        );
        return user && allowedRoles.includes(user.role);
    } catch (error) {
        console.error("RBAC Validation Error:", error);
        return false;
    }
};
