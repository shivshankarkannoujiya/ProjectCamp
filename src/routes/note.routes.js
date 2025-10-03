import { Router } from "express";
import {
    createNote,
    getNoteById,
    getNotes,
    updateNote,
    deleteNote,
} from "../controllers/note.controllers.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constant.js";
import { validateProjectPermission } from "../middlewares/permission.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/:projectId")
    .post(
        isLoggedIn,
        validateProjectPermission([UserRolesEnum.PROJECT_ADMIN]),
        createNote,
    )
    .get(isLoggedIn, validateProjectPermission(AvailableUserRoles), getNotes);

router
    .route("/:projectId/n/:noteId")
    .get(isLoggedIn, validateProjectPermission(AvailableUserRoles), getNoteById)
    .put(
        isLoggedIn,
        validateProjectPermission([UserRolesEnum.PROJECT_ADMIN]),
        updateNote,
    )
    .delete(
        isLoggedIn,
        validateProjectPermission([UserRolesEnum.PROJECT_ADMIN]),
        deleteNote,
    );

export default router;
