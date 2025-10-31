module.exports = {
  async up(db, client) {
    console.log("Fetching roles...");

    const roles = await db.collection("roles").find({}).toArray();

    if (!roles.length) {
      console.log("No roles found in DB");
      return;
    }

    console.log("---- ROLES ----");
    roles.forEach((r) => {
      console.log(`ID: ${r._id} | NAME: ${r.name}`);
    });
    console.log("---------------");
  },

  async down(db, client) {
    console.log("Nothing to rollback");
  },
};



