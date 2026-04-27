import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { age, sex, weight, height, units, activity, goal, calories, formula } =
    await req.json();

  const weightLabel = units === "imperial" ? `${weight} lbs` : `${weight} kg`;
  const heightLabel =
    units === "imperial" ? `${height}` : `${height} cm`;

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system:
      "You are a concise, practical sports nutrition coach. Give actionable, evidence-based advice. Keep the response under 250 words. Use short bullet points. No fluff.",
    prompt: `A person just calculated their daily calorie target. Give them 4–5 personalized nutrition tips based on their profile.

Profile:
- Age: ${age}
- Sex: ${sex}
- Weight: ${weightLabel}
- Height: ${heightLabel}
- Activity level: ${activity}
- Goal: ${goal}
- Formula used: ${formula}
- Daily calorie target: ${calories} kcal

Focus tips on: macros split, meal timing, protein target, and one goal-specific tip.`,
  });

  return result.toTextStreamResponse();
}
