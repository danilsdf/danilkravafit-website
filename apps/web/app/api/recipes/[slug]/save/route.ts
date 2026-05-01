import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// GET /api/recipes/[slug]/save — check if saved + get saved data
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ saved: false });

  const { slug } = await params;
  const db = await getDb();
  const doc = await db
    .collection("SavedRecipes")
    .findOne({ userId: user.userId, recipeSlug: slug });

  return NextResponse.json({ saved: !!doc, targetCalories: doc?.targetCalories ?? null, targetMacroSplit: doc?.targetMacroSplit ?? null });
}

// POST /api/recipes/[slug]/save — save recipe
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { slug } = await params;
  const body = await req.json().catch(() => ({}));
  const targetCalories: number | null =
    typeof body.targetCalories === "number" ? body.targetCalories : null;
  const targetMacroSplit: { protein: number; fat: number; carbs: number } | null =
    body.targetMacroSplit &&
    typeof body.targetMacroSplit.protein === "number" &&
    typeof body.targetMacroSplit.fat === "number" &&
    typeof body.targetMacroSplit.carbs === "number"
      ? body.targetMacroSplit
      : null;

  const db = await getDb();
  await db.collection("SavedRecipes").updateOne(
    { userId: user.userId, recipeSlug: slug },
    {
      $set: { targetCalories, targetMacroSplit, savedAt: new Date() },
      $setOnInsert: { userId: user.userId, recipeSlug: slug },
    },
    { upsert: true }
  );

  return NextResponse.json({ saved: true, targetCalories, targetMacroSplit });
}

// DELETE /api/recipes/[slug]/save — unsave recipe
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { slug } = await params;
  const db = await getDb();
  await db
    .collection("SavedRecipes")
    .deleteOne({ userId: user.userId, recipeSlug: slug });

  return NextResponse.json({ saved: false });
}
