import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWatchlistByEmail } from '@/lib/actions/watchlist.actions';
import WatchlistClient from './WatchlistClient';

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');

  const watchlist = await getWatchlistByEmail(session.user.email);

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">My Watchlist</h1>
        <p className="text-gray-400">Track your favourite stocks in one place.</p>
      </div>
      <WatchlistClient initialWatchlist={watchlist} userEmail={session.user.email} />
    </div>
  );
}
