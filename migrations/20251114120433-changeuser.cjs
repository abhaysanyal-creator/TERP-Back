const { ObjectId } = require("mongodb");

module.exports = {
  async up(db, client) {
    const SUPER_ADMIN_ROLE_ID = "68f9d0c16eacc955f24f87fe"; // <-- change if needed

    console.log("🚀 Starting user role migration (string → ObjectId)...");

    const result = await db.collection("users").updateMany(
      { role: "super-admin" },
      { $set: { role: new ObjectId(SUPER_ADMIN_ROLE_ID) } }
    );

    console.log(`✅ Migration complete. Updated ${result.modifiedCount} users.`);
  },

  async down(db, client) {
    // Rollback: convert ObjectId back to string "super-admin"
    const SUPER_ADMIN_ROLE_ID = "68f9d0c16eacc955f24f87fe"; // same ID

    console.log("↩️ Reverting user role migration...");

    const result = await db.collection("users").updateMany(
      { role: new ObjectId(SUPER_ADMIN_ROLE_ID) },
      { $set: { role: "super-admin" } }
    );

    console.log(`🔄 Rollback complete. Reverted ${result.modifiedCount} users.`);
  },
};
