import { ProjectMember } from "../models/projectmember.models.js";
import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { UserRolesEnum } from "../utils/constant.js";

const addMemberToProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "project not found");
    }

    const existingMember = await ProjectMember.findOne({
        project: projectId,
        user: userId,
    });

    if (existingMember) {
        throw new ApiError(409, "member already added to project");
    }

    const projectMember = await ProjectMember.create({
        project: projectId,
        user: userId,
    });

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
    const projectMembers = await ProjectMember.find();

    if (projectMembers.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No project members found"));
    }

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
    const { projectId, memberId } = req.params;
    const { role } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const member = await ProjectMember.findOne({
        _id: memberId,
        project: projectId,
    });

    if (!member) {
        throw new ApiError(404, "Project member not found");
    }

    if (
        member.role === UserRolesEnum.PROJECT_ADMIN &&
        role !== UserRolesEnum.PROJECT_ADMIN
    ) {
        throw new ApiError(
            403,
            "Project owner role cannot be changed through this action",
        );
    }

    member.role = role;
    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                member,
                "Project member role updated successfully",
            ),
        );
});

const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const deletedMember = await ProjectMember.findOneAndDelete({
        _id: memberId,
        project: projectId,
    });

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
