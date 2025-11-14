module.exports = {
  async up(db, client) {
    console.log("📌 Fetching all users...");

    const users = await db
      .collection("users")
      .find({})
      .toArray();

    console.log("👤 Total users:", users.length);
    console.log(JSON.stringify(users, null, 2));
  },

  async down(db, client) {
    console.log("No rollback needed.");
  },
};
