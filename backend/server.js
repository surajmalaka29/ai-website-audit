require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/audit', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // 1. SCRAPING SECTION (Extract data)
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const $ = cheerio.load(html);

    // Remove unnecessary elements (scripts, styles)
    $('script, style, noscript, iframe').remove();

    // Meta Data [cite: 23]
    const title = $('title').text().trim() || 'No Title';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'No Description';

    // Headings [cite: 19]
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;

    // Word Count [cite: 18]
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').filter(word => word.length > 0).length;

    // Images & Alt Text [cite: 21, 22]
    const totalImages = $('img').length;
    const missingAlt = $('img:not([alt]), img[alt=""], img[alt=" "]').length;
    const missingAltPercentage = totalImages > 0 ? Math.round((missingAlt / totalImages) * 100) : 0;

    // Links (Internal vs External) [cite: 20]
    let internalLinks = 0;
    let externalLinks = 0;
    try {
      const baseUrl = new URL(url).origin;
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
        
        if (href.startsWith('/') || href.startsWith(baseUrl)) {
          internalLinks++;
        } else if (href.startsWith('http')) {
          externalLinks++;
        }
      });
    } catch (e) {
      console.log("Error parsing URL logic");
    }

    // CTAs (Buttons and prominent links) [cite: 20]
    const ctaCount = $('button, input[type="submit"], a.btn, a[class*="btn-"], a[class*="button"]').length;

    const metrics = {
      title,
      description,
      headings: { h1: h1Count, h2: h2Count, h3: h3Count },
      wordCount,
      images: { total: totalImages, missingAltPercentage },
      links: { internal: internalLinks, external: externalLinks },
      ctaCount
    };

    // 2. AI ANALYSIS SECTION (Generate Insights using Gemini AI)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } // Enforce JSON format [cite: 59]
    });

    const systemPrompt = `You are an expert Website Auditor for EIGHT25MEDIA[cite: 9]. You analyze web pages and provide insights based STRICTLY on the provided factual metrics[cite: 34]. You must output a valid JSON object.`;
    
    const userPrompt = `
      Here is the scraped data from the URL: ${url}
      Metrics: ${JSON.stringify(metrics)}
      
      Generate a structured analysis[cite: 26]. Ensure your output matches exactly this JSON format:
      {
        "insights": [
          { "category": "SEO Strategy", "text": "specific insight about SEO based on the metrics" },
          { "category": "User Experience", "text": "insight about UX concerns" },
          { "category": "Messaging", "text": "insight about clarity" }
        ],
        "recommendations": [
          { "title": "Recommendation 1", "impact": "High Impact", "description": "concise, actionable advice [cite: 41]" },
          { "title": "Recommendation 2", "impact": "Medium Impact", "description": "concise, actionable advice" },
          { "title": "Recommendation 3", "impact": "Low Impact", "description": "concise, actionable advice" }
        ]
      }
      
      Provide 3-5 prioritized recommendations[cite: 39]. Tie reasoning clearly to the extracted metrics[cite: 40]. Do not use generic advice[cite: 35].
    `;

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const aiResponseText = result.response.text();
    const aiData = JSON.parse(aiResponseText);

    // 3. Send (Send Combined Data to Frontend)
    res.json({ metrics, ai: aiData });

  } catch (error) {
    console.error('Scraping or AI Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze website. Please check the URL and try again.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});