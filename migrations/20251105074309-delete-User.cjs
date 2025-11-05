const { ObjectId } = require("mongodb");

module.exports = {
  async up(db) {
    const userId = new ObjectId("690afe6e34cd23520ccacf91");

    // fetch the doc so we can restore on down()
    const user = await db.collection("users").findOne({ _id: userId });
    if (user) {
      // await db.collection("deleted_backup_users").insertOne(user);
      await db.collection("users").deleteOne({ _id: userId });
      console.log("✅ User deleted:", userId);
    } else {
      console.log("⚠️ No user found with id:", userId);
    }
  },

  async down(db) {},
};