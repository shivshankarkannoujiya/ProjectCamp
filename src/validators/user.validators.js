import { body } from "express-validator";

const userRegistrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty().withMessage("username is required")
            .isLength({min: 3, max: 13}).withMessage("username must be between 3 and 13 characters"),
        body("fullname")
            .trim()
            .optional()
            .isLength({min: 3, max: 50}).withMessage("fullname must be between 3 and 50 characters"),
        body("password")
            .notEmpty().withMessage("password is required")
            .isLength({min: 6}).withMessage("password should be at least 6 char")
    ]
}


const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .isEmail().withMessage("Email is invalid")
            .notEmpty().withMessage("Email is required"),
        body("password")
            .notEmpty().withMessage("password is required")
            .isLength({min: 6}).withMessage("password should be at least 6 char")
    ]
}

export { userRegistrationValidator, userLoginValidator }