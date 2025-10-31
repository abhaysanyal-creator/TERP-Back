module.exports = {
  async up(db, client) {
    try {
      const roles = await db.collection("roles").find().toArray();
      console.log("===== ROLES DATA =====");
      console.log(JSON.stringify(roles, null, 2));
      console.log("===== END =====");
    } catch (err) {
      console.error("Error reading roles:", err);
    }
  },

  async down(db, client) {
  }
};