import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    
});

export { registerUser };
