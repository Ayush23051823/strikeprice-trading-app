'use client';
import { useState } from 'react';

type SIP = { id: string; name: string; category: string; amount: number; returns: number };

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

function calcSIP(monthly: number, years: number, rate: number) {
  const n = years * 12;
  const r = rate / 100 / 12;
  const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  const gains = fv - invested;
  const pct = (gains / invested) * 100;
  return { fv, invested, gains, pct };
}

export default function SIPClient({ userEmail }: { userEmail: string }) {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [sips, setSips] = useState<SIP[]>([
    { id: '1', name: 'Mirae Asset Large Cap', category: 'Equity · Large cap', amount: 2000, returns: 18.4 },
    { id: '2', name: 'Parag Parikh Flexi Cap', category: 'Equity · Flexi cap', amount: 3000, returns: 22.1 },
  ]);
  const [sipName, setSipName] = useState('');
  const [sipCategory, setSipCategory] = useState('');
  const [sipAmount, setSipAmount] = useState('');
  const [sipReturns, setSipReturns] = useState('');
  const [error, setError] = useState('');

  const result = calcSIP(monthly, years, rate);
  const investedPct = Math.round((result.invested / result.fv) * 100);
  const totalMonthly = sips.reduce((s, i) => s + i.amount, 0);

  const handleAddSIP = () => {
    if (!sipName.trim()) { setError('Enter fund name.'); return; }
    if (!sipAmount || isNaN(+sipAmount) || +sipAmount <= 0) { setError('Enter valid amount.'); return; }
    setError('');
    setSips(prev => [...prev, {
      id: Date.now().toString(),
      name: sipName.trim(),
      category: sipCategory.trim() || 'Mutual Fund',
      amount: +sipAmount,
      returns: sipReturns ? +sipReturns : 0,
    }]);
    setSipName(''); setSipCategory(''); setSipAmount(''); setSipReturns('');
  };

  const handleRemove = (id: string) => setSips(prev => prev.filter(s => s.id !== id));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">SIP Calculator</h2>
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Monthly Amount (₹)</label>
              <input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)}
                className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 text-sm" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Duration</label>
                <span className="text-xs text-green-400 font-bold">{years} years</span>
              </div>
              <input type="range" min="1" max="30" value={years} onChange={e => setYears(+e.target.value)} className="w-full accent-green-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Expected Return</label>
                <span className="text-xs text-green-400 font-bold">{rate}% p.a.</span>
              </div>
              <input type="range" min="1" max="30" value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-green-500" />
            </div>
          </div>
          <div className="mt-6 bg-green-950/30 border border-green-900/40 rounded-xl p-5 text-center">
            <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Estimated value after {years} years</p>
            <p className="text-4xl font-bold text-green-400">{formatINR(result.fv)}</p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Amount invested</span>
              <span className="text-sm font-semibold text-white">{formatINR(result.invested)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Estimated gains</span>
              <span className="text-sm font-semibold text-green-400">+{formatINR(result.gains)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Return %</span>
              <span className="text-sm font-semibold text-green-400">+{result.pct.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full mt-1">
              <div className="h-2 bg-green-500 rounded-full transition-all" style={{ width: `${investedPct}%` }} />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Invested {investedPct}%</span>
              <span className="text-xs text-green-600">Gains {100 - investedPct}%</span>
            </div>
          </div>
        </div>

        {/* Tracker */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">SIP Tracker</h2>
          <div className="flex flex-col gap-3 mb-5">
            <input placeholder="Fund name *" value={sipName} onChange={e => setSipName(e.target.value)}
              className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 text-sm" />
            <input placeholder="Category (e.g. Equity · Large cap)" value={sipCategory} onChange={e => setSipCategory(e.target.value)}
              className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Monthly ₹ *" type="number" value={sipAmount} onChange={e => setSipAmount(e.target.value)}
                className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 text-sm" />
              <input placeholder="Returns % (optional)" type="number" value={sipReturns} onChange={e => setSipReturns(e.target.value)}
                className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 text-sm" />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button onClick={handleAddSIP}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
              + Add SIP
            </button>
          </div>
          {sips.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-3xl mb-2">📈</p>
              <p className="text-sm">No SIPs added yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sips.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-[#111827] rounded-lg border border-gray-800">
                  <div>
                    <p className="text-white text-sm font-semibold">{s.name}</p>
                    <p className="text-gray-500 text-xs">{s.category}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-white text-sm font-bold">₹{s.amount.toLocaleString()}/mo</p>
                      {s.returns > 0 && <p className="text-green-400 text-xs">+{s.returns}% returns</p>}
                    </div>
                    <button onClick={() => handleRemove(s.id)} className="text-red-400 hover:text-red-300 text-xs border border-red-400/30 px-2 py-1 rounded transition-colors">✕</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <span className="text-xs text-gray-500">Total monthly SIP</span>
                <span className="text-green-400 font-bold text-sm">₹{totalMonthly.toLocaleString()}/mo</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}