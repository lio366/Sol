import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'adpulse-dev-secret';
const port = Number(process.env.PORT || 3000);

export const DEFAULT_DB = {
  users: [],
  tenants: [],
  memberships: [],
  workflows: [],
  subscriptions: [],
  auditLogs: []
};

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

export async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

export async function writeDb(db) {
  await ensureDb();
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
}

export async function resetDatabase() {
  await writeDb(structuredClone(DEFAULT_DB));
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function getAuthenticatedUser(req) {
  const token = getBearerToken(req);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = await readDb();
    const user = db.users.find((item) => item.id === payload.sub);
    if (!user) return null;
    return { user, db };
  } catch {
    return null;
  }
}

async function getTenantMembership(db, userId, tenantId) {
  return db.memberships.find((member) => member.userId === userId && member.tenantId === tenantId);
}

function buildAudit(event, tenantId, userId, details = {}) {
  return {
    id: uuidv4(),
    tenantId: tenantId || null,
    userId: userId || null,
    event,
    details,
    createdAt: new Date().toISOString()
  };
}

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/config', async (_req, res) => {
  res.json({
    languageOptions: [
      { code: 'es', label: 'Español' },
      { code: 'en', label: 'English' }
    ],
    plans: [
      { id: 'trial', name: 'Starter', price: 0, description: 'Prueba de 15 días para validar procesos clave.' },
      { id: 'essentials', name: 'Essentials', price: 49, description: 'Operación con automatizaciones básicas.' },
      { id: 'growth', name: 'Growth', price: 129, description: 'Escala con IA, aprobaciones y reporting.' },
      { id: 'operations', name: 'Operations', price: 249, description: 'Control multi-tenant y consumo avanzado.' }
    ],
    faqs: [
      {
        question: '¿Qué es ADPULSE?',
        answer: 'Es una plataforma SaaS para automatizar procesos empresariales con IA, permisos y trazabilidad.'
      },
      {
        question: '¿Necesito tarjeta para la prueba?',
        answer: 'No. La prueba de 15 días no exige tarjeta ni cobro si no aceptas el precio y las condiciones.'
      },
      {
        question: '¿Cada empresa tiene su propio aislamiento?',
        answer: 'Sí. Cada tenant cuenta con usuarios, permisos, workflows y datos aislados del resto.'
      }
    ],
    serviceAreas: ['Atención al cliente', 'Ventas', 'Operaciones', 'Finanzas', 'Marketing', 'Soporte']
  });
});

app.post('/api/register', async (req, res) => {
  const { fullName, email, password, businessName, industry, language } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios.' });
  }

  const db = await readDb();
  const exists = db.users.some((item) => item.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'Ya existe un usuario con ese email.' });
  }

  const userId = uuidv4();
  const tenantId = uuidv4();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(String(password), 10);

  const user = {
    id: userId,
    fullName: String(fullName),
    email: String(email).toLowerCase(),
    passwordHash,
    language: language || 'es',
    createdAt: now,
    status: 'active'
  };

  const tenant = {
    id: tenantId,
    name: businessName || `${String(fullName).split(' ')[0]}'s Business`,
    industry: industry || 'general',
    status: 'trial',
    plan: 'trial',
    ownerId: userId,
    createdAt: now,
    updatedAt: now
  };

  db.users.push(user);
  db.tenants.push(tenant);
  db.memberships.push({
    id: uuidv4(),
    userId,
    tenantId,
    role: 'owner',
    status: 'active',
    createdAt: now
  });
  db.subscriptions.push({
    id: uuidv4(),
    tenantId,
    plan: 'trial',
    status: 'trial_active',
    trialDays: 15,
    consentAccepted: false,
    createdAt: now
  });
  db.auditLogs.push(buildAudit('user.registered', tenantId, userId, { email: user.email }));
  await writeDb(db);

  return res.status(201).json({
    token: signToken(user),
    user: { id: user.id, fullName: user.fullName, email: user.email, language: user.language },
    tenant,
    memberships: [{ tenantId, role: 'owner' }]
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos.' });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const memberships = db.memberships.filter((m) => m.userId === user.id);
  const tenant = memberships.length ? db.tenants.find((t) => t.id === memberships[0].tenantId) : null;

  db.auditLogs.push(buildAudit('user.login', tenant?.id || null, user.id, { email: user.email }));
  await writeDb(db);

  return res.json({
    token: signToken(user),
    user: { id: user.id, fullName: user.fullName, email: user.email, language: user.language },
    tenant,
    memberships
  });
});

app.get('/api/me', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ message: 'No autenticado.' });

  const { user, db } = auth;
  const memberships = db.memberships.filter((m) => m.userId === user.id);
  const tenants = db.tenants.filter((tenant) => memberships.some((m) => m.tenantId === tenant.id));

  return res.json({
    user: { id: user.id, fullName: user.fullName, email: user.email, language: user.language },
    memberships,
    tenants
  });
});

app.get('/api/tenants', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ message: 'No autenticado.' });

  const { user, db } = auth;
  const memberships = db.memberships.filter((m) => m.userId === user.id);
  const tenants = db.tenants.filter((tenant) => memberships.some((m) => m.tenantId === tenant.id));

  return res.json({ tenants, memberships });
});

app.post('/api/tenants', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ message: 'No autenticado.' });

  const { user, db } = auth;
  const { name, industry } = req.body || {};
  if (!name) return res.status(400).json({ message: 'El nombre de la empresa es obligatorio.' });

  const tenantId = uuidv4();
  const now = new Date().toISOString();
  const tenant = {
    id: tenantId,
    name: String(name),
    industry: industry || 'general',
    status: 'trial',
    plan: 'trial',
    ownerId: user.id,
    createdAt: now,
    updatedAt: now
  };

  db.tenants.push(tenant);
  db.memberships.push({ id: uuidv4(), userId: user.id, tenantId, role: 'owner', status: 'active', createdAt: now });
  db.subscriptions.push({
    id: uuidv4(),
    tenantId,
    plan: 'trial',
    status: 'trial_active',
    trialDays: 15,
    consentAccepted: false,
    createdAt: now
  });
  db.auditLogs.push(buildAudit('tenant.created', tenantId, user.id, { name: tenant.name }));
  await writeDb(db);

  return res.status(201).json({ tenant });
});

app.get('/api/dashboard', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ message: 'No autenticado.' });

  const { user, db } = auth;
  const memberships = db.memberships.filter((m) => m.userId === user.id);
  const tenantId = req.query.tenantId || memberships[0]?.tenantId;
  if (!tenantId) return res.status(404).json({ message: 'No hay empresa asociada.' });

  const membership = await getTenantMembership(db, user.id, tenantId);
  if (!membership) return res.status(403).json({ message: 'No tienes acceso a esta empresa.' });

  const tenant = db.tenants.find((item) => item.id === tenantId);
  const workflowCount = db.workflows.filter((item) => item.tenantId === tenantId).length;
  const subscription = db.subscriptions.find((item) => item.tenantId === tenantId);

  return res.json({
    tenant,
    userRole: membership.role,
    metrics: {
      workflows: workflowCount,
      activeAutomations: Math.max(1, workflowCount),
      leads: 32,
      conversion: 21,
      monthlySpend: 108,
      aiCost: 42
    },
    workflows: db.workflows.filter((item) => item.tenantId === tenantId).slice(0, 8),
    subscriptions: subscription ? [subscription] : []
  });
});

app.post('/api/workflows', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ message: 'No autenticado.' });

  const { user, db } = auth;
  const { tenantId, name, trigger, status } = req.body || {};
  if (!tenantId || !name) return res.status(400).json({ message: 'Tenant y nombre requeridos.' });

  const membership = await getTenantMembership(db, user.id, tenantId);
  if (!membership) return res.status(403).json({ message: 'No tienes permisos sobre esta empresa.' });

  const workflow = {
    id: uuidv4(),
    tenantId,
    name: String(name),
    trigger: trigger || 'lead.created',
    status: status || 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.workflows.push(workflow);
  db.auditLogs.push(buildAudit('workflow.created', tenantId, user.id, { workflowId: workflow.id, name }));
  await writeDb(db);

  return res.status(201).json({ workflow });
});

app.post('/api/trial/accept', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ message: 'No autenticado.' });

  const { user, db } = auth;
  const { tenantId, plan } = req.body || {};
  if (!tenantId) return res.status(400).json({ message: 'Debes indicar la empresa.' });

  const membership = await getTenantMembership(db, user.id, tenantId);
  if (!membership) return res.status(403).json({ message: 'No tienes permisos sobre esta empresa.' });

  const sub = db.subscriptions.find((item) => item.tenantId === tenantId);
  if (!sub) return res.status(404).json({ message: 'No existe una suscripción para esta empresa.' });

  sub.plan = plan || 'growth';
  sub.status = 'conversion_pending';
  sub.consentAccepted = true;
  sub.acceptedAt = new Date().toISOString();

  const tenant = db.tenants.find((item) => item.id === tenantId);
  if (tenant) {
    tenant.plan = sub.plan;
    tenant.status = 'trial';
    tenant.updatedAt = new Date().toISOString();
  }

  db.auditLogs.push(buildAudit('trial.accepted', tenantId, user.id, { plan: sub.plan }));
  await writeDb(db);

  return res.json({ message: 'Consentimiento de prueba aceptado y registrado.', subscription: sub, tenant });
});

app.get('/api/admin/stats', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ message: 'No autenticado.' });

  const { user, db } = auth;
  const memberships = db.memberships.filter((m) => m.userId === user.id && (m.role === 'owner' || m.role === 'admin'));
  if (!memberships.length) return res.status(403).json({ message: 'Sin acceso administrativo.' });

  return res.json({
    stats: {
      totalTenants: db.tenants.length,
      activeTrials: db.subscriptions.filter((sub) => sub.status !== 'canceled').length,
      workflowCount: db.workflows.length,
      mrRevenue: 4012,
      aiCost: 930,
      securityEvents: 2,
      uptime: '99.8%'
    },
    tenants: db.tenants.slice(0, 5),
    activity: db.auditLogs.slice(-10).reverse()
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/privacy', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/terms', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export { app };

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  app.listen(port, () => {
    console.log(`ADPULSE MVP running on http://localhost:${port}`);
  });
}

