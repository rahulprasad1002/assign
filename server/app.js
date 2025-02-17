import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import requirementRoutes from './routes/requirement.routes.js';
import userRoutes from './routes/user.routes.js';

import { PORT } from './config/env.js';
import { ALLOWED_ORIGINS } from './config/allowed-origins.js';

import { connectToMongo } from './database/mongodb.js';

const app = express();

// Essential Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Methods you want to allow
    allowedHeaders: '*', // Specify headers you want to allow
    exposedHeaders: '*', // Expose all headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/requirements', requirementRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Assign Backend.',
  });
});

// Fallback Route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'No Such Route',
  });
});

app.listen(PORT, async () => {
  console.log('✅ Server Started on PORT:', PORT);
  await connectToMongo();
});
