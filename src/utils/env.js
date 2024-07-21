import 'dotenv/config';

export function env(port, defaultValue) {
  const value = process.env[port];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${port}'].`);
}
