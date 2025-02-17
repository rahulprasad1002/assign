import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const { PORT, MONGO_DB_URI, ACCESS_TOKEN, REFRESH_TOKEN } = process.env;
