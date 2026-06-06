import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTopMovers } from '@/lib/actions/movers.actions';
import Link from 'next/link';

export default async function MoversPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');
  const { gainers, losers } = await getTopMovers();

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Top Movers</h1>
        <p className="text-gray-400">Biggest gainers and losers today.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gainers */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
            <span className="text-green-400 text-lg">▲</span>
            <h2 className="text-green-400 font-bold text-base">Top Gainers</h2>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-5 py-3">Stock</th>
              <th className="text-right px-5 py-3">Price</th>
              <th className="text-right px-5 py-3">Change</th>
            </tr></thead>
            <tbody>
              {gainers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-500">Loading data…</td></tr>
              ) : gainers.map((s, i) => (
                <tr key={s.symbol} className="border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-gray-600 text-xs">{i + 1}</td>
                  <td className="px-5 py-3">
                    <Link href={`/stocks/${s.symbol}`} className="flex flex-col gap-0.5 hover:opacity-80">
                      <span className="font-mono font-bold text-green-400 text-xs">{s.symbol}</span>
                      <span className="text-gray-500 text-xs truncate max-w-[140px]">{s.company}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-right text-white font-semibold">${s.price.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right font-bold text-green-400">+{s.changePercent.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Losers */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
            <span className="text-red-400 text-lg">▼</span>
            <h2 className="text-red-400 font-bold text-base">Top Losers</h2>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-5 py-3">Stock</th>
              <th className="text-right px-5 py-3">Price</th>
              <th className="text-right px-5 py-3">Change</th>
            </tr></thead>
            <tbody>
              {losers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-500">Loading data…</td></tr>
              ) : losers.map((s, i) => (
                <tr key={s.symbol} className="border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-gray-600 text-xs">{i + 1}</td>
                  <td className="px-5 py-3">
                    <Link href={`/stocks/${s.symbol}`} className="flex flex-col gap-0.5 hover:opacity-80">
                      <span className="font-mono font-bold text-red-400 text-xs">{s.symbol}</span>
                      <span className="text-gray-500 text-xs truncate max-w-[140px]">{s.company}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-right text-white font-semibold">${s.price.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right font-bold text-red-400">{s.changePercent.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
