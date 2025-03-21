<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Footer from '$lib/components/Footer.svelte';
  import SummonerProfile from '$lib/components/SummonerProfile.svelte'; 
  
  let loading = true;
  let error = '';
  let playerData: any = null;
  
  onMount(async () => {
    try {
      const { region, name } = $page.params;
      // Use the API endpoint to get data
      const response = await fetch(`/api/summoner/${region}/${name}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch summoner data: ${response.status}`);
      }
      
      playerData = await response.json();
      loading = false;
    } catch (err: any) {
      console.error('Error:', err);
      error = err.message || 'Failed to load summoner profile. Please try again.';
      loading = false;
    }
  });
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
        <SummonerProfile
          summoner={playerData.summoner}
          leagueEntries={playerData.leagueEntries}
          matches={playerData.matches}
          championMastery={playerData.championMastery}
          analysis={playerData.analysis}
        />
      </div>
    {/if}
  </div>
  <Footer />
</div>