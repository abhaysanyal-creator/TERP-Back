const { ObjectId } = require("mongodb");

module.exports = {
  async up(db) {
    const userId = new ObjectId("690af58a34cd23520ccaca21");

    // fetch the doc so we can restore on down()
    const user = await db.collection("users").findOne({ _id: userId });
    if (user) {
      // await db.collection("deleted_backup_users").insertOne(user);
      await db.collection("users").deleteOne({ _id: userId });
      console.log("✅ User deleted and backed up:", userId);
    } else {
      console.log("⚠️ No user found with id:", userId);
    }
  },

  async down(db) {},
};
