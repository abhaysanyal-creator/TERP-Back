const { ObjectId } = require("mongodb");

module.exports = {
  async up(db, client) {
    const employee = "691c54f8ac15646158c0f18a"; // <-- change if needed

    console.log("🚀 Starting user role migration (string → ObjectId)...");

    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(employee) },
      {
        $set: {
          password:
            "$2b$10$3nt1dbtrBSvYsV0oMDd/teexd8VIKAZ671PxIQunKouqah1Zz4rge",
        },
      }
    );

    console.log(`✅ Migration complete. Updated ${result} users.`);
  },
};
