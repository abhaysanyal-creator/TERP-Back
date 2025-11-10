module.exports = {
  async up(db, client) {
    const collection = db.collection("employees");

    const indexesToDrop = ["national_id_1"];

    console.log("🧹 Dropping indexes from 'organisations' collection...");

    for (const name of indexesToDrop) {
      try {
        await collection.dropIndex(name);
        console.log(`✅ Dropped index: ${name}`);
      } catch (error) {
        if (error.codeName === "IndexNotFound") {
          console.log(`⚠️  Index not found: ${name} (already removed)`);
        } else {
          console.error(`❌ Failed to drop index ${name}:`, error.message);
        }
      }
    }

    console.log("🎯 Index cleanup completed.");
  },

  async down(db, client) {
    console.log("🔁 Recreating previously dropped indexes...");
  },
};
