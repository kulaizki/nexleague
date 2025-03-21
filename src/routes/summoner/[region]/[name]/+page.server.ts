import type { PageServerLoad } from './$types';
import { 
  getSummonerByRiotId, 
  getLeagueEntries, 
  getMatchIds, 
  getMatch, 
  getChampionMastery 
} from '$lib/services/riotApi';
import { analyzePlayerData } from '$lib/services/geminiApi';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const { region, name } = params;
    
    // Decode the URL-encoded name
    const decodedName = decodeURIComponent(name);
    
    // Parse name and tag from the format "name#tag"
    const parts = decodedName.split('#');
    const gameName = parts[0];
    const tagLine = parts.length > 1 ? parts[1] : 'NA1'; // Default tag if not provided
    
    if (!gameName) {
      throw error(400, 'Invalid summoner name format');
    }
    
    const summoner = await getSummonerByRiotId(region, gameName, tagLine);
    const leagueEntries = await getLeagueEntries(region, summoner.id);
    const matchIds = await getMatchIds(region, summoner.puuid, 10);
    
    const matches = await Promise.all(
      matchIds.slice(0, 30).map(id => getMatch(region, id))
    );
    
    // Get champion mastery data
    const championMastery = await getChampionMastery(region, summoner.id);
    
    // Prepare player data for analysis
    const playerData = {
      summoner,
      leagueEntries,
      matches: matches.map(match => ({
        matchId: match.metadata.matchId,
        gameMode: match.info.gameMode,
        gameDuration: match.info.gameDuration,
        gameCreation: match.info.gameCreation,
        playerStats: match.info.participants.find(p => p.puuid === summoner.puuid)
      })),
      championMastery: championMastery.slice(0, 10)
    };
    
    // Analyze player data using Gemini API
    const analysis = await analyzePlayerData(playerData);
    
    return {
      summoner,
      leagueEntries,
      matches,
      championMastery: championMastery.slice(0, 10),
      analysis
    };
  } catch (err) {
    console.error('Error processing summoner data:', err);
    throw error(500, 'Failed to fetch summoner data');
  }
};