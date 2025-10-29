const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    console.log("🚀 Starting Super Admin seeding...");

    const roleCollection = db.collection("roles");
    const userCollection = db.collection("users");

    // 🧩 1️⃣ Load permissions from JSON file
    const permissionsPath = path.resolve("src/data/user-permissions.json");
    if (!fs.existsSync(permissionsPath)) {
      throw new Error("❌ user-permissions.json not found!");
    }

    const allRolesData = JSON.parse(fs.readFileSync(permissionsPath, "utf-8"));

    // Find super-admin entry from the array
    const superAdminData = allRolesData.find((r) => r.role === "super-admin");

    if (
      !superAdminData ||
      !superAdminData.role ||
      !superAdminData.permissions
    ) {
      throw new Error("❌ Invalid structure in user-permissions.json");
    }

    // 🧩 2️⃣ Ensure 'super-admin' role exists
    let role = await roleCollection.findOne({ role: superAdminData.role });

    if (!role) {
      console.log(`⚙️ Role '${superAdminData.role}' not found. Creating it...`);
      const result = await roleCollection.insertOne({
        role: superAdminData.role,
        permissions: superAdminData.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      role = await roleCollection.findOne({ _id: result.insertedId });
      console.log(`✅ Role '${superAdminData.role}' created.`);
    } else {
      console.log(
        `🔄 Role '${superAdminData.role}' already exists. Updating permissions...`
      );
      await roleCollection.updateOne(
        { _id: role._id },
        {
          $set: {
            permissions: superAdminData.permissions,
            updatedAt: new Date(),
          },
        }
      );
      console.log("✅ Role permissions updated.");
    }

    // 🧩 3️⃣ Check if Super Admin user already exists
    const existingUser = await userCollection.findOne({
      email: "abhay.sanyal@rampwin.com",
    });

    if (existingUser) {
      console.log("⚠️ Super Admin already exists, skipping user creation.");
      return;
    }

    // 🧩 4️⃣ Create new Super Admin user
    const hashedPassword = await bcrypt.hash("terp_admin123", 10);

    await userCollection.insertOne({
      username: "abhay_sanyal",
      contact_number: 8053915959,
      name: "Abhay Sanyal",
      email: "abhay.sanyal@rampwin.com",
      password: hashedPassword,
      role: role._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Super Admin user seeded successfully!");
  },

  async down(db, client) {
    const userCollection = db.collection("users");
    const roleCollection = db.collection("roles");

    await userCollection.deleteOne({ email: "abhay.sanyal@rampwin.com" });
    await roleCollection.deleteOne({ role: "super-admin" });

    console.log("⏪ Super Admin and role removed.");
  },
};
