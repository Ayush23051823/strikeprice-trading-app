'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Schema, model, models, type Document, type Model } from 'mongoose';
import { revalidatePath } from 'next/cache';

interface AlertItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'upper' | 'lower';
  threshold: number;
  createdAt: Date;
}

const AlertSchema = new Schema<AlertItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true },
    alertName: { type: String, required: true },
    alertType: { type: String, enum: ['upper', 'lower'], required: true },
    threshold: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const AlertModel: Model<AlertItem> =
  (models?.Alert as Model<AlertItem>) || model<AlertItem>('Alert', AlertSchema);

export async function getAlertsByEmail(email: string) {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
    if (!user) return [];
    const userId = (user.id as string) || String(user._id || '');
    const alerts = await AlertModel.find({ userId }).lean();
    return alerts.map((a) => ({
      id: String(a._id),
      symbol: a.symbol,
      company: a.company,
      alertName: a.alertName,
      alertType: a.alertType,
      threshold: a.threshold,
      createdAt: a.createdAt,
    }));
  } catch (err) {
    console.error('getAlertsByEmail error:', err);
    return [];
  }
}

export async function createAlert(
  email: string,
  symbol: string,
  company: string,
  alertName: string,
  alertType: 'upper' | 'lower',
  threshold: number
) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
    if (!user) throw new Error('User not found');
    const userId = (user.id as string) || String(user._id || '');
    await AlertModel.create({ userId, symbol: symbol.toUpperCase(), company, alertName, alertType, threshold });
    revalidatePath('/alerts');
    return { success: true };
  } catch (err) {
    console.error('createAlert error:', err);
    return { success: false, error: String(err) };
  }
}

export async function deleteAlert(email: string, alertId: string) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
    if (!user) throw new Error('User not found');
    const userId = (user.id as string) || String(user._id || '');
    await AlertModel.findOneAndDelete({ _id: alertId, userId });
    revalidatePath('/alerts');
    return { success: true };
  } catch (err) {
    console.error('deleteAlert error:', err);
    return { success: false, error: String(err) };
  }
}
