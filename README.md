# AI-Powered Website Audit Tool

A lightweight, AI-native web application built for EIGHT25MEDIA that extracts factual metrics from a given URL and uses an LLM (OpenAI) to generate structured, data-grounded insights and prioritized recommendations.

## Setup & Installation instructions

### Prerequisites
- Node.js installed
- OpenAI API Key

### 1. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your API key:
   `OPENAI_API_KEY=your_api_key_here`
4. Start the server: `node server.js` (Runs on port 3001)

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`).

---

## Architecture Overview
To ensure a clean separation between data extraction and AI analysis, the application uses a decoupled Client-Server architecture:
- **Frontend (React + Tailwind + Vite):** Handles the user interface, state management, and presents the separated factual data vs. AI insights cleanly.
- **Backend (Node.js + Express):** Acts as a proxy to bypass CORS, uses `Cheerio` to extract the DOM metrics directly from the HTML payload, and orchestrates the call to the OpenAI API.

## AI Design Decisions
- **JSON Mode:** Forced the LLM (`gpt-4o-mini`) to output strict JSON matching a pre-defined schema. This ensures the frontend can reliably map the AI's response to React components without manual string parsing.
- **Prompt Injection:** The factual metrics extracted by Cheerio are stringified and injected directly into the user prompt. This grounds the AI, preventing hallucinations and ensuring recommendations are specific to the actual webpage data.

## Trade-offs
- **Real-time Scraping vs. Queues:** The app scrapes the target URL synchronously while the user waits. While simple and fast for single pages, a production app would benefit from a queue system (like BullMQ) and webhooks to handle large, slow-loading pages without timing out.
- **Cheerio vs. Puppeteer:** Used Cheerio for speed and simplicity. The trade-off is that it only parses the initial HTML payload and cannot execute JavaScript, meaning it might miss client-side rendered content (like SPAs).

## What I Would Improve With More Time
1. **Headless Browser Integration:** Implement Puppeteer or Playwright to render JavaScript and capture dynamic content, as well as take an actual screenshot of the target URL to display in the UI.
2. **Multi-Page Crawling:** Expand the tool to accept a root domain and crawl linked pages up to a certain depth.
3. **Advanced Metrics:** Integrate Lighthouse API for real performance metrics (LCP, CLS) instead of just DOM counting.