import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import captainRoutes from "./routes/captain.routes.js";

const app = express();

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
    app.use(
        morgan(
            process.env.NODE_ENV === "production"
                ? "combined"
                : "dev"
        )
    );
}

// CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

// Health
app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "UrbanGo server is running",
    });
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/captains", captainRoutes);

// 404
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Error
app.use((err, req, res, next) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : err.message,
    });
});

export default app;