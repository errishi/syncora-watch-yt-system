import dotenv from "dotenv";
dotenv.config();

import { Webhook } from "svix";
import userModel from "../models/userModel.js";

export const clerkWebhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("CLERK_WEBHOOK_SECRET is not set in the environment variables.");
        return res.status(500).json({
            success: false,
            message: "Server configuration error."
        });
    }

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({
            success: false,
            message: "Missing svix headers"
        });
    }

    const payload = req.body.toString("utf8");
    let event;

    try {
        const wh = new Webhook(WEBHOOK_SECRET);
        wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });

        event = JSON.parse(payload);
    } catch (error) {
        console.error("Error verifying webhook:", error.message);
        return res.status(400).json({ 
            success: false,
            message: "Invalid webhook signature" 
        });
    }

    const { id } = event.data;
    const eventType = event.type;

    try {
        if (eventType === "user.created" || eventType === "user.updated") {
            const { email_addresses, image_url, username, first_name } = event.data;

            const email = email_addresses[0]?.email_address;
            const displayName = username || first_name || email?.split("@")[0] || "User";

            await userModel.findOneAndUpdate(
                { clerkId: id },
                {
                    clerkId: id,
                    username: displayName,
                    email: email,
                    avatar: image_url || "",
                },
                { upsert: true, new: true }
            );
        }

        if (eventType === "user.deleted") {
            await userModel.findOneAndDelete({ clerkId: id });
            console.log(`User ${id} removed from database`);
        }

        res.status(200).json({
            success: true,
            message: "Webhook processed successfully"
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({
            success: false,
            message: "Error updating user"
        });
    }
};