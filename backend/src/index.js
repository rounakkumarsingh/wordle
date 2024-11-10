import dotenv from "dotenv";
import connectDB from "./db";
import app from "./app";

dotenv.config({
    path: "../.env",
    cridentials: true,
});

async () => {
    try {
        await connectDB();
        const server = app.listen(process.env.PORT ?? 5030, () => {
            console.log(
                `Server is running on port ${process.env.PORT ?? 5030}`
            );
        });
        console.log(server);
    } catch (error) {
        console.log("MONGO CONNECTION ERROR: ", error);
        process.exit(1);
    }
};
