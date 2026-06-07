import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import SIPClient from './SIPClient';

export default async function SIPPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">SIP Planner</h1>
        <p className="text-gray-400">Calculate returns and track your Systematic Investment Plans.</p>
      </div>
      <SIPClient userEmail={session.user.email} />
    </div>
  );
}