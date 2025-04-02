<script lang="ts">
  import type { Match } from '$types/match';
  import type { MatchParticipant } from '$types/matchParticipant';

  export let match: Match;
  export let summonerPuuid: string;
  export let latestDDragonVersion: string;
  export let championPlaceholder: string;
  export let formatDate: (timestamp: number) => string;
  export let getKDA: (kills: number, deaths: number, assists: number) => string;
  export let handleImageError: (event: Event, fallbackSrc: string) => void;

  let participant: MatchParticipant | undefined;

  // Find the participant corresponding to the summoner
  $: participant = match.info.participants.find((p: MatchParticipant) => p.puuid === summonerPuuid);

</script>

{#if participant}
  <div class="bg-gray-800 rounded-lg pt-4 pl-4 pr-4 flex flex-col md:flex-row gap-4">
    <!-- Champion Icon -->
    <div class="flex-shrink-0 flex flex-col items-center w-20">
      <div class={`rounded-full h-16 w-16 flex items-center justify-center ${participant.win ? 'bg-green-700/40' : 'bg-red-700/40'}`}>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/${latestDDragonVersion}/img/champion/${participant.championName}.png`}
          alt={participant.championName}
          class="h-14 w-14 rounded-full"
          loading="lazy"
          on:error={(e) => handleImageError(e, championPlaceholder)}
        />
      </div>
      <p class="text-sm mt-1 text-center truncate">{participant.championName}</p>
    </div>

    <!-- Match Details -->
    <div class="flex-grow">
      <div class="flex flex-wrap justify-between items-center mb-2 gap-x-4 gap-y-1">
        <span class={`font-bold ${participant.win ? 'text-green-400' : 'text-red-500'}`}>
          {participant.win ? 'Victory' : 'Defeat'}
        </span>
        <div class="text-sm text-gray-400 flex flex-wrap gap-x-2">
          <span>{match.info.gameMode}</span>
          <span>•</span>
          <span>{Math.floor(match.info.gameDuration / 60)}m {match.info.gameDuration % 60}s</span>
          <span>•</span>
          <span>{formatDate(match.info.gameCreation)}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p class="text-lg font-bold">{participant.kills} / {participant.deaths} / {participant.assists}</p>
          <p class="text-sm text-gray-400">
            KDA: {getKDA(participant.kills, participant.deaths, participant.assists)}
          </p>
        </div>

        <div>
          <p class="font-bold">CS: {participant.totalMinionsKilled}</p>
          <p class="text-sm text-gray-400">
            ({(participant.totalMinionsKilled / (match.info.gameDuration / 60 || 1)).toFixed(1)}/min)
          </p>
        </div>

        <div>
          <p class="font-bold">{participant.visionScore} Vision</p>
          {#if participant.role && participant.lane}
            <p class="text-sm text-gray-400">
              {participant.role}/{participant.lane}
            </p>
          {/if}
        </div>

        <div>
          <p class="font-bold">{Math.round(participant.totalDamageDealtToChampions / 1000)}k Dmg</p>
          <p class="text-sm text-gray-400">
            ({Math.round(participant.totalDamageTaken / 1000)}k Taken)
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}