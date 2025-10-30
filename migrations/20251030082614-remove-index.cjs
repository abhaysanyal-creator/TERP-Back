const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    await db.collection("employees").dropIndex("mobile_phones_1");
    console.log("Removed Index");
  },

  async down(db, client) {},
};