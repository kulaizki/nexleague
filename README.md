# NexLeague

A SvelteKit web app that uses the Riot Games API to search and display League of Legends summoner profiles by Riot ID and region, with Google Gemini API integration for analysis.

## 🔥 Features

*   **Dynamic Summoner Search:** Instantly search for any League of Legends player using their Riot ID (Game Name + Tagline).
*   **Global Region Support:** Select from a comprehensive list of official Riot Games regions (NA, EUW, KR, SEA, etc.) to ensure accurate profile retrieval.
*   **Detailed Profile Pages:** Navigate to dedicated pages for each summoner to view their specific stats and information (powered by the Riot API).
*   **Responsive UI:** Enjoy a clean and interactive interface built with Tailwind CSS, featuring loading indicators and clear error messages.
*   **SvelteKit Powered:** Leverages the speed and features of SvelteKit for a modern, performant web experience.
*   **Gemini API Integration:** Incorporates the Google Gemini API, opening possibilities for AI-driven insights and analysis in the future.

## 🚀 Technologies Used

*   [SvelteKit](https://kit.svelte.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   Riot Games API
*   Google Gemini API

## Getting Started

### Prerequisites

*   Node.js (version specified in `.nvmrc` if available, otherwise latest LTS recommended)
*   npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd nexleague 
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

```bash
npm run dev
```

This will start the development server, typically on `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

This command builds the application for production. You can preview the production build locally using:

```bash
npm run preview
```

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
