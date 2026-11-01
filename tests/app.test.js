body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: #071d30;
  color: #e5eef7;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

img {
  max-width: 100%;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.page-shell {
  min-height: 100vh;
  background: linear-gradient(180deg, #071d30 0%, #0d2943 30%, #f4f8fc 30%, #f4f8fc 100%);
}

.container {
  width: min(1160px, calc(100% - 2rem));
  margin: 0 auto;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(7, 29, 48, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  gap: 1rem;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.brand-wrap strong {
  display: block;
  font-size: 1.1rem;
}

.brand-wrap small {
  display: block;
  color: #a4bbcf;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7ee7d5, #1ca7d4);
  color: #071d30;
  font-weight: 800;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: #dfeaf5;
  text-decoration: none;
  font-size: 0.95rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.language-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dfeaf5;
  font-size: 0.85rem;
}

.language-picker select {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 999px;
  color: white;
  padding: 0.5rem 0.75rem;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.3rem;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #7ee7d5, #3ea9d8);
  color: #071d30;
}

.btn-ghost {
  background: rgba(255,255,255,0.06);
  color: white;
  border: 1px solid rgba(255,255,255,0.15);
}

.hero {
  padding: 4rem 0 2rem;
  color: white;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: center;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14rem;
  font-weight: 700;
  font-size: 0.8rem;
  color: #7ee7d5;
}

.hero-copy h1 {
  font-size: clamp(2.5rem, 4vw, 4.5rem);
  line-height: 1.08;
  margin: 0.4rem 0 1rem;
  max-width: 620px;
}

.lead {
  font-size: 1.08rem;
  line-height: 1.7;
  color: #dbeaf5;
  max-width: 620px;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  margin-top: 2.5rem;
}

.metrics > div {
  min-width: 130px;
}

.metrics strong {
  display: block;
  font-size: 1.5rem;
  color: white;
}

.metrics span {
  color: #b7cfe0;
  font-size: 0.9rem;
}

.hero-panel {
  display: flex;
  justify-content: center;
}

.panel-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 22px 70px rgba(6, 17, 28, 0.35);
  width: min(100%, 420px);
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7ee7d5;
  font-size: 0.82rem;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #7ee7d5;
  box-shadow: 0 0 18px rgba(126, 231, 213, 0.8);
}

.panel-card h3 {
  color: white;
  margin: 1rem 0 1rem;
  font-size: 1.5rem;
}

.panel-card ul {
  margin: 0;
  padding-left: 1.2rem;
  color: #dbeaf5;
  line-height: 1.8;
}

.mini-chart {
  display: flex;
  align-items: end;
  gap: 0.6rem;
  height: 110px;
  margin-top: 1.5rem;
}

.mini-chart span {
  display: block;
  width: 20%;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, #7ee7d5, #1ca7d4);
}

.section {
  padding: 5rem 0;
  background: #f4f8fc;
  color: #10263e;
}

.section-alt {
  background: linear-gradient(180deg, #eef5fa 0%, #edf4fb 100%);
}

.section-heading {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-heading h2 {
  margin: 0.4rem 0;
  font-size: clamp(2rem, 4vw, 3rem);
  color: #10263e;
}

.section-heading p:last-child {
  color: #4f677d;
}

.feature-grid,
.pricing-grid,
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.2rem;
}

.feature-card,
.price-card,
.metric-card,
.form-card,
.panel-card {
  background: white;
  border: 1px solid rgba(16, 38, 62, 0.08);
  border-radius: 20px;
  box-shadow: 0 18px 36px rgba(16, 38, 62, 0.05);
}

.feature-card {
  padding: 1.5rem;
}

.icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(30, 160, 210, 0.08);
  color: #0d2943;
  display: grid;
  place-items: center;
  font-weight: 700;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin: 0 0 0.6rem;
}

.feature-card p {
  margin: 0;
  color: #51677e;
  line-height: 1.7;
}

.pricing-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.price-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-card.featured {
  border-color: rgba(30, 160, 210, 0.25);
  box-shadow: 0 22px 36px rgba(30, 160, 210, 0.08);
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background: rgba(30, 160, 210, 0.1);
  color: #0f4470;
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.price-card h3 {
  margin: 0;
  font-size: 2rem;
}

.price-card p {
  margin: 0;
  color: #51677e;
  line-height: 1.7;
}

.narrow {
  max-width: 900px;
}

.faq-list {
  display: grid;
  gap: 1rem;
}

.faq-item {
  background: white;
  border: 1px solid rgba(16, 38, 62, 0.08);
  border-radius: 16px;
  padding: 1rem 1.2rem;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}

.faq-item p {
  margin: 0.8rem 0 0;
  color: #51677e;
  line-height: 1.7;
}

.contact-grid,
.auth-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.contact-list {
  margin: 1.5rem 0 0;
  padding-left: 1.2rem;
  line-height: 2;
  color: #425772;
}

.form-card {
  padding: 1.5rem;
}

.form-card label {
  display: block;
  margin-bottom: 1rem;
}

.form-card span {
  display: block;
  margin-bottom: 0.45rem;
  color: #334d67;
  font-weight: 600;
}

.form-card input,
.form-card textarea,
.inline-form input {
  width: 100%;
  border: 1px solid rgba(16, 38, 62, 0.15);
  border-radius: 12px;
  padding: 0.85rem 0.9rem;
  background: #f8fbff;
  color: #10263e;
}

.form-card textarea {
  resize: vertical;
} 

.hidden {
  display: none !important;
}

.auth-section {
  background: #eaf4ff;
}

.panel-header,
.tenant-toolbar,
.inline-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.tenant-toolbar {
  margin: 1.2rem 0 1.5rem;
}

.inline-form {
  flex: 1 1 320px;
  justify-content: flex-end;
}

.metrics-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card {
  padding: 1.1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-card span {
  color: #51677e;
  font-size: 0.86rem;
}

.metric-card strong {
  font-size: 2rem;
}

.dashboard-columns {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 1.2rem;
  margin-top: 1.25rem;
}

.list,
.activity-list {
  display: grid;
  gap: 0.8rem;
  margin-top: 1rem;
}

.list li,
.activity-item {
  list-style: none;
  background: #f8fbff;
  border: 1px solid rgba(16, 38, 62, 0.08);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.list strong,
.activity-item strong {
  display: block;
}

.list small,
.activity-item small {
  color: #51677e;
}

.list span {
  color: #0d2943;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06rem;
}

.message {
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
  display: none;
}

.message.success {
  display: block;
  background: rgba(77, 188, 136, 0.12);
  color: #0f5b3f;
}

.message.error {
  display: block;
  background: rgba(224, 89, 89, 0.12);
  color: #8f2430;
}

.site-footer {
  background: #071d30;
  color: white;
  padding: 2rem 0;
}

.footer-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: #dbeaf5;
  text-decoration: none;
}

@media (max-width: 900px) {
  .hero-grid,
  .contact-grid,
  .auth-grid,
  .dashboard-columns,
  .feature-grid,
  .pricing-grid,
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .nav {
    display: none;
  }
}

@media (max-width: 640px) {
  .hero-grid,
  .contact-grid,
  .auth-grid,
  .dashboard-columns,
  .feature-grid,
  .pricing-grid,
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .navbar,
  .nav-actions,
  .tenant-toolbar,
  .inline-form,
  .footer-wrap {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    width: 100%;
  }
}

