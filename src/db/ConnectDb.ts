import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../services/logger.service";

dotenv.config();

const connectionString = process.env.DATABASE_URI as string;

const ConnectDB = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV === "production") {
      await mongoose.connect(connectionString, {
        tls: true, // or ssl: true, both work
        tlsCAFile: "/usr/src/app/global-bundle.pem",
      });

      logger.info("Connected to DocumentDB successfully On SERVER ✅");
    } else {
      await mongoose.connect(connectionString); // no TLS locally
      logger.info(
        `Connected to MongoDB Atlas successfully LOCALLY ${mongoose.connection.name} on port ${mongoose.connection.port}`
      );
    }
  } catch (error) {
    console.error("Connection Failed", error);
    process.exit(1);
  }
};

export default ConnectDB;