'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { revalidatePath } from 'next/cache';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];
    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getWatchlistByEmail(email: string) {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];
    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];
    const items = await Watchlist.find({ userId }).lean();
    return items.map((i) => ({
      id: String(i._id),
      symbol: i.symbol,
      company: i.company,
      addedAt: i.addedAt,
    }));
  } catch (err) {
    console.error('getWatchlistByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(email: string, symbol: string, company: string) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
    if (!user) throw new Error('User not found');
    const userId = (user.id as string) || String(user._id || '');
    await Watchlist.findOneAndUpdate(
      { userId, symbol: symbol.toUpperCase() },
      { userId, symbol: symbol.toUpperCase(), company, addedAt: new Date() },
      { upsert: true, new: true }
    );
    revalidatePath('/watchlist');
    return { success: true };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, error: String(err) };
  }
}

export async function removeFromWatchlist(email: string, symbol: string) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
    if (!user) throw new Error('User not found');
    const userId = (user.id as string) || String(user._id || '');
    await Watchlist.findOneAndDelete({ userId, symbol: symbol.toUpperCase() });
    revalidatePath('/watchlist');
    return { success: true };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, error: String(err) };
  }
}
