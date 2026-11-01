const translations = {
  es: {
    navLogin: 'Entrar',
    navStart: 'Comenzar prueba',
    heroEyebrow: 'AUTOMÁTICA BUSINESS OS',
    heroTitle: 'Automatiza tu empresa con IA guiada, segura y medible.',
    heroText: 'Conectamos procesos, permisos, herramientas y agentes para que las empresas operen con velocidad sin perder control.',
    ctaStart: 'Probar 15 días',
    ctaDemo: 'Ver demo',
    metricsLeads: 'Leads gestionados',
    metricsSaved: 'Tiempo ahorrado',
    metricsApproval: 'Aprobaciones humanas',
    featuresTitle: 'Diseñado para ejecutar con control',
    feature1Title: 'Diagnóstico del negocio',
    feature1Text: 'Mapeamos procesos y sugerimos automatizaciones con impacto real.',
    feature2Title: 'Permisos y aprobación',
    feature2Text: 'Cada acción pasa por gobernanza, riesgo y validación humana.',
    feature3Title: 'Facturación transparente',
    feature3Text: 'Suscripción, consumo, costes de IA y servicios diferenciados sin sorpresas.',
    feature4Title: 'Panel multi-tenant',
    feature4Text: 'Cada empresa opera en su propio contexto, con aislamiento y trazabilidad.',
    pricingTitle: 'Planes para crecer sin perder margen',
    pricingSubtitle: 'Empieza con un piloto y escala con trazabilidad y consumo visible.',
    faqTitle: 'Preguntas frecuentes',
    contactTitle: 'Hablemos de tu operación',
    registerTitle: 'Crear cuenta',
    signInTitle: 'Iniciar sesión',
    dashboardTitle: 'Panel de negocio',
    adminTitle: 'Administración interna'
  },
  en: {
    navLogin: 'Sign in',
    navStart: 'Start trial',
    heroEyebrow: 'AUTOMATED BUSINESS OS',
    heroTitle: 'Automate your company with guided, secure and measurable AI.',
    heroText: 'We connect processes, permissions, tools and agents so businesses move faster without losing control.',
    ctaStart: 'Try 15 days',
    ctaDemo: 'See demo',
    metricsLeads: 'Leads managed',
    metricsSaved: 'Time saved',
    metricsApproval: 'Human approvals',
    featuresTitle: 'Built to execute with control',
    feature1Title: 'Business diagnosis',
    feature1Text: 'We map your processes and recommend automations with real impact.',
    feature2Title: 'Permissions and approvals',
    feature2Text: 'Every action follows governance, risk and human validation rules.',
    feature3Title: 'Transparent billing',
    feature3Text: 'Subscription, usage, AI costs and service tiers without surprises.',
    feature4Title: 'Multi-tenant control',
    feature4Text: 'Each company operates in its own context with isolation and traceability.',
    pricingTitle: 'Plans to grow without losing margin',
    pricingSubtitle: 'Start with a pilot and scale with visibility over usage and costs.',
    faqTitle: 'Frequently asked questions',
    contactTitle: 'Let’s talk about your operation',
    registerTitle: 'Create account',
    signInTitle: 'Sign in',
    dashboardTitle: 'Business dashboard',
    adminTitle: 'Internal administration'
  }
};

const state = {
  lang: localStorage.getItem('adpulse-lang') || 'es',
  token: localStorage.getItem('adpulse-token') || '',
  user: null,
  tenants: [],
  activeTenant: null,
  config: null,
  dashboard: null,
  admin: null
};

const app = {
  authMessage: document.getElementById('authMessage'),
  trialStatus: document.getElementById('trialStatus'),
  dashboardMetrics: document.getElementById('dashboardMetrics'),
  workflowList: document.getElementById('workflowList'),
  adminStats: document.getElementById('adminStats'),
  adminActivity: document.getElementById('adminActivity'),
  tenantMeta: document.getElementById('tenantMeta'),
  pricingList: document.getElementById('pricingList'),
  faqList: document.getElementById('faqList')
};

function t(key) {
  return translations[state.lang]?.[key] || key;
}

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('adpulse-lang', lang);
  document.documentElement.lang = lang;
  document.getElementById('langSwitcher').value = lang;
  updateLanguageLabels();
}

function updateLanguageLabels() {
  document.getElementById('navLoginBtn').textContent = t('navLogin');
  document.getElementById('navStartBtn').textContent = t('navStart');
  document.getElementById('heroEyebrow').textContent = t('heroEyebrow');
  document.getElementById('heroTitle').textContent = t('heroTitle');
  document.getElementById('heroText').textContent = t('heroText');
  document.getElementById('ctaStart').textContent = t('ctaStart');
  document.getElementById('ctaDemo').textContent = t('ctaDemo');
  document.getElementById('metricsLeads').textContent = t('metricsLeads');
  document.getElementById('metricsSaved').textContent = t('metricsSaved');
  document.getElementById('metricsApproval').textContent = t('metricsApproval');
  document.getElementById('featuresTitle').textContent = t('featuresTitle');
  document.getElementById('feature1Title').textContent = t('feature1Title');
  document.getElementById('feature1Text').textContent = t('feature1Text');
  document.getElementById('feature2Title').textContent = t('feature2Title');
  document.getElementById('feature2Text').textContent = t('feature2Text');
  document.getElementById('feature3Title').textContent = t('feature3Title');
  document.getElementById('feature3Text').textContent = t('feature3Text');
  document.getElementById('feature4Title').textContent = t('feature4Title');
  document.getElementById('feature4Text').textContent = t('feature4Text');
  document.getElementById('pricingTitle').textContent = t('pricingTitle');
  document.getElementById('pricingSubtitle').textContent = t('pricingSubtitle');
  document.getElementById('faqTitle').textContent = t('faqTitle');
  document.getElementById('contactTitle').textContent = t('contactTitle');
  document.getElementById('registerTitle').textContent = t('registerTitle');
  document.getElementById('signInTitle').textContent = t('signInTitle');
  document.getElementById('dashboardTitle').textContent = t('dashboardTitle');
  document.getElementById('adminTitle').textContent = t('adminTitle');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (!options.skipAuth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Ha ocurrido un error.');
  }

  return payload;
}

async function loadConfig() {
  state.config = await request('/api/config');
  renderPricing(state.config.plans || []);
  renderFaq(state.config.faqs || []);
}

function renderPricing(plans) {
  app.pricingList.innerHTML = plans.map((plan) => `
    <article class="price-card ${plan.id === 'trial' ? 'featured' : ''}">
      <div class="price-header">
        <span class="badge">${plan.name}</span>
        <h3>${plan.price === 0 ? 'Gratis' : `$${plan.price}`}</h3>
      </div>
      <p>${plan.description}</p>
      <button class="btn btn-primary" type="button" data-plan="${plan.id}">Elegir</button>
    </article>
  `).join('');

  app.pricingList.querySelectorAll('[data-plan]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!state.user) {
        document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const plan = button.dataset.plan;
      if (state.activeTenant) {
        acceptTrial(plan);
      }
    });
  });
}

function renderFaq(faqs) {
  app.faqList.innerHTML = faqs.map((item) => `
    <details class="faq-item">
      <summary>${item.question}</summary>
      <p>${item.answer}</p>
    </details>
  `).join('');
}

function showMessage(target, type, message) {
  target.className = `message ${type}`;
  target.textContent = message;
}

function setAuthState() {
  const signedIn = Boolean(state.token);
  document.getElementById('auth-section').classList.toggle('hidden', signedIn);
  document.getElementById('dashboard-section').classList.toggle('hidden', !signedIn);
  document.getElementById('admin-section').classList.toggle('hidden', !signedIn || !state.user);

  if (!signedIn) {
    state.user = null;
    state.tenants = [];
    state.activeTenant = null;
    state.dashboard = null;
    state.admin = null;
  }
}

async function loadAccount() {
  if (!state.token) {
    setAuthState();
    return;
  }

  try {
    const me = await request('/api/me');
    state.user = me.user;
    state.tenants = me.tenants || [];
    state.activeTenant = state.tenants[0] || null;
    setAuthState();
    if (state.activeTenant) {
      await loadDashboard();
    }
    await loadAdminStats();
  } catch (error) {
    logout();
    showMessage(app.authMessage, 'error', error.message);
  }
}

async function loadDashboard() {
  if (!state.activeTenant) return;
  const dashboard = await request(`/api/dashboard?tenantId=${state.activeTenant.id}`);
  state.dashboard = dashboard;
  renderDashboard();
}

async function loadAdminStats() {
  if (!state.user || !state.token) return;
  try {
    const admin = await request('/api/admin/stats');
    state.admin = admin;
    renderAdmin();
  } catch {
    state.admin = null;
    renderAdmin();
  }
}

function renderDashboard() {
  const dashboard = state.dashboard;
  if (!dashboard) return;

  const { metrics, workflows } = dashboard;
  app.tenantMeta.textContent = `Empresa activa: ${dashboard.tenant?.name || 'Sin empresa'}`;
  app.dashboardMetrics.innerHTML = `
    <div class="metric-card"><span>Workflows</span><strong>${metrics.workflows}</strong></div>
    <div class="metric-card"><span>Automations</span><strong>${metrics.activeAutomations}</strong></div>
    <div class="metric-card"><span>Leads</span><strong>${metrics.leads}</strong></div>
    <div class="metric-card"><span>Conversion</span><strong>${metrics.conversion}%</strong></div>
  `;

  app.workflowList.innerHTML = (workflows || []).map((item) => `
    <li>
      <strong>${item.name}</strong>
      <small>${item.trigger}</small>
      <span>${item.status}</span>
    </li>
  `).join('') || '<li>No hay workflows aún.</li>';
}

function renderAdmin() {
  if (!state.admin) {
    app.adminStats.innerHTML = '<div class="metric-card"><span>Acceso</span><strong>Sin permisos</strong></div>';
    app.adminActivity.innerHTML = '<p>No tienes acceso admin.</p>';
    return;
  }

  const { stats, activity = [] } = state.admin;
  app.adminStats.innerHTML = `
    <div class="metric-card"><span>Tenants</span><strong>${stats.totalTenants}</strong></div>
    <div class="metric-card"><span>Trials</span><strong>${stats.activeTrials}</strong></div>
    <div class="metric-card"><span>Workflows</span><strong>${stats.workflowCount}</strong></div>
    <div class="metric-card"><span>Uptime</span><strong>${stats.uptime}</strong></div>
  `;

  app.adminActivity.innerHTML = activity.slice(0, 6).map((item) => `
    <div class="activity-item">
      <strong>${item.event}</strong>
      <small>${new Date(item.createdAt).toLocaleString()}</small>
    </div>
  `).join('') || '<p>No hay actividad.</p>';
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await request('/api/register', { method: 'POST', body: payload });
    state.token = response.token;
    localStorage.setItem('adpulse-token', response.token);
    state.user = response.user;
    state.tenants = [{ id: response.tenant.id, name: response.tenant.name }];
    state.activeTenant = response.tenant;
    form.reset();
    showMessage(app.authMessage, 'success', 'Cuenta creada. Bienvenido a ADPULSE.');
    setAuthState();
    await loadDashboard();
    await loadAdminStats();
  } catch (error) {
    showMessage(app.authMessage, 'error', error.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await request('/api/login', { method: 'POST', body: payload });
    state.token = response.token;
    localStorage.setItem('adpulse-token', response.token);
    state.user = response.user;
    state.tenants = response.memberships ? (await request('/api/tenants')).tenants : [];
    state.activeTenant = state.tenants[0] || null;
    form.reset();
    showMessage(app.authMessage, 'success', 'Sesión iniciada con éxito.');
    setAuthState();
    await loadDashboard();
    await loadAdminStats();
  } catch (error) {
    showMessage(app.authMessage, 'error', error.message);
  }
}

async function handleTenantCreate(event) {
  event.preventDefault();
  const name = document.getElementById('tenantNameInput').value.trim();
  if (!name) return;
  try {
    const response = await request('/api/tenants', { method: 'POST', body: { name } });
    document.getElementById('tenantNameInput').value = '';
    state.tenants.push(response.tenant);
    state.activeTenant = response.tenant;
    await loadDashboard();
  } catch (error) {
    showMessage(app.trialStatus, 'error', error.message);
  }
}

async function handleWorkflowCreate(event) {
  event.preventDefault();
  const tenantId = state.activeTenant?.id;
  const name = document.getElementById('workflowName').value.trim();
  if (!tenantId || !name) return;

  try {
    await request('/api/workflows', {
      method: 'POST',
      body: { tenantId, name, trigger: 'lead.created', status: 'draft' }
    });
    document.getElementById('workflowName').value = '';
    await loadDashboard();
  } catch (error) {
    showMessage(app.trialStatus, 'error', error.message);
  }
}

async function acceptTrial(plan = 'growth') {
  if (!state.activeTenant) {
    showMessage(app.trialStatus, 'error', 'Primero crea o selecciona una empresa.');
    return;
  }

  try {
    const response = await request('/api/trial/accept', {
      method: 'POST',
      body: { tenantId: state.activeTenant.id, plan }
    });
    showMessage(app.trialStatus, 'success', response.message || 'Prueba aceptada.');
    await loadDashboard();
  } catch (error) {
    showMessage(app.trialStatus, 'error', error.message);
  }
}

function logout() {
  state.token = '';
  state.user = null;
  state.tenants = [];
  state.activeTenant = null;
  state.dashboard = null;
  localStorage.removeItem('adpulse-token');
  setAuthState();
  if (app.authMessage) {
    showMessage(app.authMessage, 'success', 'Sesión cerrada.');
  }
}

async function bootstrap() {
  setLanguage(state.lang);
  updateLanguageLabels();
  await loadConfig();
  if (state.token) {
    await loadAccount();
  } else {
    setAuthState();
  }
}

document.getElementById('langSwitcher').addEventListener('change', (event) => {
  setLanguage(event.target.value);
});

document.getElementById('navLoginBtn').addEventListener('click', () => {
  document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('navStartBtn').addEventListener('click', () => {
  document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('ctaStart').addEventListener('click', () => {
  document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('ctaDemo').addEventListener('click', () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('registerForm').addEventListener('submit', handleRegister);
document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('tenantForm').addEventListener('submit', handleTenantCreate);
document.getElementById('workflowForm').addEventListener('submit', handleWorkflowCreate);
document.getElementById('acceptTrialBtn').addEventListener('click', () => acceptTrial('growth'));
document.getElementById('logoutBtn').addEventListener('click', logout);

bootstrap();
