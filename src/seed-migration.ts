import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.model"; // adjust path if needed
import Role from "./models/role.model";

const uri = process.env.DATABASE_URI as string;

async function seedSuperAdmin() {
  console.log("Enter Seeding Script");
  try {
    await mongoose.connect(uri);
    console.log("📡 Connected to MongoDB");

    const role = await Role.findOne({ name: "super-admin" });
    if (!role) {
      console.error("Role 'super-admin' not found. Please seed roles first.");

      const superAdminRole = await Role.create({
        name: "super-admin",
        permissions: ["*"], // full access
      });
      console.log(`Seeded Role - ${superAdminRole}`);
      process.exit(1);
    }

    const exists = await User.findOne({ email: "abhay.sanyal@rampwin.com" });
    if (exists) {
      console.log("Super Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("terp_admin123", 10);

    await User.create({
      username: "abhay_sanyal",
      contact_number: 8053915959,
      name: "Abhay Sanyal",
      email: "abhay.sanyal@rampwin.com",
      password: hashedPassword,
      role: role._id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log("✅ Super Admin created successfully");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedSuperAdmin();
