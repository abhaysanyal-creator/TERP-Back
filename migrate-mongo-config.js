require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.DATABASE_URI || "mongodb://localhost:27017/terp",
    databaseName: process.env.DB_NAME || "terp",
    options: {},
  },

  migrationsDir: "migrations",
  changelogCollectionName: "migrations_changelog",
  migrationFileExtension: ".cjs", // 👈 critical in v12 — must be .cjs
  moduleSystem: "commonjs",        // 👈 also new in v12
};

module.exports = config;
