import mongoose from "mongoose";
import { ProjectMember } from "./projectmember.models.js";

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
        timestamps: true,
    },
);

projectSchema.pre("remove", async function (next) {
    try {
        await ProjectMember.deleteMany({ project: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

export const Project = mongoose.model("Project", projectSchema);
