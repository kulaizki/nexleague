<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { ChampionMastery } from '$types/championMastery';

  export let championMastery: ChampionMastery[];
  export let championIdMap: Record<string, string>;
  export let latestDDragonVersion: string;
  export let championPlaceholder: string;

  function handleImageError(event: Event, fallbackSrc: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackSrc;
  }

  function getChampionNameById(id: number): string {
    return championIdMap[id.toString()] || 'UnknownChamp';
  }
</script>

<div transition:fly={{ y: 10, duration: 200 }}>
  <h2 class="text-2xl font-bold mb-4 text-sky-500 [text-shadow:0_0_8px_rgba(0,200,255,0.5)]">Champion Mastery</h2>
  
  {#if championMastery && championMastery.length > 0 && championIdMap && Object.keys(championIdMap).length > 0}
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      {#each championMastery as mastery}
        {@const championName = getChampionNameById(mastery.championId)}
        {#if championName !== 'UnknownChamp'}
          <div class="bg-gray-800 rounded-lg p-4 flex flex-col items-center border-2 border-transparent hover:border-sky-600 transition-colors duration-200">
            <img 
              src={`https://ddragon.leagueoflegends.com/cdn/${latestDDragonVersion}/img/champion/${championName}.png`}
              alt={championName}
              class="h-16 w-16 rounded-full mb-2"
              on:error={(e) => handleImageError(e, championPlaceholder)}
            />
            <p class="font-bold text-sm truncate w-full text-center">{championName}</p>
            <div class="mt-2 flex items-center">
              <div class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                {mastery.championLevel}
              </div>
              <p class="ml-2 text-sm">{Math.floor(mastery.championPoints / 1000)}K points</p>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-1.5 mt-2">
              <div 
                class="bg-blue-500 h-1.5 rounded-full" 
                style="width: {Math.min(100, (mastery.championPointsSinceLastLevel / (mastery.championPointsSinceLastLevel + mastery.championPointsUntilNextLevel || 1)) * 100)}%">
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {:else}
    <p class="text-gray-400">No champion mastery data found or champion data could not be loaded.</p>
  {/if}
</div> 