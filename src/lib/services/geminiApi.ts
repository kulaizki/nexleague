/**
 * Fetches analysis of player data from the server's analyze API route.
 * @param playerData - The player data to analyze.
 * @returns A promise that resolves to the analysis result.
 */
export async function fetchAnalysis(playerData: any): Promise<string> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerData }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }

    const data = await response.json();
    return data.analysis || 'No analysis available at this time.';
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
