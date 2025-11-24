module.exports = {
  async up() {
    console.log("Skipping corrupted migration");
  },

  async down() {
    console.log("Skipping down migration");
  },
};
