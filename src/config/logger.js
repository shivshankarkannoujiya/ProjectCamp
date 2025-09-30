import winston from "winston";
import { ENV } from "./env.js";

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
});

if (ENV.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
    );
}
