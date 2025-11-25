<template>
  <div class="landing">
    <div class="glow glow-one"></div>
    <div class="glow glow-two"></div>
    <header class="navbar">
      <div class="brand">
        <div class="brand-mark">MW</div>
        <div class="brand-name">
          <span class="brand-title">Mini Web Cloud</span>
          <span class="brand-tagline">Xưởng sản phẩm web theo yêu cầu</span>
        </div>
      </div>
      <div class="nav-actions">
        <a class="ghost-btn" href="mailto:hello@miniweb.cloud">hello@miniweb.cloud</a>
        <router-link class="primary-btn" to="/login">Đăng nhập</router-link>
      </div>
    </header>

    <main class="content">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Studio sản phẩm nhanh và tinh gọn</p>
          <h1>Biến ý tưởng web thành sản phẩm thực tế trong 4 tuần</h1>
          <p class="lead">
            Đội ngũ Mini Web Cloud chuyên xây dựng ứng dụng web hiện đại, triển khai cloud,
            tối ưu trải nghiệm và hiệu năng cho doanh nghiệp vừa và nhỏ.
          </p>
          <div class="cta-group">
            <a class="primary-btn large" href="https://miniweb.cloud" target="_blank" rel="noreferrer">
              Xem portfolio
            </a>
            <a class="ghost-btn large" href="https://cal.com" target="_blank" rel="noreferrer">
              Đặt lịch tư vấn 30'
            </a>
          </div>
          <div class="trust">
            <div>
              <strong>120+</strong>
              <span>phiên bản MVP ra mắt</span>
            </div>
            <div>
              <strong>99.9%</strong>
              <span>uptime trên hạ tầng cloud</span>
            </div>
            <div>
              <strong>4 tuần</strong>
              <span>chu kỳ từ ý tưởng đến release</span>
            </div>
          </div>
        </div>
        <div class="hero-card">
          <div class="card-header">
            <span>Gói tăng trưởng</span>
            <span class="dot"></span>
            <span>Launch nhanh</span>
          </div>
          <h3>Kiến trúc cloud-ready, sẵn sàng scale</h3>
          <ul>
            <li>Thiết kế UI đậm cá tính, responsive chuẩn</li>
            <li>Backend API bảo mật, logging & monitoring đầy đủ</li>
            <li>Tự động CI/CD lên AWS, Azure hoặc Vercel</li>
            <li>Hỗ trợ tối ưu chuyển đổi và A/B testing</li>
          </ul>
          <div class="mini-metrics">
            <div>
              <span class="label">Thời gian onboard</span>
              <span class="value">3 ngày</span>
            </div>
            <div>
              <span class="label">Team core</span>
              <span class="value">PM + Dev + UI</span>
            </div>
            <div>
              <span class="label">Bảo hành</span>
              <span class="value">60 ngày</span>
            </div>
          </div>
        </div>
      </section>

      <section class="grid">
        <div class="grid-card">
          <p class="eyebrow">Chiến lược</p>
          <h3>Khám phá nhanh, đóng gói phạm vi rõ ràng</h3>
          <p>
            Workshop 90 phút để chốt chân dung người dùng, luồng giá trị và KPI.
            Mỗi sprint đều có demo, số liệu và checklist nghiệm thu minh bạch.
          </p>
        </div>
        <div class="grid-card">
          <p class="eyebrow">Thiết kế</p>
          <h3>UI/UX độc đáo, khác biệt thương hiệu</h3>
          <p>
            Ưu tiên trải nghiệm rõ ràng, tương tác tinh tế và không chạy theo template đại trà.
            Thiết kế được kiểm thử trên cả desktop lẫn mobile.
          </p>
        </div>
        <div class="grid-card">
          <p class="eyebrow">Công nghệ</p>
          <h3>Stack hiện đại và kiểm thử tự động</h3>
          <p>
            Vue/React/NextJS cho frontend, Node/Python/Go cho backend.
            Kèm theo CI/CD, test cơ bản và giám sát hiệu năng ngay từ ngày đầu.
          </p>
        </div>
      </section>

      <section class="process">
        <div class="section-header">
          <p class="eyebrow">Quy trình</p>
          <h2>Đi thẳng vào sản phẩm, không vòng vo</h2>
          <p>Chúng tôi làm việc theo nhịp rõ ràng để bạn nắm được tiến độ từng tuần.</p>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-number">01</div>
            <h4>Discovery Call</h4>
            <p>Hiểu mục tiêu kinh doanh, bản đồ chức năng và chọn công nghệ phù hợp.</p>
          </div>
          <div class="step">
            <div class="step-number">02</div>
            <h4>Prototype & UI</h4>
            <p>Ra prototype tương tác, hoàn thiện UI, chốt phạm vi cho phiên bản đầu.</p>
          </div>
          <div class="step">
            <div class="step-number">03</div>
            <h4>Build & Launch</h4>
            <p>Phát triển, kiểm thử, triển khai cloud và bàn giao hướng dẫn vận hành.</p>
          </div>
          <div class="step">
            <div class="step-number">04</div>
            <h4>Tối ưu & Scale</h4>
            <p>Đo lường, A/B testing, cải thiện hiệu năng, thêm tính năng theo nhu cầu.</p>
          </div>
        </div>
      </section>

      <section class="cta-band">
        <div class="cta-text">
          <p class="eyebrow">Ready to build?</p>
          <h2>Book lịch, nhận proposal trong 48h</h2>
          <p>
            Chia sẻ bài toán của bạn, Mini Web Cloud sẽ gửi lộ trình, ước tính thời gian
            và bảng giá minh bạch cho từng giai đoạn.
          </p>
        </div>
        <div class="cta-buttons">
          <a class="primary-btn" href="mailto:hello@miniweb.cloud">Gửi brief</a>
          <router-link class="ghost-btn" to="/login">Xem demo sản phẩm</router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap");

.landing {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(120% 120% at 20% 20%, #0ea5e9 0%, transparent 45%),
    radial-gradient(100% 100% at 80% 0%, #f97316 0%, transparent 40%),
    #0b1224;
  color: #e5e7eb;
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
  background: rgba(11, 18, 36, 0.75);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
  background: linear-gradient(135deg, #0ea5e9, #f97316);
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
  color: #f8fafc;
}

.brand-tagline {
  font-size: 13px;
  color: #a5b4fc;
  letter-spacing: 0.2px;
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
  color: #f8fafc;
}

.lead {
  font-size: 18px;
  color: #cbd5e1;
  max-width: 640px;
  margin-bottom: 24px;
}

.eyebrow {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
  color: #a5b4fc;
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
  background: linear-gradient(135deg, #0ea5e9, #f97316);
  color: #0b1224;
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.35);
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 36px rgba(14, 165, 233, 0.4);
}

.ghost-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.06);
}

.ghost-btn:hover {
  border-color: rgba(255, 255, 255, 0.35);
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
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.trust span {
  color: #cbd5e1;
  font-size: 14px;
}

.hero-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.card-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.12);
  color: #7dd3fc;
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
  color: #f8fafc;
  font-size: 22px;
}

.hero-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  display: grid;
  gap: 8px;
  color: #cbd5e1;
}

.hero-card li::before {
  content: "•";
  color: #f97316;
  margin-right: 8px;
}

.mini-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.mini-metrics .label {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.mini-metrics .value {
  display: block;
  color: #f8fafc;
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
  color: #e2e8f0;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.grid-card h3 {
  color: #f8fafc;
  margin: 6px 0 8px;
  font-size: 20px;
}

.grid-card p {
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
}

.grid-card:hover {
  transform: translateY(-4px);
  border-color: rgba(14, 165, 233, 0.5);
  background: rgba(255, 255, 255, 0.06);
}

.process {
  margin: 36px 0 64px;
}

.section-header h2 {
  color: #f8fafc;
  margin: 6px 0 8px;
  font-size: 28px;
}

.section-header p {
  color: #cbd5e1;
  margin: 0;
}

.steps {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.step {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.18s ease, transform 0.18s ease;
}

.step-number {
  font-family: "Space Grotesk", sans-serif;
  color: #f97316;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.step h4 {
  color: #f8fafc;
  margin: 0 0 6px;
  font-size: 18px;
}

.step p {
  color: #cbd5e1;
  margin: 0;
}

.step:hover {
  border-color: rgba(14, 165, 233, 0.45);
  transform: translateY(-3px);
}

.cta-band {
  margin-top: 40px;
  padding: 24px;
  border-radius: 18px;
  background: linear-gradient(120deg, rgba(14, 165, 233, 0.2), rgba(249, 115, 22, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: center;
}

.cta-text h2 {
  color: #0b1224;
  font-family: "Space Grotesk", "Manrope", sans-serif;
  margin: 6px 0;
}

.cta-text p {
  color: #0b1224;
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
  background: #0b1224;
  color: #f8fafc;
}

.cta-band .ghost-btn {
  border-color: rgba(11, 18, 36, 0.3);
  color: #0b1224;
  background: rgba(255, 255, 255, 0.5);
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
}
</style>
