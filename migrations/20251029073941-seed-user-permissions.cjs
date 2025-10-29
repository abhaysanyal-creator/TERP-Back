const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    console.log("🚀 Starting Permissions seeding...");

    const filePath = path.join(__dirname, "../src/data/permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    const rolesCollection = db.collection("roles");

    for (const role of permissionsData) {
      // 🧹 Remove existing role if already present (e.g. super-admin)
      await rolesCollection.deleteOne({ name: role.name });

      // 🆕 Reinsert updated role + permissions
      await rolesCollection.insertOne({
        name: role.name,
        permissions: role.permissions,
        created_at: new Date(),
        updated_at: new Date(),
      });

      console.log(`✅ Refreshed role: ${role.name}`);
    }

    console.log("🎉 Permissions seeding completed successfully.");
  },

  async down(db, client) {
    console.log("🧹 Reverting permissions seeding...");

    const filePath = path.join(__dirname, "../src/data/permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    const names = permissionsData.map((p) => p.name);
    await db.collection("roles").deleteMany({ name: { $in: names } });

    console.log("✅ Reverted permissions seeding.");
  },
};
