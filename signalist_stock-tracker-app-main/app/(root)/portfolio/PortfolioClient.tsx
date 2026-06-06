'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { addHolding, removeHolding } from '@/lib/actions/portfolio.actions';

type Holding = { id: string; symbol: string; company: string; shares: number; buyPrice: number; addedAt: Date };

export default function PortfolioClient({ initialHoldings, userEmail }: { initialHoldings: Holding[]; userEmail: string }) {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [symbol, setSymbol] = useState('');
  const [company, setCompany] = useState('');
  const [shares, setShares] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const totalInvested = holdings.reduce((s, h) => s + h.shares * h.buyPrice, 0);

  const handleAdd = () => {
    const sym = symbol.trim().toUpperCase();
    const comp = company.trim() || sym;
    const sh = parseFloat(shares);
    const bp = parseFloat(buyPrice);
    if (!sym) { setError('Enter a stock symbol.'); return; }
    if (isNaN(sh) || sh <= 0) { setError('Enter valid shares.'); return; }
    if (isNaN(bp) || bp <= 0) { setError('Enter valid buy price.'); return; }
    setError('');
    startTransition(async () => {
      const res = await addHolding(userEmail, sym, comp, sh, bp);
      if (res.success) {
        setHoldings(prev => {
          const existing = prev.findIndex(h => h.symbol === sym);
          const newH = { id: Date.now().toString(), symbol: sym, company: comp, shares: sh, buyPrice: bp, addedAt: new Date() };
          if (existing >= 0) { const n = [...prev]; n[existing] = newH; return n; }
          return [...prev, newH];
        });
        setSymbol(''); setCompany(''); setShares(''); setBuyPrice('');
      } else setError('Failed to add holding.');
    });
  };

  const handleRemove = (sym: string) => {
    startTransition(async () => {
      const res = await removeHolding(userEmail, sym);
      if (res.success) setHoldings(prev => prev.filter(h => h.symbol !== sym));
    });
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Invested', value: `$${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'text-white' },
          { label: 'Holdings', value: `${holdings.length} stocks`, color: 'text-white' },
        ].map((c) => (
          <div key={c.label} className="bg-[#0d1117] border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Add Holding Form */}
      <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-5 mb-8">
        <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Add / Update Holding</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {[
            { label: 'Symbol *', value: symbol, setter: (v: string) => setSymbol(v.toUpperCase()), placeholder: 'AAPL' },
            { label: 'Company (optional)', value: company, setter: setCompany, placeholder: 'Apple Inc.' },
            { label: 'Shares *', value: shares, setter: setShares, placeholder: '10', type: 'number' },
            { label: 'Buy Price ($) *', value: buyPrice, setter: setBuyPrice, placeholder: '150.00', type: 'number' },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider">{f.label}</label>
              <input value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder} type={f.type || 'text'}
                className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm" />
            </div>
          ))}
        </div>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button onClick={handleAdd} disabled={isPending}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50">
          + Add Holding
        </button>
      </div>

      {/* Holdings Table */}
      {holdings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-lg font-medium text-gray-400">No holdings yet</p>
          <p className="text-sm mt-1">Add your first stock above.</p>
        </div>
      ) : (
        <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                {['Company', 'Symbol', 'Shares', 'Buy Price', 'Total Cost', 'View', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const totalCost = h.shares * h.buyPrice;
                return (
                  <tr key={h.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{h.company}</td>
                    <td className="px-5 py-4"><span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded font-mono font-bold text-xs">{h.symbol}</span></td>
                    <td className="px-5 py-4 text-gray-300">{h.shares}</td>
                    <td className="px-5 py-4 text-gray-300">${h.buyPrice.toFixed(2)}</td>
                    <td className="px-5 py-4 text-white font-semibold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-5 py-4"><Link href={`/stocks/${h.symbol}`} className="text-yellow-500 hover:text-yellow-400 text-xs underline underline-offset-2">View →</Link></td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleRemove(h.symbol)} disabled={isPending}
                        className="text-red-400 hover:text-red-300 text-xs border border-red-400/30 px-3 py-1 rounded transition-colors disabled:opacity-50">Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
