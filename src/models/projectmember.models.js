import mongoose from "mongoose";
import { UserRolesEnum, AvailableTaskStatuses } from "../utils/constant.js";

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
            enum: AvailableTaskStatuses,
            default: UserRolesEnum.MEMBER,
        },
    },
    { timestamps: true },
);

export const ProjectMember = mongoose.model(
    "ProjectMember",
    projectmemberSchema,
);
