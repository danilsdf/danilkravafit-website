import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://danilkrava4_db_user:xhKGj2uIzshaExSb@danilclaster.wjm6hou.mongodb.net/?appName=DanilClaster";
const dbName = process.env.MONGODB_DB || "Data";

export async function GET() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const recipes = await db.collection("Recipes").find({}).toArray();
    await client.close();
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
