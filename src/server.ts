import dotenv from "dotenv";
dotenv.config();

import rateLimit from "express-rate-limit";
import express from "express";
import ConnectDB from "./db/ConnectDb.ts";
import { applicationMiddlewares } from "./middlewares/app.middlewares.ts";
import routes from "./routes/router.ts";
import ProjectModels from "./models/index.ts";
import cors from "cors";

const app = express();

applicationMiddlewares(app);

ConnectDB();

// app.use(
//   cors({
//     origin: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // all common HTTP methods
//     credentials: true,
//   })
// );

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

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on ${process.env.PORT}`)
);
