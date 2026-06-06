import { auth } from "@/lib/better-auth/auth";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAIDigest } from '@/lib/actions/digest.actions';

const sentimentColor = (v: string) => {
  if (v === 'Bullish' || v === 'Strong') return 'text-green-400';
  if (v === 'Bearish' || v === 'Weak') return 'text-red-400';
  return 'text-yellow-400';
};
const sentimentIcon = (v: string) => {
  if (v === 'Bullish' || v === 'Strong') return '▲';
  if (v === 'Bearish' || v === 'Weak') return '▼';
  return '◆';
};

export default async function DigestPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');
  const digest = await getAIDigest();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">AI Market Digest</h1>
        <p className="text-gray-400">Powered by Gemini — {today}</p>
      </div>

      {/* Main digest card */}
      <div className="bg-[#0a0d14] border border-purple-900/40 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a78bfa]" />
          <span className="text-purple-300 font-semibold text-sm">Gemini Daily Summary</span>
          <span className="ml-auto text-gray-600 text-xs">{today}</span>
        </div>
        <p className="text-gray-300 text-base leading-relaxed mb-6">{digest.summary}</p>
        <div className="flex flex-wrap gap-2">
          {digest.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/40">{tag}</span>
          ))}
        </div>
      </div>

      {/* Sentiment grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Object.entries(digest.sentiment).map(([sector, value]) => (
          <div key={sector} className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{sector}</p>
            <p className={`text-2xl mb-1 ${sentimentColor(value)}`}>{sentimentIcon(value)}</p>
            <p className={`text-sm font-bold ${sentimentColor(value)}`}>{value}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-xs text-center">AI-generated summary for informational purposes only. Not financial advice. Refreshes every hour.</p>
    </div>
  );
}
