import 'dotenv/config';
import express from 'express';
import pinoHttp from 'pino-http';
import argon2 from 'argon2';
import { logger } from './logger';
import { users } from './db-data';
import { signIn } from './routes/sign-in';

const PORT = process.env['PORT'] ?? 9000;

const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/', (_req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Angular AI In Depth — Server</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; }
        </style>
      </head>
      <body>
        <h1>Server is running</h1>
        <p>Port: <strong>${PORT}</strong></p>
      </body>
    </html>
  `);
});

app.post('/api/sign-in', signIn);

async function startServer() {
  const seedUsers = [
    { id: '1', email: 'test@angular-university.io', password: 'angular' },
  ];

  for (const seed of seedUsers) {
    users.push({
      id: seed.id,
      email: seed.email,
      // Argon2id defaults: m=65536 (64 MiB), t=3 iterations, p=4 — OWASP recommended
      passwordHash: await argon2.hash(seed.password),
    });
    logger.info({ email: seed.email }, 'Seeded user');
  }

  app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server running');
  });
}

startServer();
