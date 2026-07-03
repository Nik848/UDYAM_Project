import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { env } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler.middleware';
import registrationRoutes from './routes/registration.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // Configure according to frontend URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(logger);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/register', registrationRoutes);

// Error Handling (Must be last)
app.use(errorHandler);

export default app;
