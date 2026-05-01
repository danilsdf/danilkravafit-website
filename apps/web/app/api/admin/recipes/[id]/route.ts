import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminPayload, adminUnauthorized } from "@/lib/adminAuth";
import { computeNutritionTotals } from "@/lib/computeNutrition";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const { id } = await params;
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, ...update } = body;
    const db = await getDb();

    const ingredients = Array.isArray(update.ingredients) ? update.ingredients : [];
    const servings = Number(update.servings) || 1;
    const nutritionTotals = await computeNutritionTotals(db, ingredients, servings);

    await db
      .collection("Recipes")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...update, nutritionTotals, updatedAt: new Date() } }
      );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const { id } = await params;
    const { status } = await req.json();
    const db = await getDb();
    await db
      .collection("Recipes")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection("Recipes").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
