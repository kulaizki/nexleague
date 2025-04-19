<script lang="ts">
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  
  let show: boolean = false;
  
  function slideUp(
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
    return {
      delay: params.delay || 0,
      duration: params.duration || 300,
      easing: params.easing || cubicOut,
      css: (t: number) => `
        transform: translateY(${(1 - t) * 20}px);
        opacity: ${t};
      `
    };
  }
  
  onMount(() => {
    show = true;
  });
</script>

{#if show}
  <footer 
    class="py-2 bg-gray-950 border-t border-gray-600 text-white"
    transition:slideUp|local
  >
    <div class="gap-4 max-w-6xl mx-auto px-6 flex flex-row justify-between items-center">
      <p class="text-xs sm:text-sm my-3 text-center md:text-left">
        &copy; {new Date().getFullYear()} 
        <a
          href="https://fitzsixto.com"
          target="_blank"
          rel="noopener noreferrer"
          class="[text-shadow:0_0_8px_rgba(0,255,8,0.6)] bg-gradient-to-r from-emerald-300 to-emerald-600 bg-clip-text text-transparent font-bold transition ease-in-out duration-200"
        >
          Fitzsixto 
        </a>. All rights reserved.
      </p>
      <div class="flex space-x-4">
        <a
          href="https://github.com/kulaizki/nexleague"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="flex items-center space-x-2"
        >
          <img
            src="https://skillicons.dev/icons?i=github"
            alt="GitHub"
            class="w-10 h-10 transition ease-in-out duration-300 hover:scale-110 hover:opacity-75"
          />
        </a>
        <a
          href="https://ko-fi.com/kulaizki"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ko-fi"
          class="flex items-center space-x-2 group"
        >
          <div class="bg-white rounded-md p-1 flex items-center justify-center transition ease-in-out duration-300 group-hover:scale-110 group-hover:opacity-75">
            <img
              src="https://cdn.simpleicons.org/kofi/FF5E5B"
              alt="Ko-fi"
              class="w-8 h-8"
            />
          </div>
        </a>
      </div>
    </div>
  </footer>
{/if}
