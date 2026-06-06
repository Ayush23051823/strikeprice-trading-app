'use client';
import { useState } from 'react';
import Link from 'next/link';

type StockData = { symbol: string; price: number; change: number; changePercent: number; high: number; low: number; open: number; prevClose: number };

const COLORS = ['text-yellow-400', 'text-blue-400', 'text-green-400'];
const BG_COLORS = ['bg-yellow-500/10', 'bg-blue-500/10', 'bg-green-500/10'];

export default function CompareClient() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [data, setData] = useState<Record<string, StockData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  const fetchStock = async (sym: string) => {
    setLoading(prev => ({ ...prev, [sym]: true }));
    try {
      const res = await fetch(`/api/stock-quote?symbol=${sym}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(prev => ({ ...prev, [sym]: json }));
    } catch {
      setError(`Could not fetch data for ${sym}`);
    } finally {
      setLoading(prev => ({ ...prev, [sym]: false }));
    }
  };

  const handleAdd = () => {
    const sym = input.trim().toUpperCase();
    if (!sym) return;
    if (symbols.includes(sym)) { setError('Already added.'); return; }
    if (symbols.length >= 3) { setError('Max 3 stocks.'); return; }
    setError('');
    setSymbols(prev => [...prev, sym]);
    setInput('');
    fetchStock(sym);
  };

  const handleRemove = (sym: string) => {
    setSymbols(prev => prev.filter(s => s !== sym));
    setData(prev => { const n = { ...prev }; delete n[sym]; return n; });
  };

  const metrics = [
    { label: 'Price', key: 'price', format: (v: number) => `$${v.toFixed(2)}` },
    { label: '1D Change', key: 'changePercent', format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`, colorize: true },
    { label: "Today's High", key: 'high', format: (v: number) => `$${v.toFixed(2)}` },
    { label: "Today's Low", key: 'low', format: (v: number) => `$${v.toFixed(2)}` },
    { label: 'Open', key: 'open', format: (v: number) => `$${v.toFixed(2)}` },
    { label: 'Prev Close', key: 'prevClose', format: (v: number) => `$${v.toFixed(2)}` },
  ];

  return (
    <div>
      {/* Add stocks */}
      <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-5 mb-8 flex gap-3 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">Add Stock Symbol</label>
          <input value={input} onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. AAPL" disabled={symbols.length >= 3}
            className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm" />
        </div>
        <button onClick={handleAdd} disabled={symbols.length >= 3}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-40">
          + Add
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Chips */}
      {symbols.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {symbols.map((sym, i) => (
            <div key={sym} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold font-mono ${COLORS[i]} ${BG_COLORS[i]} border-current/30`}>
              {sym} {loading[sym] ? '⟳' : ''}
              <button onClick={() => handleRemove(sym)} className="hover:text-red-400 transition-colors">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Table */}
      {symbols.length > 0 && (
        <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-500 text-xs uppercase tracking-wider">Metric</th>
                {symbols.map((sym, i) => (
                  <th key={sym} className="text-center px-5 py-4">
                    <div className={`font-mono font-bold text-base ${COLORS[i]}`}>{sym}</div>
                    <Link href={`/stocks/${sym}`} className="text-xs text-gray-500 hover:text-yellow-400 underline underline-offset-2">View chart →</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label} className="border-b border-gray-800/50 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-gray-400 text-xs uppercase tracking-wider">{m.label}</td>
                  {symbols.map((sym, i) => {
                    const d = data[sym];
                    const val = d ? (d as Record<string, number>)[m.key] : null;
                    const formatted = val != null ? m.format(val) : loading[sym] ? '…' : '—';
                    const color = m.colorize && val != null ? (val >= 0 ? 'text-green-400' : 'text-red-400') : COLORS[i];
                    return <td key={sym} className={`px-5 py-3 text-center font-semibold ${color}`}>{formatted}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {symbols.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">⚖️</p>
          <p className="text-lg font-medium text-gray-400">No stocks added yet</p>
          <p className="text-sm mt-1">Add up to 3 symbols above to compare.</p>
        </div>
      )}
    </div>
  );
}
