<script lang="ts">
  import { fly } from 'svelte/transition';
  import Markdown from 'svelte-exmarkdown';
  import MatchItem from './match-item.svelte';
  import ProfileHeader from './profile-header.svelte';
  import TabNavigation from './tab-navigation.svelte';
  import ChampionMastery from './champion-mastery.svelte';

  import type { Summoner } from '$types/summoner';
  import type { LeagueEntry } from '$types/leagueEntry';
  import type { Match } from '$types/match';
  import type { ChampionMastery as ChampionMasteryType } from '$types/championMastery';

  export let summoner: Summoner;
  export let leagueEntries: LeagueEntry[];
  export let matches: Match[];
  export let championMastery: ChampionMasteryType[];
  export let analysis: string;
  export let latestDDragonVersion: string;
  export let championIdMap: Record<string, string>;
  
  let activeTab = 'overview';
  let placeholderIcon = '/placeholder-icon.png';
  let championPlaceholder = '/champion-placeholder.png';
  
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
</script>

<div class="border border-gray-800 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
  <ProfileHeader 
    {summoner}
    {leagueEntries}
    {placeholderIcon}
    {latestDDragonVersion}
  />
  
  <TabNavigation 
    {activeTab}
    onTabChange={(tab) => activeTab = tab}
  />
  
  <div class="p-6">
    {#if activeTab === 'overview'}
      <div transition:fly={{ y: 10, duration: 200 }}> 
        <h2 class="text-2xl font-bold mb-4 text-sky-500 [text-shadow:0_0_8px_rgba(0,200,255,0.5)]">Player Analysis</h2>
        <div class="prose prose-lg prose-invert max-w-none">
          <Markdown md={analysis} />
        </div>
      </div>
    {:else if activeTab === 'matches'}
      <div transition:fly={{ y: 10, duration: 200 }}>
        <h2 class="text-2xl font-bold mb-4 text-sky-500 [text-shadow:0_0_8px_rgba(0,200,255,0.5)]">Recent Matches</h2>
        
        {#if matches && matches.length > 0}
          <div class="space-y-4">
            {#each matches as match}
              <MatchItem 
                {match}
                summonerPuuid={summoner.puuid}
                {latestDDragonVersion}
                {championPlaceholder}
                {formatDate}
                {getKDA}
                {handleImageError}
              />
            {/each}
          </div>
        {:else}
          <p class="text-gray-400">No recent matches found</p>
        {/if}
      </div>
    {:else if activeTab === 'champions'}
      <ChampionMastery 
        {championMastery}
        {championIdMap}
        {latestDDragonVersion}
        {championPlaceholder}
      />
    {/if}
  </div>
</div>

<style>
	:global(p) {
		margin-bottom: 1em;
		line-height: 1.6;
	}

	:global(strong) {
		color: rgb(71, 181, 255);
	}
</style>