import dotenv from "dotenv";
dotenv.config(); // Load env variables first

import express from "express";
import ConnectDB from "./db/ConnectDb.js"; // 👈 add .js ONLY for Node ESM runtime
import { applicationMiddlewares } from "./middlewares/app.middlewares.js";
import routes from "./routes/router.js";

const app = express();

applicationMiddlewares(app);

ConnectDB();

app.use("/api/v1", routes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
