import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminPayload, adminUnauthorized } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const { id } = await params;
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, recipes: rawRecipes, ...fields } = body;
    const recipes = Array.isArray(rawRecipes)
      ? (rawRecipes as Array<{ recipeId: string; type: string; order: number }>).map(
          ({ recipeId, type, order }) => ({ recipeId, type, order })
        )
      : [];
    const db = await getDb();
    await db
      .collection("MealPrepPlans")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...fields, recipes, updatedAt: new Date() } }
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
    const { isActive } = await req.json();
    const db = await getDb();
    await db
      .collection("MealPrepPlans")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { isActive, updatedAt: new Date() } }
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
    await db.collection("MealPrepPlans").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
