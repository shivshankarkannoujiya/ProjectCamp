import { ProjectMember } from "../models/projectmember.models.js";
import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constant.js";

const addMemberToProject = asyncHandler(async (req, res) => {
    const { username, email, role } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "project not found");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    await ProjectMember.findOneAndUpdate(
        {
            user: user._id,
            project: projectId,
        },
        {
            user: user._id,
            project: projectId,
            role: role,
        },
        {
            new: true,
            upsert: true,
        },
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                projectMember,
                "project member added successfully",
            ),
        );
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: projectId,
            },
        },

        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        fullname: 1,
                        avatar: 1,
                    },
                },
            ],
        },

        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0],
                },
            },
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMembers,
                "Project members fetched successfully",
            ),
        );
});

const updateProjectMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const { role } = req.body;

    if (!AvailableUserRoles.includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    let projectMember = await ProjectMember.findOne({
        project: projectId,
        user: userId,
    });

    if (!projectMember) {
        throw new ApiError(404, "Project member not found");
    }

    if (
        projectMember.role === UserRolesEnum.PROJECT_ADMIN &&
        role !== UserRolesEnum.PROJECT_ADMIN
    ) {
        throw new ApiError(
            403,
            "Project owner role cannot be changed through this action",
        );
    }

    projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role,
        },
        { new: true },
    );

    if (!projectMember) {
        throw new ApiError(404, "Project member not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "Project member role updated successfully",
            ),
        );
});

const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    const projectMember = await ProjectMember.findOne({
        project: projectId,
        user: userId,
    });

    if (!projectMember) {
        throw new ApiError(404, "Project member not found");
    }

    const deletedMember = await ProjectMember.findByIdAndDelete(
        projectMember._id,
    );

    if (!deletedMember) {
        throw new ApiError(404, "Project member not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedMember,
                "Project member deleted successfully",
            ),
        );
});

export {
    addMemberToProject,
    getProjectMembers,
    updateProjectMemberRole,
    deleteMember,
};
