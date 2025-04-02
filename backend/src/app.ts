import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error";

dotenv.config();

const app = express();

// middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// routes

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Error Handler
app.use(errorMiddleware);

export default app;