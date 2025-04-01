<script lang="ts">
  import { page } from '$app/stores';
  import Footer from '$lib/components/footer.svelte';
  import SummonerProfile from '$lib/components/summoner-profile.svelte';
  
  export let data;
  
  // Extract data passed from the server
  const { 
    summoner,
    leagueEntries,
    matches,
    championMastery,
    analysis,
    latestDDragonVersion, 
    championIdMap 
  } = data;
</script>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
  <div class="container mx-auto p-4 flex-grow">
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
        {summoner}
        {leagueEntries}
        {matches}
        {championMastery}
        {analysis}
        {latestDDragonVersion}
        {championIdMap}
      />
    </div>
  </div>
  <Footer />
</div>