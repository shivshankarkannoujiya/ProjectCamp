import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const createTask = asyncHandler(async (req, res) => {});
const getTaskById = asyncHandler(async (req, res) => {});
const getTasks = asyncHandler(async (req, res) => {});
const updateTask = asyncHandler(async (req, res) => {});
const deleteTask = asyncHandler(async (req, res) => {});

export { createTask, getTaskById, getTasks, updateTask, deleteTask };
