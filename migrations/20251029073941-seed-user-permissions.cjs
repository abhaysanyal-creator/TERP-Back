const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    console.log("🚀 Starting Permissions seeding...");

    const filePath = path.join(__dirname, "../src/data/user-permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    const rolesCollection = db.collection("roles");

    for (const role of permissionsData) {
    
      await rolesCollection.replaceOne(
        { name: role.name },
        {
          name: role.name,
          permissions: role.permissions,
          updated_at: new Date(),
          created_at: new Date(),
        },
        { upsert: true }
      );

      console.log(`✅ Processed: ${role.name} (${role.permissions.length} permissions)`);
    }

    console.log("🎉 Permissions seeding completed successfully.");
  },

  async down(db, client) {
    console.log("🧹 Reverting permissions seeding...");

    const filePath = path.join(__dirname, "../src/data/user-permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    const roleNames = permissionsData.map((p) => p.name);
    await db.collection("roles").deleteMany({ name: { $in: roleNames } });

    console.log("✅ Reverted permissions seeding.");
  },
};
