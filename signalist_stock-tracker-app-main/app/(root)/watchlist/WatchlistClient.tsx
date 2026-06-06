'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';

type WatchlistEntry = {
  id: string;
  symbol: string;
  company: string;
  addedAt: Date;
};

export default function WatchlistClient({
  initialWatchlist,
  userEmail,
}: {
  initialWatchlist: WatchlistEntry[];
  userEmail: string;
}) {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(initialWatchlist);
  const [symbol, setSymbol] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    const sym = symbol.trim().toUpperCase();
    const comp = company.trim() || sym;
    if (!sym) { setError('Please enter a stock symbol.'); return; }
    if (watchlist.find((w) => w.symbol === sym)) { setError('Already in watchlist.'); return; }
    setError('');
    startTransition(async () => {
      const res = await addToWatchlist(userEmail, sym, comp);
      if (res.success) {
        setWatchlist((prev) => [...prev, { id: Date.now().toString(), symbol: sym, company: comp, addedAt: new Date() }]);
        setSymbol('');
        setCompany('');
      } else {
        setError('Failed to add. Please try again.');
      }
    });
  };

  const handleRemove = (sym: string) => {
    startTransition(async () => {
      const res = await removeFromWatchlist(userEmail, sym);
      if (res.success) {
        setWatchlist((prev) => prev.filter((w) => w.symbol !== sym));
      }
    });
  };

  return (
    <div>
      {/* Add stock form */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 mb-8 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">Symbol</label>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g. AAPL"
            className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">Company Name (optional)</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Apple Inc."
            className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          + Add Stock
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Table */}
      {watchlist.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">⭐</p>
          <p className="text-lg font-medium text-gray-400">Your watchlist is empty</p>
          <p className="text-sm mt-1">Add stocks above to start tracking them.</p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-left px-5 py-4">Symbol</th>
                <th className="text-left px-5 py-4">Added</th>
                <th className="text-left px-5 py-4">Chart</th>
                <th className="text-left px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr key={item.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-white font-medium">{item.company}</td>
                  <td className="px-5 py-4">
                    <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded font-mono font-bold text-xs">
                      {item.symbol}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(item.addedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/stocks/${item.symbol}`}
                      className="text-yellow-500 hover:text-yellow-400 text-xs underline underline-offset-2"
                    >
                      View →
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleRemove(item.symbol)}
                      disabled={isPending}
                      className="text-red-400 hover:text-red-300 text-xs border border-red-400/30 hover:border-red-300/50 px-3 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
