const { ObjectId } = require("mongodb");

module.exports = {
  async up(db) {
    const ids = [
      new ObjectId("6902128419fbb258393a3bc2"),
      new ObjectId("6902128419fbb258393a3bc3"),
      new ObjectId("6902128419fbb258393a3bc4"),
      new ObjectId("6902128419fbb258393a3bc5"),
      new ObjectId("6902128419fbb258393a3bc6"),
      new ObjectId("690205f219fbb258393a3bb5"),
    ];

    console.log("🚀 Starting delete operation for roles:");
    ids.forEach((id) => console.log("   👉", id.toString()));

    const result = await db.collection("roles").deleteMany({
      _id: { $in: ids },
    });

    console.log(`✅ Deleted ${result.deletedCount} roles from DB`);
  },

  async down() {},
};
