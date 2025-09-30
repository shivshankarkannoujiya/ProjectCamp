import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userLoginValidator } from "../validators/user.validators.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route("/register")
    .post(
        upload.single("avatar"),
        userLoginValidator(),
        validate,
        registerUser,
    );

export default router;
