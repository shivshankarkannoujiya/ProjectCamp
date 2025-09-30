import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const isLoggedIn = asyncHandler(async (req, _, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized");
    }

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
        );
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token");
    }
});
