import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { sendMail, emailVerificationMailGenContent } from "../utils/mail.js";
import { hashIncommingUnHashedToken } from "../utils/hashToken.js";
import {
    cookieOptions,
    generateAccessAndRefreshToken,
} from "../utils/token.js";

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

const logoutUser = asyncHandler(async (req, res) => {});
const refreshAccessToken = asyncHandler(async (req, res) => {});
const forgotPasswordRequest = asyncHandler(async (req, res) => {});
const resetUserPassword = asyncHandler(async (req, res) => {});
const changeCurrectPassword = asyncHandler(async (req, res) => {});
const getCurrentUser = asyncHandler(async (req, res) => {});

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
