<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  
  let gameName = '';
  let tagLine = '';
  let region = 'Southeast Asia';
  let loading = false;
  let error = '';
  
  const regions = [
    // Americas
    { label: 'North America', value: 'North America', platform: 'na1', regional: 'americas' },
    { label: 'Brazil', value: 'Brazil', platform: 'br1', regional: 'americas' },
    { label: 'LAN', value: 'LAN', platform: 'la1', regional: 'americas' },
    { label: 'LAS', value: 'LAS', platform: 'la2', regional: 'americas' },
    { label: 'Oceania', value: 'Oceania', platform: 'oc1', regional: 'americas' },

    // Europe
    { label: 'Europe West', value: 'Europe West', platform: 'euw1', regional: 'europe' },
    { label: 'Europe Nordic & East', value: 'Europe Nordic & East', platform: 'eun1', regional: 'europe' },
    { label: 'Russia', value: 'Russia', platform: 'ru', regional: 'europe' },
    { label: 'Türkiye', value: 'Türkiye', platform: 'tr1', regional: 'europe' },

    // Asia
    { label: 'Korea', value: 'Korea', platform: 'kr', regional: 'asia' },
    { label: 'Japan', value: 'Japan', platform: 'jp1', regional: 'asia' },

    // SEA
    { label: 'Southeast Asia', value: 'Southeast Asia', platform: 'sg2', regional: 'sea' },
    { label: 'Taiwan', value: 'Taiwan', platform: 'tw2', regional: 'sea' },
    { label: 'Vietnam', value: 'Vietnam', platform: 'vn2', regional: 'sea' },
    { label: 'Philippines', value: 'Philippines', platform: 'ph2', regional: 'sea' },
    { label: 'Thailand', value: 'Thailand', platform: 'th2', regional: 'sea' }
  ];
  
  async function handleSubmit() {
    if (!gameName.trim()) {
      error = 'Please enter a Game Name';
      return;
    }
    
    if (!tagLine.trim()) {
      error = 'Please enter a Tagline';
      return;
    }
    
    error = '';
    loading = true;
    
    try {
      // Find the selected region's platform ID for the URL
      const selectedRegion = regions.find(r => r.value === region);
      
      if (!selectedRegion) {
        console.error(`Region "${region}" not found in regions list`);
        error = 'Invalid region selected. Please try again.';
        loading = false; // Reset loading on error
        return;
      }
      
      const platformId = selectedRegion.platform;
      console.log(`Selected region: ${selectedRegion.label}, platformId: ${platformId}, regional: ${selectedRegion.regional}`);
      
      // Pass gameName and tagLine separately in the URL
      // Use await here if you want the loading state to persist until navigation completes,
      // though typically goto starts the navigation and the component unmounts.
      await goto(`/summoner/${platformId}/${encodeURIComponent(gameName.trim())}/${encodeURIComponent(tagLine.trim())}`);
      
      // Loading might not need to be explicitly set to false if navigation succeeds,
      // as the component will likely unmount. But setting it in finally is safer.
      
    } catch (err) {
      console.error('Error during navigation setup:', err); // Changed error logging context
      error = 'An error occurred while trying to navigate. Please try again.';
      loading = false; // Ensure loading is reset on navigation error
    } 
    // Removed finally block as loading=false is handled in error case, 
    // and not strictly needed on successful navigation due to component unmount.
    // If the component *doesn't* unmount (e.g., shallow routing if that applies),
    // you might need loading = false after await goto(...).
  }
</script>

<div class="w-full max-w-md mx-auto mt-8 p-6 md:bg-gray-900 rounded-lg shadow-lg">
  {#if !loading}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="riotId" class="block text-lg font-medium text-gray-300 mb-2">Enter Riot ID</label>
        <div class="flex items-center shadow-sm">
          <input
            type="text"
            id="gameName"
            bind:value={gameName}
            placeholder="Game Name"
            required
            class="flex-grow px-4 py-3 rounded-l-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:relative focus:z-10 placeholder-gray-400"
          />
          <div class="flex items-center justify-center px-3 py-3 bg-gray-800 text-gray-400 font-semibold border-t border-b border-gray-600">
            #
          </div>
          <input
            type="text"
            id="tagLine"
            bind:value={tagLine}
            placeholder="TAG"
            required
            class="w-24 px-4 py-3 rounded-r-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:relative focus:z-10 placeholder-gray-400"
          />
        </div>
      </div>
      
      <div>
        <label for="region" class="block text-lg font-medium text-gray-300 mb-2">Select Region</label>
        <div class="relative">
          <select
            id="region"
            bind:value={region}
            class="w-full pl-4 pr-10 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm appearance-none"
          >
            {#each regions as regionOpt (regionOpt.value)}
              <option value={regionOpt.value}>{regionOpt.label}</option>
            {/each}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        class="hover:cursor-pointer w-full py-3 px-4 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 shadow-lg hover:ring-2 hover:ring-sky-500 hover:ring-opacity-60 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-sky-600 disabled:ring-transparent"
        disabled={!gameName.trim() || !tagLine.trim()}
      >
        Analyze
      </button>
      
      {#if error}
        <div class="text-red-400 text-center pt-2" transition:fade={{ duration: 300 }}>
          {error}
        </div>
      {/if}
    </form>
  {:else}
    <!-- Loading State -->
    <div class="flex flex-col items-center justify-center h-64"> 
      <svg class="animate-spin h-10 w-10 text-sky-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-xl font-medium text-gray-300">Analyzing...</p>
      <p class="text-gray-400 mt-1">Summoners are being summoned.</p>
    </div>
  {/if}
</div>