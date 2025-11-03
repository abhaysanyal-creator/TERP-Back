module.exports = {
  async up(db) {
    console.log("Fetching users from users collection...");

    const users = await db.collection("users").find({}).toArray();

    console.log(`Total users found: ${users.length}`);
    console.log("Sample users:");
    console.log(users.slice(0, 5)); // prints first 5 users to avoid huge logs

    return;
  },

  async down(db) {
    console.log("⚠️ No rollback. This migration only reads data.");
  }
};
