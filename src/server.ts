import dotenv from "dotenv";
dotenv.config();

import rateLimit from "express-rate-limit";
import "./models/index";
import express from "express";
import ConnectDB from "./db/ConnectDb"
import { applicationMiddlewares } from "./middlewares/app.middlewares";
import routes from "./routes/router";
import cors from "cors";

const app = express();

applicationMiddlewares(app);

ConnectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1", rateLimiter);

app.use("/api/v1", routes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT || 5000, "0.0.0.0", () => {
  PORT
    ? console.log(`Server running on - ${process.env.PORT}`)
    : console.log("Server running on 5000");
  // console.log(`Server running on ${process.env.PORT}`);
});

app.get("/health", (req, res) => {

  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});