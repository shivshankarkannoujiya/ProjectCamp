import mongoose from "mongoose";
import { UserRolesEnum, AvailableUserRoles } from "../utils/constant.js";

const projectmemberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.MEMBER,
        },
    },
    { timestamps: true },
);

projectmemberSchema.index({ user: 1, project: 1 }, { unique: true });

export const ProjectMember = mongoose.model(
    "ProjectMember",
    projectmemberSchema,
);
