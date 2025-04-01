<script lang="ts">
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import SummonerSearch from './summoner-search.svelte';
  
  let show: boolean = false;
  
  function blurFly(
    node: HTMLElement,
    params: {
      delay?: number;
      duration?: number;
      easing?: (t: number) => number;
    } = {}
  ): {
    delay: number;
    duration: number;
    easing: (t: number) => number;
    css: (t: number) => string;
  } {
    const existingTransform = getComputedStyle(node).transform.replace('none', '');
    return {
      delay: params.delay || 0,
      duration: params.duration || 1500,
      easing: params.easing || cubicOut,
      css: (t: number) => `
        transform: ${existingTransform} translateY(${(1 - t) * 100}px);
        opacity: ${t};
        filter: blur(${(1 - t) * 10}px);
      `
    };
  }
  
  onMount(() => {
    show = true;
  });
</script>

<section class="flex-grow flex flex-col items-center justify-center p-8 text-white h-full">
  {#if show}
    <div class="max-w-7xl md:max-w-4xl text-center" transition:blurFly>
      <h1 class="mb-4 text-4xl font-bold tracking-tight md:text-7xl">
        welcome to <span class="text-green-500 [text-shadow:0_0_8px_rgba(0,255,17,.7)]">nexleague</span>
      </h1>
      <p class="mb-6 text-lg text-gray-300 md:text-xl">
        Let's improve in League of Legends.
      </p>
      <SummonerSearch />
    </div>
  {/if}
</section>