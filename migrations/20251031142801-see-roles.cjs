module.exports = {
  async up(db) {
    const roles = await db.collection("roles").find().toArray();
    console.log(roles);
  },
  async down() {}
};
