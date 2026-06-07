'use client';
import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'model'; text: string };

const SUGGESTIONS = [
  'Which stock looks best right now?',
  'What are the risks in my watchlist?',
  'Should I diversify more?',
  'Give me a summary of my watchlist',
];

export default function ChatbotClient({ watchlist, userName }: { watchlist: string[]; userName: string }) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'model',
    text: watchlist.length > 0
      ? `Hi ${userName?.split(' ')[0] || 'there'}! I can see you're watching ${watchlist.join(', ')}. Ask me anything about them.`
      : `Hi ${userName?.split(' ')[0] || 'there'}! Add some stocks to your watchlist and I'll give you personalised advice.`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, watchlist, history }),
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, I could not respond right now.';
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      setHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text }] },
        { role: 'model', parts: [{ text: reply }] },
      ]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm font-semibold text-gray-300">StrikePrice AI — Watchlist Advisor</span>
        <div className="ml-auto flex gap-1.5 flex-wrap">
          {watchlist.map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-mono font-bold">{s}</span>
          ))}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 min-h-[400px] max-h-[500px] overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-green-950/40 border border-green-900/40 text-green-100 rounded-br-none'
                : 'bg-[#111827] border border-gray-800 text-gray-300 rounded-bl-none'
            }`}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#111827] border border-gray-800 px-4 py-3 rounded-xl rounded-bl-none">
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-5 pb-3 flex gap-2 flex-wrap">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => sendMessage(s)} disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-400 hover:border-green-500 hover:text-green-400 transition-colors disabled:opacity-40">
            {s}
          </button>
        ))}
      </div>
      <div className="px-5 pb-5 flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about your watchlist stocks..."
          disabled={loading}
          className="flex-1 bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 text-sm disabled:opacity-50" />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-40">
          Send
        </button>
      </div>
    </div>
  );
}