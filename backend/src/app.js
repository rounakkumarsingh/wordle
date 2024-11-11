import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/user.routes.js";
import gameRouter from "./routes/game.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Wordle API",
            version: "1.0.0",
            description: "API documentation for the Wordle application",
        },
        servers: [
            {
                url: "http://localhost:5030/api/v1",
            },
        ],
    },
    apis: [
        "./src/routes/*.js",
        "./src/models/*.js",
        "./controllers/*.js",
        "./middlewares/*.js",
    ], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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
