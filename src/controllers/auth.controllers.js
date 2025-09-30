import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import {
    sendMail,
    emailVerificationMailGenContent,
    forgotPasswordMailGenContent,
} from "../utils/mail.js";
import { hashIncommingUnHashedToken } from "../utils/hashToken.js";
import {
    cookieOptions,
    generateAccessAndRefreshToken,
} from "../utils/token.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        throw new ApiError(409, "user already exist");
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (!user) {
        throw new ApiError(400, "registration failed");
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save();

    await sendMail({
        email: user.email,
        subject: `Verify your email`,
        mailGenContent: emailVerificationMailGenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
        ),
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                },
            },
            "user registered successfully",
        ),
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const { hashedIncommingToken } = hashIncommingUnHashedToken(token);
    const user = await User.findOne({
        emailVerificationToken: hashedIncommingToken,
        emailVerificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "email verified successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "user not registered");
    }

    if (user.isEmailVerified) {
        throw new ApiError(400, "Email already verified");
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save();

    await sendMail({
        email: user.email,
        subject: `Verify your email`,
        mailGenContent: emailVerificationMailGenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/resend-verification/${unHashedToken}`,
        ),
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Verification email resent successfully"),
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "invalid creadentials");
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400, "please verify your email before login");
    }

    const isPasswordValid = user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "invalid creadentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        fullname: user.fullname,
                    },
                },
                "user loggedIn successfully",
            ),
        );
});

const logoutUser = asyncHandler(async (_, res) => {
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "user logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken;
    try {
        const decoded = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );

        const user = await User.findOne({
            _id: decoded._id,
        });

        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(200, {}, "access token refreshed successfully"),
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpiry;
    await user.save();

    await sendMail({
        email: user.email,
        subject: "Reset your password",
        mailGenContent: forgotPasswordMailGenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${unHashedToken}`,
        ),
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password reset link sent to your email"),
        );
});

const resetUserPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedIncommingToken = hashIncommingUnHashedToken(token);

    const user = await User.findOne({
        forgotPasswordToken: hashedIncommingToken,
        emailVerificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(404, "user does not exist");
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password reset successfully"));
});

const changeCurrectPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, _) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    fullname: user.fullname,
                },
            },
            "user fetched successfully",
        ),
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    resendVerificationEmail,
    refreshAccessToken,
    forgotPasswordRequest,
    resetUserPassword,
    changeCurrectPassword,
    getCurrentUser,
};
