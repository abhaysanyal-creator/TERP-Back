import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DATABASE_URI as string;

// async function seedSuperAdmin() {
//   console.log("Enter Seeding Script");
//   try {
//     await mongoose.connect(uri);
//     console.log("📡 Connected to MongoDB");

//     const role = await Role.findOne({ name: "super-admin" });
//     if (!role) {
//       console.error("Role 'super-admin' not found. Please seed roles first.");

//       const superAdminRole = await Role.create({
//         name: "super-admin",
//         permissions: ["*"], // full access
//       });
//       console.log(`Seeded Role - ${superAdminRole}`);
//       process.exit(1);
//     }

//     const exists = await User.findOne({ email: "abhay.sanyal@rampwin.com" });
//     if (exists) {
//       console.log("Super Admin already exists");
//       return;
//     }

//     const hashedPassword = await bcrypt.hash("terp_admin123", 10);

//     await User.create({
//       username: "abhay_sanyal",
//       contact_number: 8053915959,
//       name: "Abhay Sanyal",
//       email: "abhay.sanyal@rampwin.com",
//       password: hashedPassword,
//       role: role._id,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     console.log("✅ Super Admin created successfully");
//   } catch (err) {
//     console.error("❌ Error during seeding:", err);
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 Disconnected from MongoDB");
//   }
// }

// seedSuperAdmin();

import mongoose from "mongoose";

import { logger } from "./services/logger.service";
import ConnectDb from "./db/ConnectDb";

import { Country } from "./models/country.model";
import { State } from "./models/state.model";
import { City } from "./models/city.model";
import axios from "axios";

const DATA_URL =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json";

interface APICity {
  id: number;
  name: string;
}

interface APIState {
  id: number;
  name: string;
  iso2: string;
  cities: APICity[];
}

interface APICountry {
  id: number;
  name: string;
  iso2: string;
  states: APIState[];
}

const fetchLocationData = async (): Promise<APICountry[]> => {
  logger.info("🌍 Fetching data from remote API...");
  const res = await axios.get(DATA_URL);
  return res.data;
};

const loadLocations = async (data: APICountry[]) => {
  const existingCountries = await Country.countDocuments();
  if (existingCountries > 0) {
    logger.info("⚠️ Countries already exist, skipping seeding...");
    return;
  }

  let countryCount = 0;
  let stateCount = 0;
  let cityCount = 0;

  for (const country of data) {
    const countryDoc = await Country.create({
      name: country.name,
      code: country.iso2,
      is_deleted: false,
    });
    countryCount++;

    for (const state of country.states) {
      if (!state.name || !state.iso2) continue;

      const stateDoc = await State.create({
        country: { _id: countryDoc._id, name: countryDoc.name },
        name: state.name,
        code: state.iso2,
        is_deleted: false,
      });
      stateCount++;

      if (state.cities?.length) {
        const cityDocs = state.cities.map((city) => ({
          country: { _id: countryDoc._id, name: countryDoc.name },
          state: { _id: stateDoc._id, name: stateDoc.name },
          name: city.name,
          is_deleted: false,
        }));

        await City.insertMany(cityDocs);
        cityCount += cityDocs.length;
      }
    }

    logger.info(
      `✅ Inserted country: ${country.name} (${
        country.states.length
      } states, ${country.states.reduce(
        (a, s) => a + (s.cities?.length || 0),
        0
      )} cities)`
    );
  }

  logger.info(
    `🎉 Migration done: ${countryCount} countries, ${stateCount} states, ${cityCount} cities`
  );
};

(async () => {
  logger.info("🚀 Starting migration...");
  try {
    await ConnectDb();
    const apiData = await fetchLocationData();
    await loadLocations(apiData);
  } catch (error) {
    logger.error("💥 Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info("🔌 Connection closed");
  }
})();
