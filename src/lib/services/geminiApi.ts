import { GEMINI_API_KEY } from '$env/static/private';

/**
 * Function to analyze player data using Google's Gemini API
 * @param playerData - The player data to analyze
 * @returns The analysis results
 */
export async function analyzePlayerData(playerData: any): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `
    You are a League of Legends expert coach analyzing a player's profile. 
    Please provide a concise, personalized analysis of this player's performance, playstyle, and strengths.
    
    Be specific, supportive, and offer genuine compliments about their play style, champion choices, or skills.
    Keep your analysis to 3-4 paragraphs maximum.
    
    Here's the player data:
    ${JSON.stringify(playerData, null, 2)}
    
    In your analysis, include:
    1. A brief overview of their rank and experience
    2. Their main roles and champion preferences
    3. Specific strengths in their gameplay
    4. One encouraging suggestion for improvement
    
    Format your response as markdown.
  `;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to analyze player data: ${response.status}`);
  }
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}