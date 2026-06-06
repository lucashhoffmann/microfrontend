import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { json } from 'milliparsec';
import { createApp as createJsonServerApp } from 'json-server/lib/app.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const databaseFile = join(__dirname, 'db.json');
const port = Number(process.env.MOCK_API_PORT ?? 3333);

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(8),
});

const adapter = new JSONFile(databaseFile);
const db = new Low(adapter, {
  users: [],
  billingDashboard: {},
  walletDashboard: {},
  analyticsDashboard: {},
});

await db.read();

const dataApp = createJsonServerApp(db, { logger: false });
const app = new App();

const RESPONSE_DELAY_MS = Number(process.env.MOCK_API_RESPONSE_DELAY_MS ?? 1500);

function delayResponse(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.use(async (req, _res, next) => {
  await delayResponse(RESPONSE_DELAY_MS);
  next();
});

app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:4202',
      'http://localhost:4203',
      'http://localhost:4205',
    ],
    allowedHeaders: 'content-type, authorization',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  }),
);
app.use(json());

function createMockToken(userId) {
  return `mock-token:${userId}`;
}

function parseAuthorizationToken(header = '') {
  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.replace('Bearer ', '').trim();
}

function resolveUserFromToken(token) {
  if (!token?.startsWith('mock-token:')) {
    return null;
  }

  const userId = token.replace('mock-token:', '');
  return db.data.users.find(user => user.id === userId) ?? null;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function createSessionResponse(user) {
  return {
    token: createMockToken(user.id),
    user: sanitizeUser(user),
  };
}

function validateBody(schema, payload) {
  const parsed = schema.safeParse(payload);

  if (parsed.success) {
    return { data: parsed.data, errors: null };
  }

  return {
    data: null,
    errors: parsed.error.flatten().fieldErrors,
  };
}

app.post('/api/auth/login', (req, res) => {
  const { data, errors } = validateBody(loginSchema, req.body);

  if (!data) {
    res.status(400).json({
      message: 'Invalid login payload',
      errors,
    });
    return;
  }

  const user = db.data.users.find(
    currentUser =>
      currentUser.email.toLowerCase() === data.email.toLowerCase() &&
      currentUser.password === data.password,
  );

  if (!user) {
    res.status(401).json({
      message: 'Invalid email or password',
    });
    return;
  }

  res.json(createSessionResponse(user));
});

app.post('/api/auth/register', async (req, res) => {
  const { data, errors } = validateBody(registerSchema, req.body);

  if (!data) {
    res.status(400).json({
      message: 'Invalid register payload',
      errors,
    });
    return;
  }

  const existingUser = db.data.users.find(
    user => user.email.toLowerCase() === data.email.toLowerCase(),
  );

  if (existingUser) {
    res.status(409).json({
      message: 'A user with this email already exists',
    });
    return;
  }

  const user = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
  };

  db.data.users.push(user);
  await db.write();

  res.status(201).json(createSessionResponse(user));
});

app.get('/api/auth/me', (req, res) => {
  const token = parseAuthorizationToken(req.headers.authorization);
  const user = resolveUserFromToken(token);

  if (!user) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  res.json(createSessionResponse(user));
});

app.get('/api/billing/dashboard', (_req, res) => {
  res.json(db.data.billingDashboard);
});

app.get('/api/wallet/dashboard', (_req, res) => {
  res.json(db.data.walletDashboard);
});

app.get('/api/analytics/dashboard', (_req, res) => {
  res.json(db.data.analyticsDashboard);
});

app.use('/api', dataApp);

app.listen(port, () => {
  console.log(`Mock API ready at http://localhost:${port}/api`);
});
