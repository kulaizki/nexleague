<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { Summoner } from '$types/summoner';
  import type { LeagueEntry } from '$types/leagueEntry';

  export let summoner: Summoner;
  export let leagueEntries: LeagueEntry[];
  export let placeholderIcon: string;
  export let latestDDragonVersion: string;

  function handleImageError(event: Event, fallbackSrc: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackSrc;
  }

  function getQueueTypeDisplay(queueType: string): string {
    switch(queueType) {
      case 'RANKED_SOLO_5x5':
        return 'Ranked Solo/Duo';
      case 'RANKED_FLEX_SR':
        return 'Ranked Flex';
      case 'RANKED_TFT':
        return 'Ranked TFT';
      default:
        return queueType
          .replace(/^RANKED_/, '')
          .replace(/_/, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
    }
  }
</script>

<div class="bg-gradient-to-r from-gray-900 to-sky-700 p-6">
  <div class="flex flex-col md:flex-row items-center gap-6">
    <div class="flex-shrink-0">
      <div class="rounded-full h-24 w-24 overflow-hidden border-4 border-sky-300">
        <img 
          src={`https://ddragon.leagueoflegends.com/cdn/${latestDDragonVersion}/img/profileicon/${summoner.profileIconId}.png`}
          alt="Summoner Icon"
          on:error={(e) => handleImageError(e, placeholderIcon)}
          class="h-full w-full object-cover"
        />
      </div>
    </div>
    
    <div class="flex-grow text-center md:text-left">
      {#if summoner.gameName && summoner.tagLine}
        <h1 class="text-3xl font-bold text-white">{summoner.gameName}<span class="text-gray-400">#{summoner.tagLine}</span></h1>
      {:else}
        <h1 class="text-3xl font-bold text-white">{summoner.name}</h1>
      {/if}
      <p class="text-gray-300">Level {summoner.summonerLevel}</p>
      
      {#if leagueEntries && leagueEntries.length > 0}
        <div class="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
          {#each leagueEntries as entry}
            <div class="bg-gray-700 rounded-lg p-3 flex flex-col items-center" transition:fly={{ y: 20, duration: 300 }}>
              <p class="text-sm text-gray-400">{getQueueTypeDisplay(entry.queueType)}</p>
              <p class="font-bold">{entry.tier} {entry.rank}</p>
              <p class="text-sm">{entry.leaguePoints} LP</p>
              <p class="text-xs text-gray-400">
                {entry.wins}W {entry.losses}L 
                ({Math.round((entry.wins / (entry.wins + entry.losses || 1)) * 100)}%)
              </p>
            </div>
          {/each}
        </div>
      {:else}
        <p class="mt-4 text-gray-400">Unranked</p>
      {/if}
    </div>
  </div>
</div> 