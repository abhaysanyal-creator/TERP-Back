module.exports = {
  async up(db, client) {
    console.log("================ END ==================");
  },

  async down(db, client) {
    console.log("No rollback for viewing roles");
  },
};
