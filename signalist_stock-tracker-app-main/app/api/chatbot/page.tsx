import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWatchlistByEmail } from '@/lib/actions/watchlist.actions';
import ChatbotClient from './ChatbotClient';

export default async function ChatbotPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');
  const watchlist = await getWatchlistByEmail(session.user.email);
  const symbols = watchlist.map((w: any) => w.symbol);
  return (
    <div className="min-h-screen max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">AI Stock Advisor</h1>
        <p className="text-gray-400">Powered by Gemini — advice based on your watchlist.</p>
      </div>
      <ChatbotClient watchlist={symbols} userName={session.user.name} />
    </div>
  );
}