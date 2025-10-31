module.exports = {
  async up(db, client) {
    const roles = await db
      .collection("roles")
      .find({}, { projection: { name: 1 } })
      .toArray();

    console.log("================== ROLES IN DB ====================");
    roles.forEach((r) => {
      console.log(`_id: ${r._id}, name: ${r.name}`);
    });
    console.log("================ END =================");
  },

  async down(db, client) {
    console.log("No rollback for viewing roles");
  },
};
