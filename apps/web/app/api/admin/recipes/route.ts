import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAdminPayload, adminUnauthorized } from "@/lib/adminAuth";
import { computeNutritionTotals } from "@/lib/computeNutrition";

export async function GET() {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const db = await getDb();
    const items = await db
      .collection("Recipes")
      .find({})
      .sort({ title: 1 })
      .toArray();
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const body = await req.json();
    if (!body.title?.trim())
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    if (!body.slug?.trim())
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });

    const db = await getDb();
    const existing = await db.collection("Recipes").findOne({ slug: body.slug.trim() });
    if (existing)
      return NextResponse.json({ error: "Slug already in use." }, { status: 409 });

    const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
    const servings = Number(body.servings) || 1;
    const nutritionTotals = await computeNutritionTotals(db, ingredients, servings);

    const now = new Date();
    const doc = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      description: body.description || null,
      imageUrl: body.imageUrl || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      servings,
      servingUnit: body.servingUnit || null,
      status: body.status || "draft",
      ingredients,
      instructions: Array.isArray(body.instructions) ? body.instructions : [],
      nutritionTotals,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection("Recipes").insertOne(doc);
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
