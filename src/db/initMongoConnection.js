import mongoose from 'mongoose';
import { env } from '../utils/env.js';

const user = env('MONGODB_USER');
const pwd = env('MONGODB_PASSWORD');
const url = env('MONGODB_URL');
const db = env('MONGODB_DB');

const URI = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

export async function initMongoConnection() {
  try {
    await mongoose.connect(URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
