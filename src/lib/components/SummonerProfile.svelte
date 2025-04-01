<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import Markdown from 'svelte-exmarkdown';
  
  interface Summoner {
    name: string;
    summonerLevel: number;
    profileIconId: number;
    puuid: string;
    gameName?: string;
    tagLine?: string;
  }
  
  interface LeagueEntry {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }
  
  interface Participant {
    puuid: string;
    championName: string;
    win: boolean;
    kills: number;
    deaths: number;
    assists: number;
    totalMinionsKilled: number;
    visionScore: number;
    role: string;
    lane: string;
    totalDamageDealtToChampions: number;
    totalDamageTaken: number;
  }
  
  interface MatchInfo {
    participants: Participant[];
    gameMode: string;
    gameDuration: number;
    gameCreation: number;
  }
  
  interface Match {
    info: MatchInfo;
  }
  
  interface ChampionMastery {
    championId: number;
    championLevel: number;
    championPoints: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
  }
  
  export let summoner: Summoner;
  export let leagueEntries: LeagueEntry[];
  export let matches: Match[];
  export let championMastery: ChampionMastery[];
  export let analysis: string;
  export let latestDDragonVersion: string;
  export let championIdMap: Record<string, string>;
  
  let activeTab = 'overview';
  let placeholderIcon = '/placeholder-icon.png';
  let championPlaceholder = '/champion-placeholder.png';
  
  function getQueueTypeDisplay(queueType: string): string {
    switch(queueType) {
      case 'RANKED_SOLO_5x5':
        return 'Ranked Solo/Duo';
      case 'RANKED_FLEX_SR':
        return 'Ranked Flex';
      case 'RANKED_TFT':
        return 'Ranked TFT';
      default:
        return queueType.replace(/_/g, ' ');
    }
  }
  
  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  function getKDA(kills: number, deaths: number, assists: number): string {
    return ((kills + assists) / Math.max(1, deaths)).toFixed(2);
  }
  
  function handleImageError(event: Event, fallbackSrc: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackSrc;
  }
  
  function getChampionNameById(id: number): string {
    return championIdMap[id.toString()] || 'UnknownChamp';
  }
</script>

<div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
  <!-- Profile Header -->
  <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
    <div class="flex flex-col md:flex-row items-center gap-6">
      <div class="flex-shrink-0">
        <div class="rounded-full h-24 w-24 overflow-hidden border-4 border-green-500">
          <img 
            src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${summoner.profileIconId}.png`}
            alt="Summoner Icon"
            on:error={(e) => handleImageError(e, placeholderIcon)}
            class="h-full w-full object-cover"
          />
        </div>
      </div>
      
      <div class="flex-grow text-center md:text-left">
        <!-- Display Riot ID -->
        {#if summoner.gameName && summoner.tagLine}
          <h1 class="text-3xl font-bold text-white">{summoner.gameName}<span class="text-gray-400">#{summoner.tagLine}</span></h1>
        {:else} <!-- Fallback if gameName/tagLine aren't available for some reason -->
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
                  ({Math.round((entry.wins / (entry.wins + entry.losses)) * 100)}%)
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
  
  <!-- Tab Navigation -->
  <div class="bg-gray-900 px-4 flex overflow-x-auto">
    <button 
      class="hover:cursor-pointer py-4 px-4 font-medium whitespace-nowrap border-b-2 {activeTab === 'overview' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-gray-200'}"
      on:click={() => activeTab = 'overview'}
    >
      Overview
    </button>
    <button 
      class="hover:cursor-pointer py-4 px-4 font-medium whitespace-nowrap border-b-2 {activeTab === 'matches' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-gray-200'}"
      on:click={() => activeTab = 'matches'}
    >
      Recent Matches
    </button>
    <button 
      class="hover:cursor-pointer py-4 px-4 font-medium whitespace-nowrap border-b-2 {activeTab === 'champions' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-gray-200'}"
      on:click={() => activeTab = 'champions'}
    >
      Champions
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="p-6">
    {#if activeTab === 'overview'}
      <div transition:fly={{ y: 10, duration: 200 }}>
        <h2 class="text-2xl font-bold mb-4 text-green-500">Player Analysis</h2>
        <div class="prose prose-lg prose-invert max-w-none">
          <Markdown md={analysis} />
        </div>
      </div>
    {:else if activeTab === 'matches'}
      <div transition:fly={{ y: 10, duration: 200 }}>
        <h2 class="text-2xl font-bold mb-4 text-green-500">Recent Matches</h2>
        
        {#if matches.length > 0}
          <div class="space-y-4">
            {#each matches as match}
              {@const participant = match.info.participants.find((p: Participant) => p.puuid === summoner.puuid)}
              {#if participant}
                <div class="bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row gap-4">
                  <!-- Champion Icon -->
                  <div class="flex-shrink-0 flex flex-col items-center">
                    <div class={`rounded-full h-16 w-16 flex items-center justify-center ${participant.win ? 'bg-green-900/40' : 'bg-red-900/40'}`}>
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${participant.championName}.png`}
                        alt={participant.championName}
                        class="h-14 w-14 rounded-full"
                        on:error={(e) => handleImageError(e, championPlaceholder)}
                      />
                    </div>
                    <p class="text-sm mt-1 text-center truncate w-20">{participant.championName}</p>
                  </div>
                  
                  <!-- Match Details -->
                  <div class="flex-grow">
                    <div class="flex justify-between mb-2">
                      <span class={`font-bold ${participant.win ? 'text-green-500' : 'text-red-500'}`}>
                        {participant.win ? 'Victory' : 'Defeat'}
                      </span>
                      <div class="text-sm text-gray-400">
                        <span>{match.info.gameMode}</span>
                        <span class="mx-2">•</span>
                        <span>{Math.floor(match.info.gameDuration / 60)}m {match.info.gameDuration % 60}s</span>
                        <span class="mx-2">•</span>
                        <span>{formatDate(match.info.gameCreation)}</span>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p class="text-lg font-bold">{participant.kills} / {participant.deaths} / {participant.assists}</p>
                        <p class="text-sm text-gray-400">
                          KDA: {getKDA(participant.kills, participant.deaths, participant.assists)}
                        </p>
                      </div>
                      
                      <div>
                        <p class="font-bold">CS: {participant.totalMinionsKilled}</p>
                        <p class="text-sm text-gray-400">
                          {(participant.totalMinionsKilled / (match.info.gameDuration / 60)).toFixed(1)} / min
                        </p>
                      </div>
                      
                      <div>
                        <p class="font-bold">{participant.visionScore} Vision</p>
                        <p class="text-sm text-gray-400">
                          {participant.role}/{participant.lane}
                        </p>
                      </div>
                      
                      <div>
                        <p class="font-bold">{Math.round(participant.totalDamageDealtToChampions / 1000)}k Damage</p>
                        <p class="text-sm text-gray-400">
                          {Math.round(participant.totalDamageTaken / 1000)}k Taken
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        {:else}
          <p class="text-gray-400">No recent matches found</p>
        {/if}
      </div>
    {:else if activeTab === 'champions'}
      <div transition:fly={{ y: 10, duration: 200 }}>
        <h2 class="text-2xl font-bold mb-4 text-green-500">Champion Mastery</h2>
        
        {#if championMastery && championMastery.length > 0 && championIdMap && Object.keys(championIdMap).length > 0}
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            {#each championMastery as mastery}
              {@const championName = getChampionNameById(mastery.championId)}
              {#if championName !== 'UnknownChamp'}
                <div class="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
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
                      style="width: {Math.min(100, (mastery.championPointsSinceLastLevel / (mastery.championPointsSinceLastLevel + mastery.championPointsUntilNextLevel)) * 100)}%">
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
    {/if}
  </div>
</div>

<style>
	:global(p) {
		margin-bottom: 1em;
		line-height: 1.6;
	}

	:global(strong) {
		color: rgb(71, 160, 255);
	}
</style>