import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
    },
    { timestamps: true },
);

export const Note = mongoose.model("Note", noteSchema);
