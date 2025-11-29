<template>
  <div class="landing">
    <div class="glow glow-one"></div>
    <div class="glow glow-two"></div>
    <header class="navbar">
      <div class="brand">
        <div class="brand-mark">MW</div>
        <div class="brand-name">
          <span class="brand-title">Mini Web</span>
          <span class="brand-tagline">Xây sản phẩm web theo yêu cầu</span>
        </div>
      </div>
      <nav class="nav-links">
        <a
          href="#"
          :class="{ active: currentSection === 'overview' }"
          @click.prevent="switchSection('overview')"
          >Tổng quan</a
        >
        <a
          href="#"
          :class="{ active: currentSection === 'services' }"
          @click.prevent="switchSection('services')"
          >Dịch vụ</a
        >
        <a
          href="#"
          :class="{ active: currentSection === 'process' }"
          @click.prevent="switchSection('process')"
          >Quy trình</a
        >
        <a
          href="#"
          :class="{ active: currentSection === 'products' }"
          @click.prevent="switchSection('products')"
          >Sản phẩm</a
        >
        <a
          href="#"
          :class="{ active: currentSection === 'customers' }"
          @click.prevent="switchSection('customers')"
          >Khách hàng</a
        >
        <a
          href="#"
          :class="{ active: currentSection === 'contact' }"
          @click.prevent="switchSection('contact')"
          >Liên hệ</a
        >
      </nav>
      <div class="nav-actions">
        <a class="ghost-btn" href="mailto:hello@miniweb.cloud"
          >hello@miniweb.cloud</a
        >
        <router-link class="primary-btn" to="/login">Đăng nhập</router-link>
      </div>
    </header>

    <main class="content">
      <transition name="fade-slide" mode="out-in">
        <component :is="sectionComponent" :key="currentSection" />
      </transition>
    </main>
    <footer class="footer">
      <div class="footer-left">
        <div class="brand-mark small">MW</div>
        <div>
          <div class="footer-title">Mini Web</div>
          <div class="footer-sub">Xây sản phẩm web theo yêu cầu</div>
        </div>
      </div>
      <div class="footer-right">
        <div class="footer-founder">Contact: <strong>ABCD</strong></div>
        <div class="footer-contact">Phone: +84 902xxxxx</div>
        <div class="footer-contact">Email: hello@miniweb.cloud</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import MiniOverview from "../components/miniweb/MiniOverview.vue";
import MiniServices from "../components/miniweb/MiniServices.vue";
import MiniProcess from "../components/miniweb/MiniProcess.vue";
import MiniProducts from "../components/miniweb/MiniProducts.vue";
import MiniCustomers from "../components/miniweb/MiniCustomers.vue";
import MiniContact from "../components/miniweb/MiniContact.vue";

const currentSection = ref<
  "overview" | "services" | "process" | "products" | "customers" | "contact"
>("overview");

const sectionComponent = computed(() => {
  return {
    overview: MiniOverview,
    services: MiniServices,
    process: MiniProcess,
    products: MiniProducts,
    customers: MiniCustomers,
    contact: MiniContact,
  }[currentSection.value];
});

function switchSection(section: typeof currentSection.value) {
  currentSection.value = section;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap");

.landing {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(
      120% 120% at 20% 20%,
      rgba(14, 165, 233, 0.35) 0%,
      transparent 45%
    ),
    radial-gradient(
      100% 100% at 80% 0%,
      rgba(59, 130, 246, 0.35) 0%,
      transparent 40%
    ),
    linear-gradient(180deg, #f5f9ff 0%, #e7f1ff 30%, #f7fbff 100%);
  color: #0f172a;
  overflow: hidden;
  font-family: "Manrope", "Space Grotesk", system-ui, -apple-system, sans-serif;
}

.glow {
  position: absolute;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}

.glow-one {
  width: 320px;
  height: 320px;
  background: #22d3ee;
  top: 8%;
  left: -8%;
}

.glow-two {
  width: 360px;
  height: 360px;
  background: #fb923c;
  bottom: -10%;
  right: -6%;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 64px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0ea5e9, #60a5fa);
  color: #0b1224;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.brand-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.brand-tagline {
  font-size: 13px;
  color: #1d4ed8;
  letter-spacing: 0.2px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  font-weight: 600;
  color: #0f172a;
}

.nav-links a {
  color: inherit;
  text-decoration: none;
  padding: 8px 0;
  position: relative;
}

.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 2px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  opacity: 1;
  transform: translateY(0);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  position: relative;
  z-index: 1;
  padding: 48px 64px 80px;
  flex: 1;
}

.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: center;
  margin-top: 20px;
}

.hero-copy h1 {
  font-family: "Space Grotesk", "Manrope", sans-serif;
  font-size: 48px;
  line-height: 1.15;
  margin: 12px 0 16px;
  color: #0f172a;
}

.lead {
  font-size: 18px;
  color: #1e293b;
  max-width: 640px;
  margin-bottom: 24px;
}

.eyebrow {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
  color: #1d4ed8;
  margin-bottom: 8px;
  font-weight: 700;
}

.cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.primary-btn,
.ghost-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease,
    color 0.18s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #f8fafc;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25);
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 36px rgba(14, 165, 233, 0.3);
}

.ghost-btn {
  border: 1px solid rgba(37, 99, 235, 0.35);
  color: #0f172a;
  background: rgba(255, 255, 255, 0.7);
}

.ghost-btn:hover {
  border-color: rgba(37, 99, 235, 0.55);
  transform: translateY(-1px);
}

.primary-btn.large,
.ghost-btn.large {
  padding: 12px 18px;
  font-size: 15px;
}

.trust {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.trust strong {
  display: block;
  font-size: 26px;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.trust span {
  color: #1e293b;
  font-size: 14px;
}

.hero-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(37, 99, 235, 0.12);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
  backdrop-filter: blur(10px);
  color: #0f172a;
  animation: floatIn 0.6s ease;
}

.card-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  font-weight: 700;
  font-size: 13px;
}

.card-header .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f97316;
}

.hero-card h3 {
  margin: 14px 0 10px;
  color: #0f172a;
  font-size: 22px;
}

.hero-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  display: grid;
  gap: 8px;
  color: #1e293b;
}

.hero-card li::before {
  content: "•";
  color: #2563eb;
  margin-right: 8px;
}

.mini-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.mini-metrics .label {
  font-size: 12px;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.mini-metrics .value {
  display: block;
  color: #0f172a;
  font-weight: 700;
  margin-top: 4px;
}

.grid {
  margin: 64px 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.grid-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(37, 99, 235, 0.12);
  border-radius: 14px;
  padding: 18px;
  color: #0f172a;
  transition: transform 0.18s ease, border-color 0.18s ease,
    background 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.grid-card h3 {
  color: #0f172a;
  margin: 6px 0 8px;
  font-size: 20px;
}

.grid-card p {
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
}

.grid-card:hover {
  transform: translateY(-4px);
  border-color: rgba(37, 99, 235, 0.4);
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(14, 165, 233, 0.18);
}

.process {
  margin: 36px 0 64px;
}

.section-header h2 {
  color: #0f172a;
  margin: 6px 0 8px;
  font-size: 28px;
}

.section-header p {
  color: #1e293b;
  margin: 0;
}

.process-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  position: relative;
}

.process-grid::before {
  content: "";
  position: absolute;
  inset: 20px;
  background: linear-gradient(
    135deg,
    rgba(14, 165, 233, 0.12),
    rgba(37, 99, 235, 0.08)
  );
  filter: blur(50px);
  z-index: 0;
  pointer-events: none;
}

.step-card {
  position: relative;
  padding: 18px 16px 16px;
  border-radius: 16px;
  border: 1px solid rgba(37, 99, 235, 0.14);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.96) 0%,
    rgba(244, 248, 255, 0.96) 100%
  );
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  overflow: hidden;
  animation: floatIn 0.6s ease;
  z-index: 1;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.step-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(37, 99, 235, 0.12),
    rgba(14, 165, 233, 0.12)
  );
  opacity: 0;
  transition: opacity 0.2s ease;
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(14, 165, 233, 0.22);
  border-color: rgba(37, 99, 235, 0.3);
}

.step-card:hover::after {
  opacity: 1;
}

.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #f8fafc;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.step-body h4 {
  color: #0f172a;
  margin: 4px 0 6px;
  font-size: 18px;
}

.step-body p {
  color: #1e293b;
  margin: 0;
}

.step-tag {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.cta-band {
  margin-top: 40px;
  padding: 24px;
  border-radius: 18px;
  background: linear-gradient(
    120deg,
    rgba(14, 165, 233, 0.15),
    rgba(37, 99, 235, 0.18)
  );
  border: 1px solid rgba(37, 99, 235, 0.2);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: center;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
}

.cta-text h2 {
  color: #0f172a;
  font-family: "Space Grotesk", "Manrope", sans-serif;
  margin: 6px 0;
}

.cta-text p {
  color: #0f172a;
  margin: 0;
}

.cta-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.cta-band .primary-btn {
  box-shadow: none;
  background: #0f172a;
  color: #f8fafc;
}

.cta-band .ghost-btn {
  border-color: rgba(15, 23, 42, 0.2);
  color: #0f172a;
  background: rgba(255, 255, 255, 0.7);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.showcase {
  margin: 48px 0;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.showcase-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(37, 99, 235, 0.14);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: floatIn 0.6s ease;
}

.pill {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.customers {
  margin: 48px 0;
}

.customers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.testimonial {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: floatIn 0.6s ease;
}

.quote {
  margin: 0;
  color: #0f172a;
  font-weight: 600;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #475569;
  font-size: 13px;
}

.name {
  font-weight: 700;
  color: #0f172a;
}

.showcase-card:hover,
.testimonial:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(14, 165, 233, 0.2);
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 64px 32px;
  color: #0f172a;
  gap: 12px;
  margin-top: auto;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark.small {
  width: 36px;
  height: 36px;
  font-size: 14px;
}

.footer-title {
  font-weight: 700;
}

.footer-sub {
  font-size: 13px;
  color: #1e293b;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  text-align: right;
}

.footer-contact {
  color: #0f172a;
}

@media (max-width: 1024px) {
  .navbar,
  .content {
    padding: 20px;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .cta-band {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .nav-links {
    width: 100%;
    flex-wrap: wrap;
    gap: 12px;
  }

  .hero-copy h1 {
    font-size: 36px;
  }

  .nav-actions {
    width: 100%;
  }

  .nav-actions a {
    width: 100%;
    justify-content: center;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .footer {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
}
</style>
