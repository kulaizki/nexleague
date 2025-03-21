import { LEAGUE_API_KEY } from '$env/static/private';

export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  gameName?: string;
  tagLine?: string;
}

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface LeagueEntry {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface Match {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    participants: MatchParticipant[];
  };
}

export interface MatchParticipant {
  summonerId: string;
  summonerName: string;
  puuid: string;
  participantId: number;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  goldEarned: number;
  visionScore: number;
  win: boolean;
  role: string;
  lane: string;
  totalMinionsKilled: number;
}

const regionMapping: Record<string, string> = {
  'na1': 'americas',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',
  'euw1': 'europe',
  'eun1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',
  'kr': 'asia',
  'jp1': 'asia',
  'sg2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea',
  'oc1': 'sea'
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

// get match IDs for a summoner
export async function getMatchIds(region: string, puuid: string, count: number = 20): Promise<string[]> {
  const routingRegion = getRegionalRouting(region);
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
  
  const response = await fetch(url, {
    headers: {
      'X-Riot-Token': LEAGUE_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch match IDs: ${response.status}`);
  }

  return await response.json();
}

// get match data
export async function getMatch(region: string, matchId: string): Promise<Match> {
  const routingRegion = getRegionalRouting(region);
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  
  const response = await fetch(url, {
    headers: {
      'X-Riot-Token': LEAGUE_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch match data: ${response.status}`);
  }

  return await response.json();
}

// get champion mastery for a summoner
export async function getChampionMastery(region: string, summonerId: string): Promise<any[]> {
  const url = `${getBaseUrl(region)}/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`;
  const response = await fetch(url, {
    headers: {
      'X-Riot-Token': LEAGUE_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch champion mastery: ${response.status}`);
  }

  return await response.json();
}