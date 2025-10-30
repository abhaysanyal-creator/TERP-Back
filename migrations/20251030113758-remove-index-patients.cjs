module.exports = {
  async up(db, client) {
    try {
      // Remove email index from patients companions list if exists
      const indexes = await db.collection("patients").indexes();
      const emailIndex = indexes.find(
        (idx) => idx.name === "companions_list.email_1"
      );

      if (emailIndex) {
        await db.collection("patients").dropIndex("companions_list.email_1");
        console.log("✅ Removed index: companions_list.email_1");
      } else {
        console.log("ℹ️ Index companions_list.email_1 not found, skipping");
      }

      // Set is_active = true for employees where field is missing
      const result = await db
        .collection("employees")
        .updateMany(
          { is_active: { $exists: false } },
          { $set: { is_active: true } }
        );

      console.log(
        `✅ Updated employees missing is_active: ${result.modifiedCount}`
      );
    } catch (error) {
      console.error("❌ Migration failed:", error);
    }
  },

  async down(db, client) {},
};
