import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { matches } = await request.json();

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0' });

    // Prepare the prompt for the Gemini API
    const prompt = `
      You are a League of Legends expert coach analyzing a player's match history.
      Please provide a concise, personalized analysis of this player's performance, playstyle, and strengths.

      Be specific, supportive, and offer genuine compliments about their play style, champion choices, or skills.
      Keep your analysis to 3-4 paragraphs maximum.

      Here's the player match data:
      ${JSON.stringify(matches, null, 2)}

      In your analysis, include:
      1. A brief overview of their rank and experience
      2. Their main roles and champion preferences
      3. Specific strengths in their gameplay
      4. One encouraging suggestion for improvement

      Format your response as markdown.
    `;

    // Generate content based on the matches
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return json({ summary });
  } catch (error) {
    console.error('Error in summary API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ error: errorMessage }, { status: 500 });
  }
};
