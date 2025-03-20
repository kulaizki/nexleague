import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { 
  getSummonerByName, 
  getLeagueEntries, 
  getMatchIds, 
  getMatch, 
  getChampionMastery 
} from '$lib/services/riotApi';
import { analyzePlayerData } from '$lib/services/geminiApi';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { region, name } = params;
    
    const summoner = await getSummonerByName(region, name);
    const leagueEntries = await getLeagueEntries(region, summoner.id);
    const matchIds = await getMatchIds(region, summoner.puuid, 10);
    
    const matches = await Promise.all(
      matchIds.slice(0, 30).map(id => getMatch(region, id))
    );
    
    const championMastery = await getChampionMastery(region, summoner.id);
    
    // Prepare player data for analysis
    const playerData = {
      summoner,
      leagueEntries,
      matches,
      championMastery
    };
    
    // Analyze player data using Gemini API
    const analysis = await analyzePlayerData(playerData);
    
    return json({
      summoner,
      leagueEntries,
      matches: matches.slice(0, 5),
      championMastery: championMastery.slice(0, 10),
      analysis
    });
  } catch (error) {
    console.error('Error processing summoner data:', error);
    return json({ error: 'Failed to fetch summoner data' }, { status: 500 });
  }
};