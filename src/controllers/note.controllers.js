import { Note } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await Note.create({
        project: projectId,
        createdBy: req.user?._id,
        content,
    });

    const populatedNote = await Note.findById(note._id).populate(
        "createdBy",
        "username fullname, avatar",
    );

    return res
        .status(200)
        .json(new ApiResponse(200, populatedNote, "Note created succesfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId).populate(
        "createdBy",
        "username fullname, avatar",
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const notes = await Note.find({
        project: projectId,
    }).populate("createdBy", "username fullname, avatar");

    if (notes.length === 0) {
        throw new ApiResponse(200, [], "No project notes found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    const existingNote = await Note.findById(noteId);
    if (!existingNote) {
        throw new ApiError(404, "Note not found");
    }

    const updatedNote = await Note.findByIdAndUpdate(
        noteId,
        { content },
        { new: true },
    ).populate("createdBy", "username fullname, avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

export { createNote, getNoteById, getNotes, updateNote, deleteNote };
