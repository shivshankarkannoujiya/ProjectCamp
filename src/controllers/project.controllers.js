import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const createProject = asyncHandler(async (req, res) => {});
const getProjectById = asyncHandler(async (req, res) => {});
const getProjects = asyncHandler(async (req, res) => {});
const updateProject = asyncHandler(async (req, res) => {});
const deleteProject = asyncHandler(async (req, res) => {});
const addMemberToProject = asyncHandler(async (req, res) => {});
const getProjectMembers = asyncHandler(async (req, res) => {});
const updateProjectMembers = asyncHandler(async (req, res) => {});
const updateProjectMemberRole = asyncHandler(async (req, res) => {});
const deleteMember = asyncHandler(async (req, res) => {});

export {
    createProject,
    getProjectById,
    getProjects,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateProjectMembers,
    updateProjectMemberRole,
    deleteMember,
};
