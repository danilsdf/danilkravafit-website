import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
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

const TOLERANCE = 0.05; // allow ±0.05 kcal/g rounding difference

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

const ingredients = await db.collection("Ingredients").find({}).toArray();

console.log(`Checked ${ingredients.length} ingredients\n`);

let issues = 0;

for (const ing of ingredients) {
  const { name, kcalPer1g, proteinPer1g, carbsPer1g, fatPer1g } = ing;
  const expected = proteinPer1g * 4 + carbsPer1g * 4 + fatPer1g * 9;
  const diff = Math.abs((kcalPer1g ?? 0) - expected);

  if (diff > TOLERANCE) {
    console.log(`MISMATCH: ${name}`);
    console.log(
      `  stored kcalPer1g=${kcalPer1g}  expected=${expected.toFixed(4)}  diff=${diff.toFixed(4)}`
    );
    console.log(
      `  protein=${proteinPer1g}  carbs=${carbsPer1g}  fat=${fatPer1g}`
    );
    issues++;
  }
}

if (issues === 0) {
  console.log("All ingredients have correct calorie data.");
} else {
  console.log(`\n${issues} ingredient(s) have incorrect calorie data.`);
}

await client.close();
