'use client';

import { useState, useTransition } from 'react';
import { createAlert, deleteAlert } from '@/lib/actions/alerts.actions';

type AlertEntry = {
  id: string;
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'upper' | 'lower';
  threshold: number;
  createdAt: Date;
};

export default function AlertsClient({
  initialAlerts,
  userEmail,
}: {
  initialAlerts: AlertEntry[];
  userEmail: string;
}) {
  const [alerts, setAlerts] = useState<AlertEntry[]>(initialAlerts);
  const [symbol, setSymbol] = useState('');
  const [company, setCompany] = useState('');
  const [alertName, setAlertName] = useState('');
  const [alertType, setAlertType] = useState<'upper' | 'lower'>('upper');
  const [threshold, setThreshold] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    const sym = symbol.trim().toUpperCase();
    const comp = company.trim() || sym;
    const name = alertName.trim() || `${sym} ${alertType} alert`;
    const price = parseFloat(threshold);
    if (!sym) { setError('Please enter a stock symbol.'); return; }
    if (!threshold || isNaN(price) || price <= 0) { setError('Please enter a valid threshold price.'); return; }
    setError('');
    startTransition(async () => {
      const res = await createAlert(userEmail, sym, comp, name, alertType, price);
      if (res.success) {
        setAlerts((prev) => [
          ...prev,
          { id: Date.now().toString(), symbol: sym, company: comp, alertName: name, alertType, threshold: price, createdAt: new Date() },
        ]);
        setSymbol('');
        setCompany('');
        setAlertName('');
        setThreshold('');
      } else {
        setError('Failed to create alert. Please try again.');
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteAlert(userEmail, id);
      if (res.success) setAlerts((prev) => prev.filter((a) => a.id !== id));
    });
  };

  return (
    <div>
      {/* Create alert form */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 mb-8">
        <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Create New Alert</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Symbol *</label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. TSLA"
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Company (optional)</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Tesla Inc."
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Alert Name (optional)</label>
            <input
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              placeholder="e.g. TSLA breakout"
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Alert Type *</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as 'upper' | 'lower')}
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 text-sm"
            >
              <option value="upper">Upper — Alert when price goes above</option>
              <option value="lower">Lower — Alert when price goes below</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Threshold Price ($) *</label>
            <input
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="e.g. 250.00"
              type="number"
              min="0"
              step="0.01"
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button
          onClick={handleCreate}
          disabled={isPending}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          + Create Alert
        </button>
      </div>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🔔</p>
          <p className="text-lg font-medium text-gray-400">No alerts yet</p>
          <p className="text-sm mt-1">Create an alert above to get notified on price moves.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded font-mono font-bold text-xs">
                    {alert.symbol}
                  </span>
                  <p className="text-white font-semibold mt-2 text-sm">{alert.alertName}</p>
                  <p className="text-gray-500 text-xs">{alert.company}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  alert.alertType === 'upper'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {alert.alertType === 'upper' ? '▲ Above' : '▼ Below'}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Threshold</p>
                  <p className="text-white font-bold text-lg">${alert.threshold.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDelete(alert.id)}
                  disabled={isPending}
                  className="text-red-400 hover:text-red-300 text-xs border border-red-400/30 hover:border-red-300/50 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-600 text-xs">
                Created {new Date(alert.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
