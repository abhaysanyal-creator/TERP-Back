import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../services/logger.service";
// import roleModel from "../models/role.model.js"
// import userModel from "../models/user.model.js"
// import bcrypt from "bcrypt"

dotenv.config();

const connectionString = process.env.DATABASE_URI as string;

const ConnectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(connectionString, {
      tls: true, // or ssl: true, both work
      tlsCAFile: "/usr/src/app/global-bundle.pem", // absolute path inside container
    });

    logger.info("Connected to DocumentDB successfully ✅");

    console.log(
      `MongoDB connected: ${mongoose.connection.name} on port ${mongoose.connection.port}`
    );
  } catch (error) {
    console.error("Connection Failed", error);
    process.exit(1);
  }
};

// const seedSuperAdmin = async () => {
//   try {
//     await ConnectDB();

//     // Check if super-admin role exists
//     let superAdminRole = await roleModel.findOne({ name: "super-admin" });

//     if (!superAdminRole) {
//       superAdminRole = await roleModel.create({
//         name: "super-admin",
//         permissions: ["*"], // full access
//       });
//       console.log("super-admin role created");
//     } else {
//       console.log("super-admin role already exists");
//     }

//     const existingUser = await userModel.findOne({ username: "super_admin" });
//     if (!existingUser) {
//       const hashedPassword = await bcrypt.hash("terp_admin123", 10);

//       const superAdmin = await userModel.create({
//         username: "super_admin",
//         name:"superAdmin",
//         email: "super@gmail.com",
//         password: hashedPassword,
//         role: superAdminRole._id,
//       });

//       console.log("Super-admin created:", superAdmin.username);
//     } else {
//       console.log("Super-admin already exists:", existingUser.username);
//     }

//     process.exit(0);
//   } catch (error) {
//     console.error("Super Admin Script failed:", error);
//     process.exit(1);
//   }
// };

// seedSuperAdmin();

export default ConnectDB;
