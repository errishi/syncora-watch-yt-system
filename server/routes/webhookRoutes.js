import express from "express";
import { clerkWebhook } from "../controllers/webhookController.js";

const whookRouter = express.Router();

// We use express.raw() here because Svix needs the raw buffer to verify the signature.
whookRouter.post("/clerk", express.raw({ type: "application/json" }), clerkWebhook);

export default whookRouter;