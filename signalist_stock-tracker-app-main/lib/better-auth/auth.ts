import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection not found");
  }

  authInstance = betterAuth({
    database: mongodbAdapter(db as any),

    secret: process.env.BETTER_AUTH_SECRET,

    baseURL:
      process.env.BETTER_AUTH_URL ||
      "https://strikeprice-trading-app.vercel.app",

    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },

    plugins: [nextCookies()],
  });

  return authInstance;
};

export const auth = {
  api: {
    getSession: async (...args: any[]) => {
      const instance = await getAuth();
      return instance.api.getSession(...args);
    },

    signUpEmail: async (...args: any[]) => {
      const instance = await getAuth();
      return instance.api.signUpEmail(...args);
    },

    signInEmail: async (...args: any[]) => {
      const instance = await getAuth();
      return instance.api.signInEmail(...args);
    },

    signOut: async (...args: any[]) => {
      const instance = await getAuth();
      return instance.api.signOut(...args);
    },
  },
};