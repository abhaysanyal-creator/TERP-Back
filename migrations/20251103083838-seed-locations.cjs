const axios = require("axios");
const { ObjectId } = require("mongodb");

const DATA_URL =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json";

module.exports = {
  async up(db) {
    console.log("🌍 Starting country/state/city seeding...");

    const countryCount = await db.collection("countries").countDocuments();
    if (countryCount > 0) {
      console.log("⚠️ Countries already exist. Skipping...");
      return;
    }

    // Fetch data
    console.log("📡 Fetching location data...");
    const { data } = await axios.get(DATA_URL);

    let countriesBulk = [];
    let statesBulk = [];
    let citiesBulk = [];

    for (const country of data) {
      const countryId = new ObjectId();

      countriesBulk.push({
        _id: countryId,
        name: country.name,
        code: country.iso2,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      });

      for (const state of country.states) {
        if (!state.name || !state.iso2) continue;

        const stateId = new ObjectId();

        statesBulk.push({
          _id: stateId,
          country: { _id: countryId, name: country.name },
          name: state.name,
          code: state.iso2,
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date()
        });

        if (state.cities?.length) {
          for (const city of state.cities) {
            citiesBulk.push({
              _id: new ObjectId(),
              country: { _id: countryId, name: country.name },
              state: { _id: stateId, name: state.name },
              name: city.name,
              is_deleted: false,
              created_at: new Date(),
              updated_at: new Date()
            });
          }
        }
      }
    }

    console.log(`📦 Inserting countries: ${countriesBulk.length}`);
    await db.collection("countries").insertMany(countriesBulk);

    console.log(`🏛️ Inserting states: ${statesBulk.length}`);
    await db.collection("states").insertMany(statesBulk);

    console.log(`🏙️ Inserting cities: ${citiesBulk.length}`);
    await db.collection("cities").insertMany(citiesBulk);

    console.log("✅ Seeding completed successfully!");
  },

  async down(db) {
    console.log("🧹 Removing seeded location data...");

    await db.collection("countries").deleteMany({});
    await db.collection("states").deleteMany({});
    await db.collection("cities").deleteMany({});

    console.log("✅ Cleanup complete");
  }
};
