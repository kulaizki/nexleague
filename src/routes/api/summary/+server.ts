import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { playerData } = await request.json(); 
    
    // Basic validation
    if (!playerData || typeof playerData !== 'object') {
      return json({ error: 'Invalid player data received' }, { status: 400 });
    }
    
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); 

    const prompt = `
      You are a League of Legends expert coach analyzing a player's profile data.

      Use third person e.g., "This player is good at midlane" instead of "You are good at midlane.
      Don't include saying things about analyzing the data given e.g., "With the data available".
      Don't use redundant words or phrases e.g., multiple "This player".

      Please provide a concise, personalized analysis of this player's performance, playstyle, and potential strengths.

      Be specific, supportive, and offer genuine compliments based on the data provided (rank, champion choices, match stats, mastery, etc.).
      Keep your analysis to 2 paragraphs always.

      Format all champion names as **HeroName** (bold) so they can be styled distinctly.
      Here's the player data:
      ${JSON.stringify(playerData, null, 2)}

      In your analysis, please include:
      1. A brief, friendly acknowledgement of their rank/experience based on leagueEntries.
      2. Observations about their likely main roles and champion preferences based on matches and championMastery.
      3. Specific strengths identified from their match statistics (KDA, CS, vision, etc.) or high mastery points.
      4. One encouraging and actionable suggestion for improvement based on the data.

      Format your response as markdown. Be encouraging and avoid overly critical language.
    `;

    // Generate content based on the full player data
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    if (!response || !response.text) {
        console.error('Gemini API did not return a valid response or text function.', response);
        throw new Error('Gemini API did not return a valid response.');
    }

    const summary = response.text();

    return json({ summary });
  } catch (error) {
    console.error('Error in summary API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ error: `Failed to generate analysis: ${errorMessage}` }, { status: 500 });
  }
};
