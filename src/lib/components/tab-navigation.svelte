<script lang="ts">
  export let activeTab: string;
  export let onTabChange: (tab: string) => void;
</script>

<div class="border-t-2 border-gray-800 bg-gray-900 px-4 flex overflow-x-auto">
  <button 
    class="hover:cursor-pointer py-4 px-4 font-medium whitespace-nowrap md:border-b-2 {activeTab === 'overview' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-gray-200'}"
    on:click={() => onTabChange('overview')}
  >
    Overview
  </button>
  <button 
    class="hover:cursor-pointer py-4 px-4 font-medium whitespace-nowrap md:border-b-2 {activeTab === 'matches' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-gray-200'}"
    on:click={() => onTabChange('matches')}
  >
    Recent Matches
  </button>
  <button 
    class="hover:cursor-pointer py-4 px-4 font-medium whitespace-nowrap md:border-b-2 {activeTab === 'champions' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-gray-200'}"
    on:click={() => onTabChange('champions')}
  >
    Champions
  </button>
</div> 