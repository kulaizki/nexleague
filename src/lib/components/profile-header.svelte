<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { Summoner } from '$types/summoner';
  import type { LeagueEntry } from '$types/leagueEntry';

  export let summoner: Summoner;
  export let leagueEntries: LeagueEntry[];
  export let placeholderIcon: string;
  export let latestDDragonVersion: string;

  $: rankedSoloEntry = leagueEntries?.find(entry => entry.queueType === 'RANKED_SOLO_5x5');

  function handleImageError(event: Event, fallbackSrc: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackSrc;
  }
</script>

<div class="bg-gradient-to-r from-gray-900 to-sky-700 p-6">
  <div class="flex flex-col sm:flex-row items-center gap-6 justify-between">
    
    <div class="flex items-center gap-4 sm:gap-6">
      <div class="flex-shrink-0">
        <div class="rounded-full h-20 w-20 sm:h-24 sm:w-24 overflow-hidden border-4 border-sky-300">
          <img 
            src={`https://ddragon.leagueoflegends.com/cdn/${latestDDragonVersion}/img/profileicon/${summoner.profileIconId}.png`}
            alt="Summoner Icon"
            on:error={(e) => handleImageError(e, placeholderIcon)}
            class="h-full w-full object-cover"
          />
        </div>
      </div>
      
      <div class="text-left">
        {#if summoner.gameName && summoner.tagLine}
          <h1 class="text-xl sm:text-3xl font-bold text-white break-all">{summoner.gameName}<span class="text-gray-400">#{summoner.tagLine}</span></h1>
        {:else}
          <h1 class="text-xl sm:text-3xl font-bold text-white break-all">{summoner.name}</h1>
        {/if}
        <p class="text-sm sm:text-base text-gray-300">Level {summoner.summonerLevel}</p>
      </div>
    </div>

    <div class="flex-shrink-0 mt-4 sm:mt-0">
      {#if rankedSoloEntry}
        <div class="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center min-w-[160px]" transition:fly={{ y: 10, duration: 300 }}>
          {#if rankedSoloEntry.tier}
            <img 
              src={`/ranks/Rank=${rankedSoloEntry.tier}.png`}
              alt={rankedSoloEntry.tier}
              class="h-20 w-20 object-contain mb-2" 
            />
          {/if}
          <p class="text-lg font-bold">{rankedSoloEntry.tier} {rankedSoloEntry.rank}</p>
          <p class="text-sm">{rankedSoloEntry.leaguePoints} LP</p>
          <p class="text-xs text-gray-400 mt-1">
            {rankedSoloEntry.wins}W {rankedSoloEntry.losses}L 
            ({Math.round((rankedSoloEntry.wins / (rankedSoloEntry.wins + rankedSoloEntry.losses || 1)) * 100)}%)
          </p>
        </div>
      {:else}
        <div class="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center min-w-[160px] h-full justify-center" transition:fly={{ y: 10, duration: 300 }}>
          <p class="text-lg font-bold text-gray-400">Unranked</p>
        </div>
      {/if}
    </div>

  </div>
</div> 