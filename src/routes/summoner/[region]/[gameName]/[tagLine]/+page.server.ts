import type { PageServerLoad } from '../../../$types';
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
    console.log('load function called with params:', params);
    
    const { region, gameName, tagLine } = params as { 
      region: string; 
      gameName: string; 
      tagLine: string 
    };    
    
    if (!gameName || !tagLine) {
      console.error('Invalid summoner name format:', { gameName, tagLine });
      throw error(400, 'Invalid summoner name format');
    }
    
    console.log('Fetching summoner data...');
    const summoner = await getSummonerByRiotId(region, gameName, tagLine);
    console.log('Summoner data fetched:', summoner);
    
    console.log('Fetching league entries...');
    const leagueEntries = await getLeagueEntries(region, summoner.id);
    console.log('League entries fetched:', leagueEntries);
    
    console.log('Fetching match IDs...');
    const matchIds = await getMatchIds(region, summoner.puuid, 30);
    console.log('Match IDs fetched:', matchIds);
    
    console.log('Fetching match details...');
    const matches = await Promise.all(
      matchIds.slice(0, 30).map(id => getMatch(region, id))
    );
    console.log('Match details fetched:', matches);
    
    console.log('Fetching champion mastery data...');
    const championMastery = await getChampionMastery(region, summoner.id);
    console.log('Champion mastery data fetched:', championMastery);
    
    // Prepare player data for analysis
    console.log('Preparing player data for analysis...');
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
    console.log('Player data prepared:', playerData);
    
    // Analyze player data using Gemini API
    console.log('Fetching analysis from Gemini API...');
    const analysis = await fetchAnalysis(playerData);
    console.log('Analysis fetched:', analysis);
    
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