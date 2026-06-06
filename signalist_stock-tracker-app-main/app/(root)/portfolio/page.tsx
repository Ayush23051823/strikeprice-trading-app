import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPortfolioByEmail } from '@/lib/actions/portfolio.actions';
import PortfolioClient from './PortfolioClient';

export default async function PortfolioPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');
  const holdings = await getPortfolioByEmail(session.user.email);
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Portfolio</h1>
        <p className="text-gray-400">Track your holdings and overall P&L.</p>
      </div>
      <PortfolioClient initialHoldings={holdings} userEmail={session.user.email} />
    </div>
  );
}
