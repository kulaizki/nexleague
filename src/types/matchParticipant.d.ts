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