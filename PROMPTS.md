# AI Prompt Logs & Reasoning Traces

## 1. System Prompt
We defined a strict role and output constraint for the AI to ensure it grounds its insights in the factual metrics provided.

**Prompt:**
> "You are an expert Website Auditor for EIGHT25MEDIA. You analyze web pages and provide insights based STRICTLY on the provided factual metrics. You must output a valid JSON object."

## 2. User Prompt (Dynamic)
The user prompt injects the live JSON data scraped from the requested URL by Cheerio and enforces the structure of the output.

**Prompt Template:**
> "Here is the scraped data from the URL: {url}
> Metrics: {JSON_Stringified_Metrics}
>       
> Generate a structured analysis. Ensure your output matches exactly this JSON format:
> {
>   "insights": [
>     { "category": "SEO Strategy", "text": "specific insight about SEO based on the metrics" },
>     { "category": "User Experience", "text": "insight about UX concerns" },
>     { "category": "Messaging", "text": "insight about clarity" }
>   ],
>   "recommendations": [
>     { "title": "Recommendation 1", "impact": "High Impact", "description": "concise, actionable advice" },
>     { "title": "Recommendation 2", "impact": "Medium Impact", "description": "concise, actionable advice" },
>     { "title": "Recommendation 3", "impact": "Low Impact", "description": "concise, actionable advice" }
>   ]
> }
>       
> Provide 3-5 prioritized recommendations. Tie reasoning clearly to the extracted metrics. Do not use generic advice."

## 3. Raw Model Output Example
Here is a raw response trace from the model (OpenAI - gpt-4o-mini) successfully adhering to the JSON schema based on the injected data:

```json
{
  "insights": [
    {
      "category": "SEO Strategy",
      "text": "The page has a strong foundation with 42 headings providing good structure, but 32% of the 34 images are missing alt text, which is a missed opportunity for image SEO."
    },
    {
      "category": "User Experience",
      "text": "With a high word count of 15,607 words and 31 CTAs, the page is very content-heavy. The high number of CTAs might cause decision fatigue for the user."
    }
  ],
  "recommendations": [
    {
      "title": "Add Missing Image Alt Text",
      "impact": "High Impact",
      "description": "Add descriptive alt text to the 11 images currently missing them to improve accessibility and image search rankings."
    },
    {
      "title": "Streamline CTAs",
      "impact": "Medium Impact",
      "description": "Review the 31 CTAs to ensure there is a clear primary conversion path. Consolidate or remove secondary buttons to reduce cognitive load."
    }
  ]
}