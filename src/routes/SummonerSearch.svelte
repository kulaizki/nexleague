<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  
  let summonerName = '';
  let region = 'North America'; // Default to a user-friendly name
  let loading = false;
  let error = '';
  
  const regions = [
    { label: 'North America', value: 'North America', platform: 'na1', regional: 'americas' },
    { label: 'Europe West', value: 'Europe West', platform: 'euw1', regional: 'europe' },
    { label: 'Europe Nordic & East', value: 'Europe Nordic & East', platform: 'eun1', regional: 'europe' },
    { label: 'Oceania', value: 'Oceania', platform: 'oc1', regional: 'sea' },
    { label: 'Korea', value: 'Korea', platform: 'kr', regional: 'asia' },
    { label: 'Japan', value: 'Japan', platform: 'jp1', regional: 'asia' },
    { label: 'Brazil', value: 'Brazil', platform: 'br1', regional: 'americas' },
    { label: 'LAS', value: 'LAS', platform: 'la2', regional: 'americas' },
    { label: 'LAN', value: 'LAN', platform: 'la1', regional: 'americas' },
    { label: 'Russia', value: 'Russia', platform: 'ru', regional: 'europe' },
    { label: 'Türkiye', value: 'Türkiye', platform: 'tr1', regional: 'europe' },
    { label: 'Southeast Asia', value: 'Southeast Asia', platform: 'sg2', regional: 'sea' }, 
    { label: 'Taiwan', value: 'Taiwan', platform: 'tw2', regional: 'sea' },
    { label: 'Vietnam', value: 'Vietnam', platform: 'vn2', regional: 'sea' }
  ];
  
  async function handleSubmit() {
    if (!summonerName.trim()) {
      error = 'Please enter a Riot ID';
      return;
    }
    
    error = '';
    loading = true;
    
    try {
      const formattedName = encodeURIComponent(summonerName.trim());
      // Find the selected region's platform ID for the URL
      const selectedRegion = regions.find(r => r.value === region);
      const platformId = selectedRegion?.platform || 'na1'; // Fallback to na1 if not found
      goto(`/summoner/${platformId}/${formattedName}`);
    } catch (err) {
      console.error('Error:', err);
      error = 'An error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full max-w-md mx-auto mt-8">
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div class="flex flex-col">
      <label for="summonerName" class="text-lg font-medium text-gray-200 mb-2">Enter Riot ID</label>
      <input
        type="text"
        id="summonerName"
        bind:value={summonerName}
        placeholder="SummonerName#TAG"
        class="px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
    
    <div class="flex flex-col">
      <label for="region" class="text-lg font-medium text-gray-200 mb-2">Select Region</label>
      <select
        id="region"
        bind:value={region}
        class="px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {#each regions as region}
          <option value={region.value}>{region.label}</option>
        {/each}
      </select>
    </div>
    
    <button
      type="submit"
      class="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {#if loading}
        <span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing...
        </span>
      {:else}
        Analyze My Gameplay
      {/if}
    </button>
    
    {#if error}
      <div class="text-red-500 text-center" transition:fade>
        {error}
      </div>
    {/if}
  </form>
</div>