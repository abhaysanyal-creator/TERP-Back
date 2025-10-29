const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    console.log("🚀 Starting Permissions seeding...");

    const filePath = path.join(__dirname, "../src/data/permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    const permissionsCollection = db.collection("roles");

    for (const permissionSet of permissionsData) {
      // 👇 match and update using name instead of role
      await permissionsCollection.updateOne(
        { name: permissionSet.role }, // ✅ match by name
        {
          $set: {
            name: permissionSet.role, // ✅ store in name field
            permissions: permissionSet.permissions,
            updated_at: new Date(),
          },
          $setOnInsert: {
            created_at: new Date(),
          },
        },
        { upsert: true } // ✅ update or insert if not exists
      );

      console.log(`✅ Processed: ${permissionSet.role}`);
    }

    console.log("✅ Permissions seeding completed successfully.");
  },

  async down(db, client) {
    console.log("🧹 Reverting permissions seeding...");

    const filePath = path.join(__dirname, "../src/data/permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    const roleNames = permissionsData.map((p) => p.role);

    await db.collection("roles").deleteMany({
      name: { $in: roleNames },
    });

    console.log("✅ Reverted permissions seeding.");
  },
};
