import { NextResponse } from "next/server";
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

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const db = await getDb();

  const saved = await db
    .collection("SavedRecipes")
    .aggregate([
      { $match: { userId: user.userId } },
      { $sort: { savedAt: -1 } },
      {
        $lookup: {
          from: "Recipes",
          localField: "recipeSlug",
          foreignField: "slug",
          as: "recipe",
        },
      },
      { $unwind: { path: "$recipe", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 0,
          savedAt: 1,
          targetCalories: 1,
          targetMacroSplit: 1,
          "recipe.title": 1,
          "recipe.slug": 1,
          "recipe.imageUrl": 1,
          "recipe.description": 1,
          "recipe.tags": 1,
          "recipe.servings": 1,
          "recipe.servingUnit": 1,
          "recipe.nutritionTotals": 1,
        },
      },
    ])
    .toArray();

  return NextResponse.json(saved);
}
