import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const createNote = asyncHandler(async (req, res) => {});
const getNoteById = asyncHandler(async (req, res) => {});
const getNotes = asyncHandler(async (req, res) => {});
const updateNote = asyncHandler(async (req, res) => {});
const deleteNote = asyncHandler(async (req, res) => {});

export { createNote, getNoteById, getNotes, updateNote, deleteNote };
