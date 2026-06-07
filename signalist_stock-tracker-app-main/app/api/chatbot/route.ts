import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });

  const { message, watchlist, history } = await req.json();
  if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  const watchlistContext = watchlist?.length
    ? `The user's watchlist contains: ${watchlist.join(', ')}.`
    : 'The user has no stocks in their watchlist yet.';

  const systemPrompt = `You are StrikePrice AI, a helpful stock market advisor.
${watchlistContext}
Give concise advice about stocks in the user's watchlist.
Always mention relevant price levels, risks, and opportunities.
Always end with "Not financial advice." Keep responses under 120 words.`;

  const contents = [
    ...(history || []),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
      }),
    });
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.';
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}