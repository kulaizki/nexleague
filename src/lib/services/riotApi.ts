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

const getBaseUrl = (region: string) => {
  console.log(`getBaseUrl called with region: ${region}`);
  const baseUrl = `https://${region}.api.riotgames.com/lol`;
  console.log(`getBaseUrl returning: ${baseUrl}`);
  return baseUrl;
};

const getRegionalRouting = (platformId: string): string => {
  console.log(`getRegionalRouting called with platformId: ${platformId}`);
  const regionalRouting = regionMapping[platformId] || 'sea';
  console.log(`getRegionalRouting returning: ${regionalRouting}`);
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
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    // console.log(`fetchFromRiotAPI returning data:`, data);
    return data;
  } catch (error) {
    console.error('Error fetching data from Riot API:', error);
    throw error;
  }
};

export const getSummonerByRiotId = async (platformId: string, gameName: string, tagLine: string): Promise<Summoner> => {
  console.log(`getSummonerByRiotId called with platformId: ${platformId}, gameName: ${gameName}, tagLine: ${tagLine}`);
  const regionalRouting = getRegionalRouting(platformId);
  const accountUrl = `https://${regionalRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const accountData: RiotAccount = await fetchFromRiotAPI(accountUrl);
  
  const summonerUrl = `${getBaseUrl(platformId)}/summoner/v4/summoners/by-puuid/${accountData.puuid}`;
  const summonerData: Summoner = await fetchFromRiotAPI(summonerUrl);
  
  const result = {
    ...summonerData,
    gameName: accountData.gameName,
    tagLine: accountData.tagLine
  };
  console.log(`getSummonerByRiotId returning:`, result);
  return result;
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
  // console.log(`getMatchIds called with region: ${region}, puuid: ${puuid}, count: ${count}`);
  const routingRegion = getRegionalRouting(region);
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
  const result = await fetchFromRiotAPI(url);
  // console.log(`getMatchIds returning:`, result);
  return result;
};

export const getMatch = async (region: string, matchId: string): Promise<Match> => {
  // console.log(`getMatch called with region: ${region}, matchId: ${matchId}`);
  const routingRegion = getRegionalRouting(region);
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  const result = await fetchFromRiotAPI(url);
  // console.log(`getMatch returning:`, result);
  return result;
};

export const getChampionMastery = async (region: string, summonerId: string): Promise<any[]> => {
  console.log(`getChampionMastery called with region: ${region}, summonerId: ${summonerId}`);
  const url = `${getBaseUrl(region)}/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`;
  const result = await fetchFromRiotAPI(url);
  // console.log(`getChampionMastery returning:`, result);
  return result;
};
