import path from 'node:path';
import { env } from '../utils/env.js';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ACESS_TOKEN_TTL = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL = 24 * 60 * 60 * 1000;

export const SMTP = {
  HOST: env('SMTP_HOST'),
  PORT: Number(env('SMTP_PORT')),
  USER: env('SMTP_USER'),
  PASSWORD: env('SMTP_PASSWORD'),
  FROM: env('SMTP_FROM'),
};

export const TEMPLATES_DIR = path.resolve('src', 'templates');
