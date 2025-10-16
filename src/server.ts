import dotenv from "dotenv";
dotenv.config(); // Load env variables first

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

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1", rateLimiter);

app.use("/api/v1", routes);

const PORT = Number(process.env.PORT) || 5000;


app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on ${process.env.PORT}`)
);
