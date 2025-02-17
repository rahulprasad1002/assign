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
    // origin: ALLOWED_ORIGINS,
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
        console.log(origin);
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], // Methods you want to allow
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify headers you want to allow
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
