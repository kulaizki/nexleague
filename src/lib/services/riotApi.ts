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
  // Europe
  'euw1': 'europe',
  'eun1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',
  // Asia
  'kr': 'asia',
  'jp1': 'asia',
  // SEA
  'oc1': 'sea',
  'ph2': 'sea',
  'sg2': 'sea',
  'th2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea'
};

const getBaseUrl = (region: string) => `https://${region}.api.riotgames.com/lol`;

const getRegionalRouting = (platformId: string): string => {
  return regionMapping[platformId] || 'sea';
};

const fetchFromRiotAPI = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': LEAGUE_API_KEY
      }
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data from Riot API:', error);
    throw error;
  }
};

export const getSummonerByRiotId = async (platformId: string, gameName: string, tagLine: string): Promise<Summoner> => {
  const regionalRouting = getRegionalRouting(platformId);
  const accountUrl = `https://${regionalRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const accountData: RiotAccount = await fetchFromRiotAPI(accountUrl);
  
  const summonerUrl = `${getBaseUrl(platformId)}/summoner/v4/summoners/by-puuid/${accountData.puuid}`;
  const summonerData: Summoner = await fetchFromRiotAPI(summonerUrl);
  
  return {
    ...summonerData,
    gameName: accountData.gameName,
    tagLine: accountData.tagLine
  };
};

export const getSummonerByName = async (region: string, summonerName: string): Promise<Summoner> => {
  const url = `${getBaseUrl(region)}/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;
  return await fetchFromRiotAPI(url);
};

export const getLeagueEntries = async (region: string, summonerId: string): Promise<LeagueEntry[]> => {
  const url = `${getBaseUrl(region)}/league/v4/entries/by-summoner/${summonerId}`;
  return await fetchFromRiotAPI(url);
};

// Get match IDs for a summoner
export async function getMatchIds(region: string, puuid: string, count: number = 20): Promise<string[]> {
  const routingRegion = getRegionalRouting(region);
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
  return await fetchFromRiotAPI(url);
}

// Get match data
export async function getMatch(region: string, matchId: string): Promise<Match> {
  const routingRegion = getRegionalRouting(region);
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  return await fetchFromRiotAPI(url);
}

// Get champion mastery for a summoner
export async function getChampionMastery(region: string, summonerId: string): Promise<any[]> {
  const url = `${getBaseUrl(region)}/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`;
  return await fetchFromRiotAPI(url);
}