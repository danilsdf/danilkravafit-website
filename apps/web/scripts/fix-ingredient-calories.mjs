import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, "../.env.local");
const envVars = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const uri = envVars.MONGODB_URI;
const dbName = envVars.MONGODB_DB || "Data";

if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const TOLERANCE = 0.05;

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

const ingredients = await db.collection("Ingredients").find({}).toArray();
let fixed = 0;

for (const ing of ingredients) {
  const { _id, name, proteinPer1g, carbsPer1g, fatPer1g, kcalPer1g } = ing;
  const expected = proteinPer1g * 4 + carbsPer1g * 4 + fatPer1g * 9;
  const diff = Math.abs((kcalPer1g ?? 0) - expected);

  if (diff > TOLERANCE) {
    const rounded = Math.round(expected * 10000) / 10000;
    await db.collection("Ingredients").updateOne(
      { _id },
      { $set: { kcalPer1g: rounded, updatedAt: new Date() } }
    );
    console.log(`Fixed: ${name}  ${kcalPer1g} → ${rounded}`);
    fixed++;
  }
}

console.log(`\nUpdated ${fixed} ingredient(s).`);
await client.close();
