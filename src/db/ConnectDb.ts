import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import roleModel from "../models/role.model.js";
import userModel from "../models/user.model.js";

const connectionString = process.env.MONGODB_URI as string;

const ConnectDB = async (): Promise<void> => {
  try {
    if (!connectionString) return console.log("MongoDB String Not Available!!");
    await mongoose.connect(connectionString);

    console.log(`MongoDB connected: ${mongoose.connection.name} on port ${mongoose.connection.port} `);
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
//       console.log("Super-admin role created");
//     } else {
//       console.log("Super-admin role already exists");
//     }

//     const existingUser = await userModel.findOne({ username: "super_admin" });
//     if (!existingUser) {
//       const hashedPassword = await bcrypt.hash("terp_admin123", 10);

//       const superAdmin = await userModel.create({
//         username: "super_admin",
//         name:"superadmin",
//         email: "superadmin@gmail.com",
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
