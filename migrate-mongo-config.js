// migrate-mongo-config.js
require("dotenv").config();

module.exports = {
  mongodb: {
    url: process.env.DATABASE_URI,
    databaseName: process.env.DATABASE_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: "migrations",
  changelogCollectionName: "migrations_changelog",
};
