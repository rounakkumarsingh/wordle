import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/user.routes.js";
import gameRouter from "./routes/game.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/games", gameRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);

app.use((err, _, res, __) => {
    const error =
        err instanceof ApiError
            ? err
            : new ApiError(
                  err.status || 500,
                  err.message || "Internal Server Error",
                  [],
                  process.env.NODE_ENV === "development" ? err.stack : undefined
              );
    console.log(err.stack);

    return res.status(error.statusCode).json({
        success: error.success,
        status: error.statusCode,
        message: error.message,
        errors: error.errors,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
});

export default app;
