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
    class="py-4 md:py-2 bg-gray-900 border-t border-gray-600 text-white"
    transition:slideUp|local
  >
    <div class="gap-4 max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
      <p class="text-sm md:my-3 order-2 md:order-1">
        &copy; {new Date().getFullYear()} 
        <a
          href="https://github.com/kulaizki"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-sky-500 hover:underline hover:text-sky-300 transition ease-in-out duration-200"
        >
          kulaizki
        </a>. All rights reserved.
      </p>
      <div class="flex space-x-4 order-1 md:order-2">
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
      </div>
    </div>
  </footer>
{/if}
