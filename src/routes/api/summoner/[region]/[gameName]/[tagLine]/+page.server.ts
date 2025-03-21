import type { PageServerLoad } from './$types';
import { 
  getSummonerByRiotId, 
  getLeagueEntries, 
  getMatchIds, 
  getMatch, 
  getChampionMastery 
} from '$lib/services/riotApi';
import { fetchAnalysis } from '$lib/services/geminiApi';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const { region, gameName, tagLine } = params;
    
    if (!gameName || !tagLine) {
      throw error(400, 'Invalid summoner name format');
    }
    
    const summoner = await getSummonerByRiotId(region, gameName, tagLine);
    const leagueEntries = await getLeagueEntries(region, summoner.id);
    const matchIds = await getMatchIds(region, summoner.puuid, 30);
    
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
    const analysis = await fetchAnalysis(playerData);
    
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