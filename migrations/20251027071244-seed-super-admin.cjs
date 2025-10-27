const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

module.exports = {
  async up(db, client) {
    console.log("🚀 Starting Super Admin seeding...");

    const roleCollection = db.collection("roles");
    const userCollection = db.collection("users");

    // Check if 'super-admin' role exists
    let role = await roleCollection.findOne({ name: "super-admin" });

    if (!role) {
      console.log("⚙️ Role 'super-admin' not found. Creating it...");
      const result = await roleCollection.insertOne({
        name: "super-admin",
        permissions: ["*"]
      });
      role = result.ops ? result.ops[0] : await roleCollection.findOne({ _id: result.insertedId });
      console.log("✅ Role 'super-admin' created.");
    }

    const existingUser = await userCollection.findOne({ email: "abhay.sanyal@rampwin.com" });
    if (existingUser) {
      console.log("⚠️ Super Admin already exists, skipping.");
      return;
    }

    // Create Super Admin user
    const hashedPassword = await bcrypt.hash("terp_admin123", 10);

    await userCollection.insertOne({
      username: "abhay_sanyal",
      contact_number: 8053915959,
      name: "Abhay Sanyal",
      email: "abhay.sanyal@rampwin.com",
      password: hashedPassword,
      role: role._id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log("✅ Super Admin seeded successfully!");
  },

  async down(db, client) {
    const userCollection = db.collection("users");
    const roleCollection = db.collection("roles");

    await userCollection.deleteOne({ email: "abhay.sanyal@rampwin.com" });
    await roleCollection.deleteOne({ name: "super-admin" });

    console.log("⏪ Super Admin and role removed.");
  },
};
