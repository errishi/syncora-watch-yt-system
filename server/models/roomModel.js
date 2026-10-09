import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  username: {
    type: String,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    enum: ["host", "moderator", "participant", "viewer"],
    default: "participant",
  },

  joinedAt: {
    type: Date,
    default: Date.now,
  },
},
  {
    _id: false,
  }
);

const roomSchema = new mongoose.Schema({
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    roomName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    videoId: {
      type: String,
      default: "",
      trim: true,
    },

    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    playState: {
      type: String,
      enum: ["playing", "paused"],
      default: "paused",
    },

    currentTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    participants: {
      type: [participantSchema],
      default: [],
    },

    historicalParticipants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    bannedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    // Persists the last assigned role per userId so moderators/viewers keep their role on rejoin
    preservedRoles: {
      type: Map,
      of: String,
      default: {},
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    videoUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("Room", roomSchema);

export default roomModel;