/* common.js - 鶴ヶ島カイロプラクティックセンター */

// ===== DYNAMIC OFFSET =====
function applyOffset() {
  const banner = document.querySelector('.demo-banner');
  const header = document.querySelector('.site-header');
  const bannerH = banner ? banner.offsetHeight : 0;
  const headerH = header ? header.offsetHeight : 0;
  const total = bannerH + headerH;

  // today-bar（index.htmlのみ）
  const todayBar = document.querySelector('.today-bar');
  if (todayBar) {
    todayBar.style.paddingTop = (total + 10) + 'px';
  }

  // 他ページの page-top
  document.querySelectorAll('.page-top').forEach(el => {
    el.style.paddingTop = total + 'px';
  });
}

// ===== CLINIC STATUS =====
const CLINIC_INFO = {
  tel: '049-234-6326',
  hours: {
    // 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
    0: null, // 定休
    1: [{ s: 9, sm: 0, e: 11, em: 30 }, { s: 15, sm: 0, e: 20, em: 30 }],
    2: [{ s: 9, sm: 0, e: 11, em: 30 }, { s: 15, sm: 0, e: 20, em: 30 }],
    3: [{ s: 9, sm: 0, e: 11, em: 30 }, { s: 15, sm: 0, e: 20, em: 30 }],
    4: [{ s: 9, sm: 0, e: 11, em: 30 }, { s: 15, sm: 0, e: 20, em: 30 }],
    5: [{ s: 9, sm: 0, e: 11, em: 30 }, { s: 15, sm: 0, e: 20, em: 30 }],
    6: [{ s: 9, sm: 0, e: 11, em: 30 }, { s: 13, sm: 30, e: 17, em: 0 }],
  },
  dayNames: ['日', '月', '火', '水', '木', '金', '土'],
};

function getClinicStatus() {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();
  const m = now.getMinutes();
  const cur = h + m / 60;

  const todayHours = CLINIC_INFO.hours[day];
  if (!todayHours) return { open: false, label: '本日は定休日', next: null };

  for (const slot of todayHours) {
    const start = slot.s + slot.sm / 60;
    const end = slot.e + slot.em / 60;
    if (cur >= start && cur < end) {
      const endStr = `${slot.e}:${String(slot.em).padStart(2, '0')}`;
      return { open: true, label: `診療中 〜${endStr}まで`, next: null };
    }
  }

  // Find next opening
  for (const slot of todayHours) {
    const start = slot.s + slot.sm / 60;
    if (cur < start) {
      const startStr = `${slot.s}:${String(slot.sm).padStart(2, '0')}`;
      return { open: false, label: `本日 ${startStr}〜 受付`, next: null };
    }
  }

  return { open: false, label: '本日の受付は終了', next: null };
}

function renderStatusChip(el) {
  if (!el) return;
  const status = getClinicStatus();
  el.className = 'status-chip ' + (status.open ? 'open' : 'closed');
  el.textContent = status.label;
}

function renderTodayDetail(el) {
  if (!el) return;
  const now = new Date();
  const day = now.getDay();
  const todayHours = CLINIC_INFO.hours[day];
  const status = getClinicStatus();

  if (!todayHours) {
    el.textContent = '本日（' + CLINIC_INFO.dayNames[day] + '）は定休日です';
    return;
  }

  const slots = todayHours.map(s => `${s.s}:${String(s.sm).padStart(2,'0')}〜${s.e}:${String(s.em).padStart(2,'0')}`).join(' / ');
  el.textContent = `${CLINIC_INFO.dayNames[day]}曜日 ${slots}`;
}

// ===== SCROLL FADE IN =====
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // dynamic offset
  applyOffset();
  window.addEventListener('resize', applyOffset);
  // status chips
  document.querySelectorAll('.js-status-chip').forEach(el => renderStatusChip(el));
  // today detail
  renderTodayDetail(document.getElementById('today-status-detail'));
  // fade in
  initFadeIn();
  // active nav
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav a, .footer-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(path)) a.classList.add('active');
  });
});
