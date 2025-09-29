import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, _, next) => {
    const errors = validationResult(req);
    console.log(errors);
    console.log(typeof errors);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedError = [];
    errors.array().map((err) =>
        extractedError.push({
            [err.path]: err.msg,
        }),
    );

    throw new ApiError(422, "Received data is not valid", extractedError);
};
