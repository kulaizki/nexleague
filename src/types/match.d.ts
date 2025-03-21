import type { MatchParticipant } from '$types/matchParticipant';

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