AI-Powered Website Audit Tool (EIGHT25MEDIA Assignment)
This is a lightweight, AI-native web application that extracts factual metrics from a given URL and uses the Gemini 1.5 Flash (Google AI) model to generate structured, data-grounded insights and prioritized recommendations. 

Setup & Installation Instructions 

1. Backend Setup

Navigate to the backend directory: cd backend

Install dependencies: npm install

Create a .env file and add your Google AI (Gemini) API key: 
GEMINI_API_KEY=your_google_ai_key_here

Start the server: node server.js (The server runs on port 3001).

2. Frontend Setup

Navigate to the frontend directory: cd frontend

Install dependencies: npm install

Start the Vite development server: npm run dev

Open your browser and navigate to http://localhost:5173.

* Architecture Overview 

The application uses a decoupled Client-Server architecture to ensure a clean separation between data extraction and AI analysis: 

Frontend (React + Tailwind + Vite): Handles the user interface and state management, clearly separating factual data from AI-generated insights. 

Backend (Node.js + Express): Acts as a proxy to bypass CORS and orchestrates the scraping and AI workflows. 

Data Extraction (Cheerio): Scrapes the target URL's HTML to extract metrics such as word counts, headings, and link types. 

* AI Design Decisions 

Model Selection: Powered by Gemini 1.5 Flash, chosen for its high speed and efficient processing of structured data. 

JSON Mode Enforcement: The system forces the model to output a strict JSON schema.  This ensures the frontend can reliably map recommendations to UI components without manual string parsing.

Context Grounding: Factual metrics extracted via Cheerio (like image alt-text percentages and CTA counts) are injected directly into the prompt. This prevents hallucinations and ensures the AI provides specific, non-generic advice. 

* Trade-offs 

Cheerio vs. Puppeteer: Cheerio was selected for its extreme performance. While it cannot execute JavaScript for Single Page Apps (SPAs), it is highly effective for the initial DOM analysis of most marketing sites. 

Synchronous Auditing: To keep the implementation simple and focused for this 24-hour scope, the audit is processed in a single request-response cycle. 

* Future Improvements 

Headless Browsing: Integrating Puppeteer to handle JavaScript-heavy sites and capture visual screenshots.

Performance Auditing: Connecting to the Google Lighthouse API to provide technical Core Web Vitals (LCP, CLS).

Multi-Page Depth: Expanding the tool to crawl a root domain and identify sitewide SEO issues. 

* Deliverables 


GitHub Repository: https://github.com/surajmalaka29/ai-website-audit. 

Live Deployment: https://ai-website-audit-ten.vercel.app/. 

Prompt Logs: Detailed traces of system and user prompts in PROMPTS.md.