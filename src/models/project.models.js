import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },

        description: {
            type: String,
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    },
);

export const Project = mongoose.model("Project", projectSchema);
