import type { Db } from "mongodb";
import bcrypt from "bcrypt";

export const up = async (db: Db) => {
  const users = db.collection("users");
  const exists = await users.findOne({ email: "superadmin@example.com" });
  if (!exists) {
    const hashedPassword = await bcrypt.hash("SuperSecure@123", 10);
    await users.insertOne({
      name: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "super-admin",
      created_at: new Date(),
      updated_at: new Date(),
    });
    console.log("✅ Super Admin created");
  }
};

export const down = async (db: Db) => {
  await db.collection("users").deleteOne({ email: "superadmin@example.com" });
  console.log("⏪ Super Admin removed");
};