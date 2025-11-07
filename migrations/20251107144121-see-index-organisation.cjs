// migrations/20251107121000-show-collection-indexes.js

module.exports = {
  async up(db, client) {
    console.log("🔍 Fetching indexes from 'organisations' collection...");

    const indexes = await db.collection("organisations").indexes();

    console.log("📚 Existing Indexes:");
    indexes.forEach((index) => {
      console.log("----------------------------------------------------");
      console.log("Name:", index.name);
      console.log("Keys:", JSON.stringify(index.key));
      if (index.unique) console.log("Unique:", index.unique);
      if (index.partialFilterExpression)
        console.log(
          "Partial Filter:",
          JSON.stringify(index.partialFilterExpression)
        );
    });

    console.log("✅ Done listing indexes.\n");
  },

  async down(db, client) {
    // no rollback needed
  },
};
