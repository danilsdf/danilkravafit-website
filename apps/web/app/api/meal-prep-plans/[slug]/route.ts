import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const db = await getDb();

    const pipeline = [
      { $match: { id: slug } },
      {
        $lookup: {
          from: "Recipes",
          let: { recipeIds: "$recipes.recipeId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: { $ifNull: ["$$recipeIds", []] },
                        as: "rid",
                        in: { $toObjectId: "$$rid" },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                title: 1,
                slug: 1,
                imageUrl: 1,
                description: 1,
                servings: 1,
                servingUnit: 1,
                nutritionTotals: 1,
              },
            },
          ],
          as: "recipeDocs",
        },
      },
      {
        $addFields: {
          recipes: {
            $map: {
              input: { $ifNull: ["$recipes", []] },
              as: "r",
              in: {
                $mergeObjects: [
                  "$$r",
                  {
                    recipe: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$recipeDocs",
                            as: "doc",
                            cond: {
                              $eq: [
                                "$$doc._id",
                                { $toObjectId: "$$r.recipeId" },
                              ],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $project: { recipeDocs: 0 } },
    ];

    const plan = await db
      .collection("MealPrepPlans")
      .aggregate(pipeline)
      .next();

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
