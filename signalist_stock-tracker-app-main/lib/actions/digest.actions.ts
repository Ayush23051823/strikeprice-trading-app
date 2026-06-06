'use server';
import { cache } from 'react';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const FALLBACK = {
  summary: 'Markets showed mixed signals today. Tech stocks led gains while energy sector faced headwinds. Investors await upcoming Fed commentary for direction.',
  tags: ['Tech rally', 'Fed watch', 'Energy weak', 'Mixed signals'],
  sentiment: { market: 'Neutral', tech: 'Strong', energy: 'Weak', finance: 'Neutral' }
};

export const getAIDigest = cache(async (): Promise<{
  summary: string;
  tags: string[];
  sentiment: { market: string; tech: string; energy: string; finance: string };
}> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return FALLBACK;

  try {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const prompt = `You are a financial analyst. Generate a brief stock market daily digest for ${today}.

IMPORTANT: Respond with ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

The JSON must have exactly this structure:
{"summary":"2-3 sentence market overview","tags":["tag1","tag2","tag3","tag4"],"sentiment":{"market":"Bullish","tech":"Strong","energy":"Weak","finance":"Neutral"}}

For sentiment values use only: Bullish, Bearish, Neutral, Strong, Weak`;

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return FALLBACK;

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!raw || raw.trim() === '') return FALLBACK;

    // Strip markdown fences if any
    const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // Extract JSON object even if surrounded by text
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) return FALLBACK;

    const parsed = JSON.parse(match[0]);

    if (!parsed.summary || !parsed.tags || !parsed.sentiment) return FALLBACK;

    return parsed;
  } catch (err) {
    console.error('getAIDigest error:', err);
    return FALLBACK;
  }
});