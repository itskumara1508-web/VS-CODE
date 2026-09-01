import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.API_PORT || 4000),
  host: process.env.API_HOST || '0.0.0.0',
  logLevel: process.env.API_LOG_LEVEL || 'info',
  jwtSecret: process.env.JWT_SECRET || 'change-me-to-a-long-random-secret-string',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  tokenIssuer: process.env.TOKEN_ISSUER || 'ntro-social-intelligence',
  mockDataMode: process.env.MOCK_DATA_MODE !== 'false',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:5001',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 10),
} as const;

export type AppConfig = typeof config;
