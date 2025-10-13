import dotenv from "dotenv";
dotenv.config(); // Load env variables first

import express from "express";
import ConnectDB from "./db/ConnectDb.js"; // 👈 add .js ONLY for Node ESM runtime
import { applicationMiddlewares } from "./middlewares/app.middlewares.js";
import routes from "./routes/router.js";
import ProjectModels from "./models/index.js";
import cors from "cors"

const app = express();

applicationMiddlewares(app);
// app.use(morgan("dev"))
ConnectDB();

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use("/api/v1", routes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on ${process.env.PORT}`)
);
