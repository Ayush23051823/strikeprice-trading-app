import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAlertsByEmail } from '@/lib/actions/alerts.actions';
import AlertsClient from './AlertsClient';

export default async function AlertsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');

  const alerts = await getAlertsByEmail(session.user.email);

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Price Alerts</h1>
        <p className="text-gray-400">Get notified when a stock hits your target price.</p>
      </div>
      <AlertsClient initialAlerts={alerts} userEmail={session.user.email} />
    </div>
  );
}
