import dotenv from "dotenv"

dotenv.config()

export const ENV = {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME,
    NODE_ENV: process.env.NODE_ENV || "development",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}