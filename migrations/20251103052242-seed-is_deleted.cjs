module.exports = {
  async up(db) {
    console.log("Updating roles: setting is_deleted:false & is_active:true where missing...");

    const result = await db.collection("roles").updateMany(
      {
        $or: [
          { is_deleted: { $exists: false } },
          { is_active: { $exists: false } }
        ]
      },
      {
        $set: {
          is_deleted: false,
          is_active: true
        }
      }
    );

    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  },

  async down(db) {
    console.log("Reverting is_deleted & is_active fields on roles...");

    const result = await db.collection("roles").updateMany(
      {},
      { $unset: { is_deleted: "", is_active: "" } }
    );

    console.log(`Reverted: ${result.modifiedCount} roles`);
  }
};
