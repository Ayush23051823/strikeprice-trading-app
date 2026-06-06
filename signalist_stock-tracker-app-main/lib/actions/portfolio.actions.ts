'use server';
import { connectToDatabase } from '@/database/mongoose';
import { Portfolio } from '@/database/models/portfolio.model';
import { revalidatePath } from 'next/cache';

async function getUserId(email: string): Promise<string | null> {
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) return null;
  const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
  if (!user) return null;
  return (user.id as string) || String(user._id || '');
}

export async function getPortfolioByEmail(email: string) {
  if (!email) return [];
  try {
    const userId = await getUserId(email);
    if (!userId) return [];
    const items = await Portfolio.find({ userId }).lean();
    return items.map((i) => ({
      id: String(i._id), symbol: i.symbol, company: i.company,
      shares: i.shares, buyPrice: i.buyPrice, addedAt: i.addedAt,
    }));
  } catch (err) { console.error('getPortfolioByEmail error:', err); return []; }
}

export async function addHolding(email: string, symbol: string, company: string, shares: number, buyPrice: number) {
  try {
    const userId = await getUserId(email);
    if (!userId) throw new Error('User not found');
    await Portfolio.findOneAndUpdate(
      { userId, symbol: symbol.toUpperCase() },
      { userId, symbol: symbol.toUpperCase(), company, shares, buyPrice, addedAt: new Date() },
      { upsert: true, new: true }
    );
    revalidatePath('/portfolio');
    return { success: true };
  } catch (err) { return { success: false, error: String(err) }; }
}

export async function removeHolding(email: string, symbol: string) {
  try {
    const userId = await getUserId(email);
    if (!userId) throw new Error('User not found');
    await Portfolio.findOneAndDelete({ userId, symbol: symbol.toUpperCase() });
    revalidatePath('/portfolio');
    return { success: true };
  } catch (err) { return { success: false, error: String(err) }; }
}
