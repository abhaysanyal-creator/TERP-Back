const { ObjectId } = require("mongodb");

module.exports = {
  async up(db) {
    const idsToDelete = [
      new ObjectId("6902128419fbb258393a3bb9"),
      new ObjectId("6902128419fbb258393a3bba"),
      new ObjectId("6902128419fbb258393a3bbb"),
    ];

    console.log("Deleting specific roles......");

    const result = await db.collection("roles").deleteMany({
      _id: { $in: idsToDelete }
    });

    console.log(`Deleted count: ${result.deletedCount}`);
  },

  async down(db) {
    console.log("No down migration for deletion — manual restore required.");
  }
};
