import { ProjectMember } from "../models/projectmember.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

export const validateProjectPermission = (roles = []) =>
    asyncHandler(async (req, _, next) => {
        const { projectId } = req.params;

        if (!projectId) {
            throw new ApiError(401, "Invalid project id");
        }

        const projectMember = await ProjectMember.findOne({
            project: mongoose.Types.ObjectId(projectId),
            user: mongoose.Types.ObjectId(req.user?._id),
        });

        if (!projectMember) {
            throw new ApiError(404, "Project member not found");
        }

        const givenRole = projectMember?.role;
        req.user?.role = givenRole;

        if (!roles.includes(givenRole)) {
            throw new ApiError(
                403,
                "you do not have permission to perform this action",
            );
        }

        next();
    });
