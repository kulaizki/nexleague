import { LEAGUE_API_KEY } from '$env/static/private';
import type { Summoner } from '$types/summoner';
import type { RiotAccount } from '$types/riotAccount';
import type { LeagueEntry } from '$types/leagueEntry';
import type { Match } from '$types/match';

const regionMapping: Record<string, string> = {
  // Americas
  'na1': 'americas',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',
  'oc1': 'americas', 
  // Europe
  'euw1': 'europe',
  'eun1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',
  // Asia
  'kr': 'asia',
  'jp1': 'asia',
  // SEA
  'sg2': 'sea',
  'ph2': 'sea',
  'th2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea'
};

const getBaseUrl = (region: string) => {
  console.log(`getBaseUrl called with region: ${region}`);
  
  if (!region) {
    console.error('getBaseUrl called with empty region');
    throw new Error('Region is required');
  }
  
  // Make sure the region is lowercase for consistency with Riot API
  const normalizedRegion = region.toLowerCase();
  
  // Special handling for sea region - might need to use the platform ID
  if (normalizedRegion === 'sea') {
    console.warn('Direct SEA region passed to getBaseUrl - this may not work for platform-specific endpoints');
    console.warn('Consider using a specific platform ID (sg2, ph2, th2, tw2, vn2) instead');
  }
  
  const baseUrl = `https://${normalizedRegion}.api.riotgames.com/lol`;
  console.log(`getBaseUrl returning: ${baseUrl}`);
  return baseUrl;
};

const getRegionalRouting = (platformId: string): string => {
  console.log(`getRegionalRouting called with platformId: ${platformId}`);
  
  // Check if valid platform ID
  if (!platformId) {
    console.error('Empty platform ID provided');
    return 'sea'; // Default to sea
  }
  
  // Normalize platformId to lowercase
  const normalizedPlatformId = platformId.toLowerCase();
  
  // Special case for SEA region
  if (normalizedPlatformId === 'sea') {
    console.log('Direct SEA regional routing requested');
    return 'sea';
  }
  
  if (!regionMapping[normalizedPlatformId]) {
    console.warn(`Unknown platform ID: ${normalizedPlatformId}, defaulting to sea`);
  }
  
  const regionalRouting = regionMapping[normalizedPlatformId] || 'sea';
  console.log(`getRegionalRouting returning: ${regionalRouting} for ${normalizedPlatformId}`);
  return regionalRouting;
};

const fetchFromRiotAPI = async (url: string) => {
  console.log(`fetchFromRiotAPI called with url: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': LEAGUE_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text available');
      console.error(`API request failed with status ${response.status}: ${errorText}`);
      console.error(`Failed URL: ${url}`);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // For debug purposes, log a sample of the data
    if (url.includes('sea.api') || url.includes('sg2.api')) {
      console.log(`SEA region API response received for ${url} with status ${response.status}`);
      const sampleData = JSON.stringify(data).substring(0, 100) + '...';
      console.log(`Sample data: ${sampleData}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching data from Riot API (${url}):`, error);
    throw error;
  }
};

export const getSummonerByRiotId = async (platformId: string, gameName: string, tagLine: string): Promise<Summoner> => {
  console.log(`getSummonerByRiotId called with platformId: ${platformId}, gameName: ${gameName}, tagLine: ${tagLine}`);
  
  // Ensure platformId is lowercase for consistency
  const normalizedPlatformId = platformId.toLowerCase();
  console.log(`Normalized platformId: ${normalizedPlatformId}`);
  
  // Determine the REGIONAL routing for ACCOUNT V1 API (americas, asia, europe ONLY)
  let accountApiRegionalRouting: string;
  const generalRegionalRouting = getRegionalRouting(normalizedPlatformId);
  if (generalRegionalRouting === 'sea') {
    accountApiRegionalRouting = 'asia'; // Map SEA platforms to ASIA for Account V1
    console.log(`Mapping SEA platform ${normalizedPlatformId} to 'asia' for Account V1 API call.`);
  } else {
    accountApiRegionalRouting = generalRegionalRouting; 
  }
  console.log(`Account V1 API Regional routing determined: ${accountApiRegionalRouting}`);

  // First get the Riot Account information using the ACCOUNT V1 specific regional routing
  const accountUrl = `https://${accountApiRegionalRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  console.log(`Fetching account data from: ${accountUrl}`);
  
  try {
    const accountData: RiotAccount = await fetchFromRiotAPI(accountUrl);
    console.log(`Account data retrieved. PUUID: ${accountData.puuid}`);
    
    // Then get the summoner data using the PLATFORM ID specific endpoint (e.g., sg2.api...)
    const summonerUrl = `${getBaseUrl(normalizedPlatformId)}/summoner/v4/summoners/by-puuid/${accountData.puuid}`;
    console.log(`Fetching summoner data from: ${summonerUrl}`);
    
    const summonerData: Summoner = await fetchFromRiotAPI(summonerUrl);
    console.log(`Summoner data retrieved. ID: ${summonerData.id}`);
    
    const result = {
      ...summonerData,
      gameName: accountData.gameName,
      tagLine: accountData.tagLine
    };
    console.log(`getSummonerByRiotId returning:`, result);
    return result;
  } catch (error) {
    console.error(`Error fetching summoner data for ${gameName}#${tagLine} in region ${platformId}:`, error);
    // Log which URL failed if possible
    if (error instanceof Error && error.message.includes('API request failed')) {
       console.error(`The failing URL might be related to: ${accountUrl} or the subsequent summoner call`);
    }
    throw error;
  }
};

export const getSummonerByName = async (region: string, summonerName: string): Promise<Summoner> => {
  console.log(`getSummonerByName called with region: ${region}, summonerName: ${summonerName}`);
  const url = `${getBaseUrl(region)}/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;
  const result = await fetchFromRiotAPI(url);
  console.log(`getSummonerByName returning:`, result);
  return result;
};

export const getLeagueEntries = async (region: string, summonerId: string): Promise<LeagueEntry[]> => {
  console.log(`getLeagueEntries called with region: ${region}, summonerId: ${summonerId}`);
  const url = `${getBaseUrl(region)}/league/v4/entries/by-summoner/${summonerId}`;
  const result = await fetchFromRiotAPI(url);
  console.log(`getLeagueEntries returning:`, result);
  return result;
};

export const getMatchIds = async (region: string, puuid: string, count: number = 10): Promise<string[]> => {
  console.log(`getMatchIds called with region: ${region}, puuid: ${puuid}, count: ${count}`);
  try {
    const routingRegion = getRegionalRouting(region);
    console.log(`Using routing region: ${routingRegion} for region: ${region}`);
    
    const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
    const result = await fetchFromRiotAPI(url);
    console.log(`getMatchIds returning ${result.length} match IDs`);
    return result;
  } catch (error) {
    console.error(`Error fetching match IDs for puuid ${puuid} in region ${region}:`, error);
    return [];
  }
};

export const getMatch = async (region: string, matchId: string): Promise<Match> => {
  console.log(`getMatch called with region: ${region}, matchId: ${matchId}`);
  try {
    const routingRegion = getRegionalRouting(region);
    console.log(`Using routing region: ${routingRegion} for region: ${region}`);
    
    const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    const result = await fetchFromRiotAPI(url);
    return result;
  } catch (error) {
    console.error(`Error fetching match data for matchId ${matchId} in region ${region}:`, error);
    throw error;
  }
};

export const getChampionMastery = async (region: string, puuid: string): Promise<any[]> => {
  console.log(`getChampionMastery called with region: ${region}, puuid: ${puuid}`);
  try {
    // Notice the change from /by-summoner/{summonerId} to /by-puuid/{puuid}
    const url = `${getBaseUrl(region)}/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;
    const result = await fetchFromRiotAPI(url);
    return result;
  } catch (error) {
    console.warn('Unable to fetch champion mastery data:', error);
    return [];
  }
};
