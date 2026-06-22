import { Request, Response } from 'express';

export function indexRoute(req: Request, res: Response) {
  req.log.info('Serving server status page');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Angular AI In Depth — Server</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #170c2d; color: #fff; }
    .card { text-align: center; padding: 40px 56px; border: 1px solid rgba(233,30,140,0.4); border-radius: 16px; background: #1e1440; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    p  { margin: 0; color: #b8a8cc; font-size: 14px; }
    .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #e91e8c; margin-right: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <h1><span class="dot"></span>Server is running</h1>
    <p>Angular AI In Depth — Express API</p>
  </div>
</body>
</html>`);
}
