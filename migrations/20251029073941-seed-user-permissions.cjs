const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    console.log("🚀 Starting Permissions seeding...");

    const permissionsCollection = db.collection("roles");

    // Load JSON data
    const filePath = path.resolve("src/data/user-permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    let processedCount = 0;

    for (const permissionSet of permissionsData) {
      await permissionsCollection.updateOne(
        { role: permissionSet.role }, // find existing record by role
        {
          $set: {
            permissions: permissionSet.permissions,
            updated_at: new Date(),
          },
          $setOnInsert: {
            created_at: new Date(),
          },
        },
        { upsert: true }
      );

      processedCount++;
      console.log(
        `✅ Processed: ${permissionSet.role} (${permissionSet.permissions.length} permissions)`
      );
    }

    console.log(`🎉 Migration complete: ${processedCount} permission sets loaded`);
  },

  async down(db, client) {
    console.log("⏪ Rolling back Permissions seeding...");

    const permissionsCollection = db.collection("permissions");
    const filePath = path.resolve("src/data/user-permissions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const permissionsData = JSON.parse(rawData);

    const roles = permissionsData.map((item) => item.role);
    await permissionsCollection.deleteMany({ role: { $in: roles } });

    console.log(`🧹 Removed permissions for roles: ${roles.join(", ")}`);
  },
};
