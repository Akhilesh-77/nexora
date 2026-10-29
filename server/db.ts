import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let connectionError: string | null = null;

export const connectDatabase = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora';

  try {
    // Avoid re-connecting if already connected
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      connectionError = null;
      return true;
    }

    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    isConnected = true;
    connectionError = null;
    console.log(`[NEXORA Database] Successfully connected to MongoDB at ${uri}`);
    return true;
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message || 'Failed to connect to MongoDB';
    console.error(`[NEXORA Database] Error connecting to MongoDB: ${connectionError}`);
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[NEXORA Database] Disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  connectionError = null;
  console.log('[NEXORA Database] Reconnected to MongoDB');
});

export const getDbStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  error: connectionError,
  host: mongoose.connection.host || '127.0.0.1',
  port: mongoose.connection.port || 27017,
  name: mongoose.connection.name || 'nexora',
});

