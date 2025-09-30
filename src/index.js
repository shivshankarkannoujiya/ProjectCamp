import app from "./app.js";
import { ENV } from "./config/env.js";
import { logger } from "./config/logger.js";
import connectDB from "./config/index..js";


connectDB()
    .then(
        app.listen(ENV.PORT, () => {
            logger.info(`Server is listening at PORT:${ENV.PORT}`);
        }),
    )
    .catch((err) => {
        logger.error(`MONGODB CONNECTION ERROR: `, err);
        process.exit(1);
    });
