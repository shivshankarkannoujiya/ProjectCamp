import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        avatar: {
            type: {
                url: String,
                localpath: String,
            },
            default: {
                url: `https://placehold.co/600x400`,
                localpath: "",
            },
        },

        username: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: true,
            index: true,
        },

        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: true,
            index: true,
        },

        fullname: {
            type: String,
            trim: true,
            required: true,
        },

        password: {
            type: String,
            minlength: 6,
            required: true,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        refreshToken: {
            type: String,
        },

        forgotPasswordToken: {
            type: String,
        },

        forgotPasswordTokenExpiry: {
            type: Date,
        },

        emailVerificationToken: {
            type: String,
        },

        emailVerificationTokenExpiry: {
            type: Date,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
};

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
};

userSchema.methods.generateTemporaryToken = async function () {
    const unHashedToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokenExpiry = Date.now() + 20 * 60 * 1000;

    return { unHashedToken, hashedToken, tokenExpiry };
};

export const User = mongoose.model("User", userSchema);
