<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  
  let summonerName = '';
  let region = 'na1';
  let loading = false;
  let error = '';
  
  const regions = [
    { value: 'na1', label: 'North America' },
    { value: 'euw1', label: 'Europe West' },
    { value: 'eun1', label: 'Europe Nordic & East' },
    { value: 'kr', label: 'Korea' },
    { value: 'br1', label: 'Brazil' },
    { value: 'jp1', label: 'Japan' },
    { value: 'la1', label: 'Latin America North' },
    { value: 'la2', label: 'Latin America South' },
    { value: 'oc1', label: 'Oceania' },
    { value: 'tr1', label: 'Turkey' },
    { value: 'ru', label: 'Russia' }
  ];
  
  async function handleSubmit() {
    if (!summonerName.trim()) {
      error = 'Please enter a summoner name';
      return;
    }
    
    error = '';
    loading = true;
    
    try {
      // Format the summoner name for the URL
      const formattedName = encodeURIComponent(summonerName.trim());
      goto(`/summoner/${region}/${formattedName}`);
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
        placeholder="Summoner Name#TAG"
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