import mongoose from "mongoose";
import { ENV } from "./env.js";
import { logger } from "./logger.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${ENV.MONGO_URI}/${ENV.DB_NAME}`,
        );
        logger.info(
            `MONGODB CONNECTED SUCCESSFULLY! DB HOST ${connectionInstance.connection.host}`,
        );
    } catch (error) {
        logger.error(`MONGODB CONNECTION FAILED: `, error);
        process.exit(1);
    }
};

export default connectDB;
