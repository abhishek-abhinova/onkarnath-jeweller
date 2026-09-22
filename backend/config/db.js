const mongoose = require('mongoose');
const env = require('./env');

let connected = false;
let lastError = null;

async function connectMongo() {
  if (!env.MONGO_URI) {
    console.log(
      '[db] MONGO_URI not set → using local JSON store (backend/data/db.json). Add MongoDB Atlas URI in production.'
    );
    return false;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    connected = true;
    console.log('[db] MongoDB connected.');
    return true;
  } catch (err) {
    connected = false;
    lastError = err.message;
    console.warn(
      `[db] MongoDB connection failed → using local JSON store fallback. (${err.message})`
    );
    return false;
  }
}

const mongoReady = () => connected;
const mongoLastError = () => lastError;

module.exports = { connectMongo, mongoReady, mongoLastError };