import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index..js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT ?? 8000;

connectDB()
    .then(
        app.listen(PORT, () => {
            console.log(`Server is listening at PORT:${PORT}`);
        }),
    )
    .catch((err) => {
        console.error(`MONGODB CINNECTION ERROR: `, err);
        process.exit(1);
    });
