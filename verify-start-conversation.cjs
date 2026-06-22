const http = require('node:http');
const { spawn } = require('node:child_process');

const MOCK_PORT = 9100;
const SERVER_PORT = 9001;
let capturedProviderRequest = null;

// ── 1. Mock AI provider ────────────────────────────────────
const mock = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    capturedProviderRequest = JSON.parse(body);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      choices: [{ message: { role: 'assistant', content: 'Angular signals are reactive primitives.' } }],
    }));
  });
});

function post(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      { host: 'localhost', port: SERVER_PORT, path, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } },
      res => { let b = ''; res.on('data', c => (b += c)); res.on('end', () => resolve({ status: res.statusCode, body: b })); }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: 'localhost', port: SERVER_PORT, path }, res => {
      let b = ''; res.on('data', c => (b += c)); res.on('end', () => resolve({ status: res.statusCode, body: b }));
    }).on('error', reject);
  });
}

const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  mock.listen(MOCK_PORT);

  const server = spawn('npx', ['tsx', 'server/server.ts'], {
    env: { ...process.env, PORT: String(SERVER_PORT), AI_API_KEY: 'test-key',
           AI_API_URL: `http://localhost:${MOCK_PORT}/v1/chat/completions`, AI_MODEL: 'mock-model' },
    shell: true,
  });
  server.stdout.on('data', () => {});
  server.stderr.on('data', () => {});

  try {
    await wait(4000);

    console.log('=== happy path: POST /api/start-conversation ===');
    const started = await post('/api/start-conversation', { promptId: 'angular-expert', message: 'What are signals?' });
    console.log('status:', started.status);
    const startedBody = JSON.parse(started.body);
    console.log('response keys:', Object.keys(startedBody).join(', '));
    console.log('reply:', startedBody.reply);
    console.log('response leaks system prompt?', started.body.toLowerCase().includes('you are an expert assistant'));

    console.log('\n=== provider received (system prompt sent, ordering) ===');
    console.log('roles sent to provider:', capturedProviderRequest.messages.map(m => m.role).join(', '));
    console.log('first message is system?', capturedProviderRequest.messages[0].role === 'system');
    console.log('system content starts with:', JSON.stringify(capturedProviderRequest.messages[0].content.slice(0, 40)));

    console.log('\n=== persisted conversation should NOT contain system prompt ===');
    const fetched = await get(`/api/get-chat-conversation/${startedBody.conversationId}`);
    console.log('status:', fetched.status);
    const conv = JSON.parse(fetched.body);
    console.log('stored roles:', conv.messages.map(m => m.role).join(', '));
    console.log('stored conversation leaks system prompt?', fetched.body.toLowerCase().includes('you are an expert assistant'));
    console.log('promptId stored:', conv.promptId);

    console.log('\n=== validation: missing message (expect 400) ===');
    console.log('status:', (await post('/api/start-conversation', { promptId: 'angular-expert' })).status);

    console.log('\n=== unknown promptId (expect 404) ===');
    console.log('status:', (await post('/api/start-conversation', { promptId: 'nope', message: 'hi' })).status);
  } finally {
    server.kill();
    mock.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
