// migrations/20251107120000-show-indexes.js
module.exports = {
  async up(db, client) {
    console.log("🔍 Fetching indexes from 'organisations' collection...");

    const indexes = await db.collection("organisation").indexes();

    console.log("📚 Existing Indexes:");
    console.table(indexes);

    // no schema changes here
  },

  async down(db, client) {
    // Nothing to rollback here
  },
};
