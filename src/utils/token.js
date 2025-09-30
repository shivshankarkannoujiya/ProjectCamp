import { User } from "../models/user.models.js";
import { ApiError } from "./api-error";

export const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "user does not exist");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
};

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
