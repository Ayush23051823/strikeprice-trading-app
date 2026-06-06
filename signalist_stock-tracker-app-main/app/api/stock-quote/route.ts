import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol');
  if (!symbol) return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
  const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';
  if (!token) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${token}`);
    const data = await res.json();
    if (!data.c || data.c === 0) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      price: data.c,
      change: data.d ?? 0,
      changePercent: data.dp ?? 0,
      high: data.h ?? 0,
      low: data.l ?? 0,
      open: data.o ?? 0,
      prevClose: data.pc ?? 0,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
