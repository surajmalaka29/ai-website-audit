AI Prompt Logs & Reasoning Traces
This document outlines the prompt engineering strategy used for the Website Audit Tool, demonstrating how the LLM is grounded in factual metrics.

1. System Prompt
The system prompt establishes the AI's persona as an expert auditor and sets strict operational constraints to ensure data-driven outputs.

Prompt:

"You are an expert Website Auditor for EIGHT25MEDIA. You analyze web pages and provide insights based STRICTLY on the provided factual metrics. You must output a valid JSON object."

2. User Prompt Construction
The user prompt is dynamically constructed by injecting stringified JSON data extracted from the target URL via the scraping layer.

Template:

"Here is the scraped data from the URL: [Target URL]
Metrics: [JSON_Stringified_Metrics]

Generate a structured analysis. Ensure your output matches exactly this JSON format:
{
"insights": [
{ "category": "SEO Strategy", "text": "specific insight" },
{ "category": "User Experience", "text": "specific insight" },
{ "category": "Messaging", "text": "specific insight" }
],
"recommendations": [
{ "title": "Recommendation 1", "impact": "High/Medium/Low", "description": "actionable advice" }
]
}

Provide 3-5 prioritized recommendations. Tie reasoning clearly to the extracted metrics. Do not use generic advice."

3. Structured Inputs Sent to Model
The model receives the following structured data object (example based on a real trace):

{
  "title": "BCI Campus | Welcome",
  "description": "Leading higher education institute in Sri Lanka",
  "headings": { "h1": 1, "h2": 12, "h3": 8 },
  "wordCount": 1250,
  "images": { "total": 24, "missingAltPercentage": 15 },
  "links": { "internal": 45, "external": 10 },
  "ctaCount": 5
}

4. Raw Model Output (Example)
Below is a raw response trace from Gemini 1.5 Flash before being rendered by the frontend:

{
  "insights": [
    {
      "category": "SEO Strategy",
      "text": "The page structure is sound with a single H1, but 15% of images lack alt text, hindering accessibility and image SEO[cite: 22, 28]."
    },
    {
      "category": "User Experience",
      "text": "With only 5 CTAs across 1,250 words, the conversion path may be under-optimized relative to content depth[cite: 20, 32]."
    }
  ],
  "recommendations": [
    {
      "title": "Optimize Image Accessibility",
      "impact": "High Impact",
      "description": "Add descriptive alt text to the 4 images currently missing tags to improve search visibility[cite: 41]."
    },
    {
      "title": "Increase CTA Density",
      "impact": "Medium Impact",
      "description": "Strategically place 2-3 additional CTAs in high-engagement sections to improve the conversion rate[cite: 30]."
    }
  ]
}