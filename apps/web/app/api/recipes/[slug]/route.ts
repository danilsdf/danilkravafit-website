import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://danilkrava4_db_user:xhKGj2uIzshaExSb@danilclaster.wjm6hou.mongodb.net/?appName=DanilClaster";
const dbName = process.env.MONGODB_DB || "Data";

export async function GET(req: Request) {
    // Extract slug from the URL path
    const url = new URL(req.url);
    const slug = url.pathname.split("/").pop();
    if (!slug) {
        return NextResponse.json({ error: "No slug provided" }, { status: 400 });
    }
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);
        // Aggregate to join ingredients
        const pipeline = [
            { $match: { slug } },
            {
                $lookup: {
                    from: "Ingredients",
                    localField: "ingredients.ingredientId",
                    foreignField: "_id",
                    as: "ingredientDocs"
                }
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
                                                        cond: { $eq: ["$$ingDoc._id", "$$ingLine.ingredientId"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            { $project: { ingredientDocs: 0 } }
        ];
        const recipe = await db.collection("Recipes").aggregate(pipeline).next();
        await client.close();
        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }
        return NextResponse.json(recipe);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
