import { LEAGUE_API_KEY } from '$env/static/private';
import type { Champion } from '$types/Champion';

// Interface for Summoner data
export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

// Interface for League Entry data
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

// Interface for Match data
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

// Interface for Match Participant data
export interface MatchParticipant {
  summonerId: string;
  summonerName: string;
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
  // Add more fields as needed
}

// Base URL for Riot API
const getBaseUrl = (region: string) => `https://${region}.api.riotgames.com/lol`;

// Function to get summoner data by summoner name
export async function getSummonerByName(region: string, summonerName: string): Promise<Summoner> {
  const url = `${getBaseUrl(region)}/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;
  const response = await fetch(url, {
    headers: {
      'X-Riot-Token': LEAGUE_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch summoner data: ${response.status}`);
  }

  return await response.json();
}

// Function to get league entries for a summoner
export async function getLeagueEntries(region: string, summonerId: string): Promise<LeagueEntry[]> {
  const url = `${getBaseUrl(region)}/league/v4/entries/by-summoner/${summonerId}`;
  const response = await fetch(url, {
    headers: {
      'X-Riot-Token': LEAGUE_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch league entries: ${response.status}`);
  }

  return await response.json();
}

// Function to get match IDs for a summoner
export async function getMatchIds(region: string, puuid: string, count: number = 20): Promise<string[]> {
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
    'oc1': 'sea'
  };
  
  const routingRegion = regionMapping[region] || 'americas';
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

// Function to get match data
export async function getMatch(region: string, matchId: string): Promise<Match> {
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
    'oc1': 'sea'
  };
  
  const routingRegion = regionMapping[region] || 'americas';
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

// Function to get champion mastery for a summoner
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