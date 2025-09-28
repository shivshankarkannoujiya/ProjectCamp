import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isCompelted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const SubTask = mongoose.model("SubTask", subtaskSchema);
