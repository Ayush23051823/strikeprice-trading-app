import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import CompareClient from './CompareClient';

export default async function ComparePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Compare Stocks</h1>
        <p className="text-gray-400">Compare up to 3 stocks side by side.</p>
      </div>
      <CompareClient />
    </div>
  );
}
