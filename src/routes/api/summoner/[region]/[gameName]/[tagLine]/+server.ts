import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { 
  getSummonerByRiotId, 
  getLeagueEntries, 
  getMatchIds, 
  getMatch, 
  // getChampionMastery 
} from '$lib/services/riotApi';
import { fetchAnalysis } from '$lib/services/geminiApi';

export const GET: RequestHandler = async ({ params, fetch }) => {
  try {
    const { region, gameName, tagLine } = params;
    
    if (!gameName || !tagLine) {
      return json({ error: 'Invalid summoner name format' }, { status: 400 });
    }
    
    const summoner = await getSummonerByRiotId(region, gameName, tagLine);
    const leagueEntries = await getLeagueEntries(region, summoner.id);
    const matchIds = await getMatchIds(region, summoner.puuid, 10);
    
    const matches = await Promise.all(
      matchIds.slice(0, 10).map(id => getMatch(region, id))
    );
    
    // const championMastery = await getChampionMastery(region, summoner.id);
    
    // Prepare player data for analysis
    const playerData = {
      summoner,
      leagueEntries,
      matches,
      // championMastery
    };
    
    // Analyze player data using Gemini API
    const analysis = await fetchAnalysis(playerData, fetch); // Pass the fetch function
    
    return json({
      summoner,
      leagueEntries,
      matches: matches.slice(0, 10),
      // championMastery: championMastery.slice(0, 10),
      analysis
    });
  } catch (error: any) {
    console.error('Error processing summoner data:', error);
    return json({ error: error.message || 'Failed to fetch summoner data' }, { status: 500 });
  }
};