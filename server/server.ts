import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { indexRoute } from './routes/index.route.js';
import { getChatHistory } from './routes/get-chat-history.route.js';
import { getChatConversation } from './routes/get-chat-conversation.route.js';
import { startConversation } from './routes/start-conversation.route.js';
import { continueConversation } from './routes/continue-conversation.route.js';

const logger = pino();

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.get('/', indexRoute);
app.get('/api/get-chat-history', getChatHistory);
app.get('/api/get-chat-conversation/:id', getChatConversation);
app.post('/api/start-conversation', startConversation);
app.post('/api/continue-conversation', continueConversation);

// Catch-all for any unhandled error thrown from a route handler.
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err, method: req.method, url: req.url }, 'Unhandled error in request');
  res.status(500).json({ message: 'An unexpected server error occurred' });
});

const port = process.env['PORT'] ?? 9000;

app.listen(port, () => {
  logger.info(`Server listening on http://localhost:${port}`);
});
