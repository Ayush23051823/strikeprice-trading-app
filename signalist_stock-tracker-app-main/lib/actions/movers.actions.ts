'use server';
import { cache } from 'react';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

function getToken() {
  return process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';
}

export type MoverStock = {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
};

const MOVER_SYMBOLS = [
  'AAPL','MSFT','GOOGL','AMZN','NVDA','TSLA','META','NFLX','AMD','INTC',
  'PLTR','COIN','SNAP','RIVN','LCID','SMCI','MSTR','SQ','SHOP','PYPL',
  'UBER','LYFT','DASH','ABNB','RBLX','DDOG','CRWD','NET','SNOW','ZM',
];

export const getTopMovers = cache(async (): Promise<{ gainers: MoverStock[]; losers: MoverStock[] }> => {
  const token = getToken();
  if (!token) return { gainers: [], losers: [] };
  try {
    const quotes = await Promise.all(
      MOVER_SYMBOLS.map(async (sym) => {
        try {
          const [quoteRes, profileRes] = await Promise.all([
            fetch(`${FINNHUB_BASE_URL}/quote?symbol=${sym}&token=${token}`, { next: { revalidate: 300 } }),
            fetch(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${sym}&token=${token}`, { next: { revalidate: 3600 } }),
          ]);
          const quote = await quoteRes.json();
          const profile = await profileRes.json();
          if (!quote.c || quote.c === 0) return null;
          return {
            symbol: sym,
            company: profile.name || sym,
            price: quote.c,
            change: quote.d ?? 0,
            changePercent: quote.dp ?? 0,
          } as MoverStock;
        } catch { return null; }
      })
    );
    const valid = quotes.filter(Boolean) as MoverStock[];
    const sorted = [...valid].sort((a, b) => b.changePercent - a.changePercent);
    return {
      gainers: sorted.filter(s => s.changePercent > 0).slice(0, 10),
      losers: [...sorted].reverse().filter(s => s.changePercent < 0).slice(0, 10),
    };
  } catch (err) { console.error('getTopMovers error:', err); return { gainers: [], losers: [] }; }
});
