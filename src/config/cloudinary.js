import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { ENV } from "./env.js";
import { logger } from "./logger.js";

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        logger.info(response);
        logger.info("file uploaded on cloudinary: ", { url: response.url });

        await fs.unlink(localFilePath);
        return response;
    } catch (error) {
        await fs.unlink(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };
