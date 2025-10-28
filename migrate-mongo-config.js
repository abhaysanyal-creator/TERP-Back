require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.DATABASE_URI,
    databaseName: process.env.DB_NAME,
    options: {},
  },

  migrationsDir: "migrations",
  changelogCollectionName: "migrations_changelog",
  migrationFileExtension: ".cjs", // 👈 critical in v12 — must be .cjs
  moduleSystem: "commonjs",
};

module.exports = config;