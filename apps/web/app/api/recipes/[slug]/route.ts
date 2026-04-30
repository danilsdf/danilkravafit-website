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
      { $match: { slug } },
      {
        $lookup: {
          from: "Ingredients",
          localField: "ingredients.ingredientId",
          foreignField: "_id",
          as: "ingredientDocs",
        },
      },
      {
        $addFields: {
          ingredients: {
            $map: {
              input: "$ingredients",
              as: "ingLine",
              in: {
                $mergeObjects: [
                  "$$ingLine",
                  {
                    ingredient: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$ingredientDocs",
                            as: "ingDoc",
                            cond: {
                              $eq: [
                                "$$ingDoc._id",
                                "$$ingLine.ingredientId",
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
      { $project: { ingredientDocs: 0 } },
    ];

    const recipe = await db.collection("Recipes").aggregate(pipeline).next();

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
