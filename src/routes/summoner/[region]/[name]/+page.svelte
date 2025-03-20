<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Footer from '$lib/components/Footer.svelte';
  
  let loading = true;
  let error = '';
  let playerData: any = null;
  let analysis = '';
  
  onMount(async () => {
    try {
      const { region, name } = $page.params;
      const response = await fetch(`/summoner/${region}/${name}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch summoner data: ${response.status}`);
      }
      
      const data = await response.json();
      playerData = data;
      analysis = data.analysis;
      loading = false;
    } catch (err) {
      console.error('Error:', err);
      error = 'Failed to load summoner profile. Please try again.';
      loading = false;
    }
  });
  function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.onerror = null;
    target.src = '/champion-placeholder.png';
  }
</script>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
  <div class="container mx-auto p-4 flex-grow">
    {#if loading}
      <div class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p class="mt-4 text-xl">Loading summoner profile...</p>
        </div>
      </div>
    {:else if error}
      <div class="text-center py-16">
        <h2 class="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p class="text-lg text-gray-300">{error}</p>
        <a href="/" class="inline-block mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition duration-300">
          Back to Home
        </a>
      </div>
    {:else if playerData}
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <a href="/" class="text-green-500 hover:text-green-400 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div class="flex-shrink-0">
              <div class="rounded-full overflow-hidden border-4 border-green-500 h-32 w-32">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${playerData.summoner.profileIconId}.png`} 
                  alt="Profile Icon" 
                  class="h-full w-full object-cover"
                />
              </div>
            </div>
            
            <div class="flex-grow text-center md:text-left">
              <h1 class="text-3xl font-bold mb-2">{playerData.summoner.name}</h1>
              <p class="text-xl text-gray-300 mb-4">Level {playerData.summoner.summonerLevel}</p>
              
              {#if playerData.leagueEntries && playerData.leagueEntries.length > 0}
                <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                  {#each playerData.leagueEntries as entry}
                    <div class="bg-gray-700 rounded-lg p-3 flex flex-col items-center">
                      <p class="text-sm text-gray-400">{entry.queueType.replace('_', ' ')}</p>
                      <p class="font-bold text-lg">{entry.tier} {entry.rank}</p>
                      <p class="text-sm">{entry.leaguePoints} LP</p>
                      <p class="text-xs text-gray-400">{entry.wins}W {entry.losses}L</p>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="text-gray-400">No ranked data available</p>
              {/if}
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 class="text-2xl font-bold mb-4 text-green-500">Analysis</h2>
          <div class="prose prose-lg prose-invert max-w-none">
            {@html analysis}
          </div>
        </div>
        
        {#if playerData.championMastery && playerData.championMastery.length > 0}
        <div class="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 class="text-2xl font-bold mb-4 text-green-500">Top Champions</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            {#each playerData.championMastery as mastery, i}
              <div class="flex flex-col items-center">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${mastery.championId}.png`} 
                  alt="Champion" 
                  class="h-16 w-16 rounded-full mb-2"
                  on:error={handleImageError}
                />
                <p class="font-bold text-sm truncate w-full text-center">Champion {mastery.championId}</p>
                <p class="text-xs text-gray-400">Mastery {mastery.championLevel}</p>
                <p class="text-xs text-gray-400">{Math.floor(mastery.championPoints / 1000)}K points</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
        
        
        {#if playerData.matches && playerData.matches.length > 0}
          <div class="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 text-green-500">Recent Matches</h2>
            <div class="space-y-4">
              {#each playerData.matches as match}
                {@const participant = match.info.participants.find((p: { summonerName: string }) => p.summonerName === playerData.summoner.name)}
                {#if participant}
                  <div class="bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div class="flex-shrink-0 flex flex-col items-center">
                      <div class={`rounded-full h-16 w-16 flex items-center justify-center ${participant.win ? 'bg-green-900' : 'bg-red-900'}`}>
                        <img 
                          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${participant.championName}.png`} 
                          alt={participant.championName}
                          class="h-14 w-14 rounded-full"
                          on:error={handleImageError}
                        />
                      </div>
                      <p class="text-sm mt-1">{participant.championName}</p>
                    </div>
                    
                    <div class="flex-grow">
                      <div class="flex justify-between items-center">
                        <span class={`font-bold ${participant.win ? 'text-green-500' : 'text-red-500'}`}>
                          {participant.win ? 'Victory' : 'Defeat'}
                        </span>
                        <span class="text-sm text-gray-400">{Math.floor(match.info.gameDuration / 60)} minutes</span>
                      </div>
                      
                      <div class="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                        <p class="text-lg font-bold">{participant.kills} / {participant.deaths} / {participant.assists}</p>
                        <p class="text-sm text-gray-400">
                          KDA: {((participant.kills + participant.assists) / Math.max(1, participant.deaths)).toFixed(2)}
                        </p>
                        <p class="text-sm text-gray-400">
                          CS: {participant.totalMinionsKilled} ({(participant.totalMinionsKilled / (match.info.gameDuration / 60)).toFixed(1)}/min)
                        </p>
                      </div>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <Footer />
</div>