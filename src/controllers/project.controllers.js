import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const existingProject = await Project.findOne({ name });
    if (existingProject) {
        throw new ApiError(409, "project alreay exist");
    }

    const project = await Project.create({
        name,
        description,
        createdBy: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, "project created successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate(
        "createdBy",
        "username email",
    );

    if (!project) {
        throw new ApiError(404, "project not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "project fetched successfully"));
});

const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().populate(
        "createdBy",
        "username email",
    );

    if (projects.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No projects found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, projects, "All projects fetched successfully"),
        );
});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const updatesFields = {
        ...(name && { name }),
        ...(description && { description }),
    };

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $set: updatesFields,
        },
        { new: true },
    );

    if (!updatedProject) {
        throw new ApiError(404, "porject not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { project: updatedProject },
                "project updated successfully",
            ),
        );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const deletedProject = await Project.findOneAndDelete(
            {
                _id: projectId,
                createdBy: req.user?._id,
            },
            { session },
        );

        if (!deletedProject) {
            throw new ApiError(404, "project not found");
        }

        await ProjectMember.deleteMany({ project: projectId }, { session });

        await session.commitTransaction();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { project: deletedProject },
                    "project deleted successfully",
                ),
            );
    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(500, {}, "Internal server error");
    } finally {
        session.endSession();
    }
});

export {
    createProject,
    getProjectById,
    getProjects,
    updateProject,
    deleteProject,
};
