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

// Function to get the latest Data Dragon version
async function getLatestDDragonVersion(fetchFn: typeof fetch): Promise<string> {
  try {
    const response = await fetchFn('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!response.ok) throw new Error('Failed to fetch DDragon versions');
    const versions = await response.json();
    return versions[0]; // First item is the latest version
  } catch (err) {
    console.error('Error fetching DDragon version:', err);
    return '14.6.1'; // Fallback to a recent known version
  }
}

// Function to get champion data and create ID-to-Name map
async function getChampionIdMap(version: string, fetchFn: typeof fetch): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  try {
    const response = await fetchFn(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
    if (!response.ok) throw new Error('Failed to fetch DDragon champion data');
    const championData = await response.json();
    
    for (const championName in championData.data) {
      const champ = championData.data[championName];
      map[champ.key] = championName; // champ.key is the numeric ID, championName is the string key
    }
  } catch (err) {
    console.error('Error fetching or processing DDragon champion data:', err);
    // Return an empty map or potentially a fallback map if needed
  }
  return map;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
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

    // Fetch DDragon data concurrently with Riot API calls
    const ddragonVersionPromise = getLatestDDragonVersion(fetch);
    const championMapPromise = ddragonVersionPromise.then(version => getChampionIdMap(version, fetch));
    
    console.log('Fetching summoner data...');
    const summonerPromise = getSummonerByRiotId(region, gameName, tagLine);
    
    // Wait for summoner data first as other calls depend on it
    const summoner = await summonerPromise;
    console.log('Summoner data fetched:', summoner);

    // Fetch remaining Riot API data concurrently
    console.log('Fetching league entries, match IDs, champion mastery...');
    const leagueEntriesPromise = getLeagueEntries(region, summoner.id);
    const matchIdsPromise = getMatchIds(region, summoner.puuid, 10);
    const championMasteryPromise = getChampionMastery(region, summoner.puuid);

    const [leagueEntries, matchIds, championMastery, latestDDragonVersion, championIdMap] = await Promise.all([
      leagueEntriesPromise,
      matchIdsPromise,
      championMasteryPromise,
      ddragonVersionPromise,
      championMapPromise
    ]);

    console.log('League entries fetched:', leagueEntries.length);
    console.log('Match IDs fetched:', matchIds.length);
    console.log('Champion mastery data fetched:', championMastery.length);
    console.log('Latest DDragon version:', latestDDragonVersion);
    console.log(`Champion ID Map created with ${Object.keys(championIdMap).length} entries.`);
    
    console.log('Fetching match details...');
    const matches = await Promise.all(
      matchIds.slice(0, 10).map(id => getMatch(region, id))
    );
    console.log('Match details fetched:', matches.length);
    
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
    console.log('Player data prepared:', Object.keys(playerData));
    
    // Analyze player data using Gemini API
    console.log('Fetching analysis from Gemini API...');
    const analysis = await fetchAnalysis(playerData, fetch); // Pass the fetch function
    console.log('Analysis fetched.');
    
    return {
      summoner,
      leagueEntries,
      matches,
      championMastery: championMastery.slice(0, 10), // Still pass the original mastery data
      analysis,
      latestDDragonVersion, // Pass the version to the page
      championIdMap // Pass the map to the page
    };
  } catch (err) {
    console.error('Error in page server load:', err);
    // Check if it's an error thrown by sveltekit or a generic error
    if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
       throw error(err.status as number, err.message as string);
    } else if (err instanceof Error) {
       throw error(500, err.message || 'Failed to fetch summoner data');
    } else {
       throw error(500, 'An unknown error occurred while fetching summoner data');
    }
  }
};