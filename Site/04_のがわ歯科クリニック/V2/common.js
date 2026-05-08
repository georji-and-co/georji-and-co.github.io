/* ═══════════════════════════════════════
   鶴ヶ島のがわ歯科 — 共通スクリプト
   Georji & Co.
═══════════════════════════════════════ */

const HOURS = {
  0: {am:['9:20','13:00'], pm:['14:00','17:00']},
  1: {am:['9:20','13:00'], pm:['14:00','18:00']},
  2: {am:['9:20','13:00'], pm:['14:00','18:00']},
  3: null,
  4: {am:['9:20','13:00'], pm:['14:00','18:00']},
  5: {am:['9:20','13:00'], pm:['14:00','18:00']},
  6: {am:['9:20','13:00'], pm:['14:00','17:00']},
};
const DAY_NAMES  = ['日','月','火','水','木','金','土'];
const DAY_LABELS = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];

function timeToMin(t) {
  const [h,m] = t.split(':').map(Number);
  return h * 60 + m;
}
function isOpenNow(hours, nowMin) {
  if (!hours) return false;
  return (nowMin >= timeToMin(hours.am[0]) && nowMin < timeToMin(hours.am[1])) ||
         (nowMin >= timeToMin(hours.pm[0]) && nowMin < timeToMin(hours.pm[1]));
}
function getNextOpen(hours, nowMin) {
  if (!hours) return null;
  if (nowMin < timeToMin(hours.am[0])) return hours.am[0];
  if (nowMin < timeToMin(hours.pm[0])) return hours.pm[0];
  return null;
}

function initStatus() {
  function update() {
    const now    = new Date();
    const dow    = now.getDay();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const hours  = HOURS[dow];
    const dot    = document.getElementById('statusDot');
    const text   = document.getElementById('statusText');
    const time   = document.getElementById('statusTime');
    if (!dot) return;
    if (!hours) {
      dot.classList.add('closed');
      text.textContent = '本日休診';
      time.textContent = '';
    } else if (isOpenNow(hours, nowMin)) {
      dot.classList.remove('closed');
      text.textContent = '診療中';
      time.textContent = nowMin < timeToMin(hours.am[1]) ? `${hours.am[1]}まで` : `${hours.pm[1]}まで`;
    } else {
      dot.classList.add('closed');
      const next = getNextOpen(hours, nowMin);
      text.textContent = next ? `${next}から診療` : '本日の診療終了';
      time.textContent = '';
    }
  }
  update();
  setInterval(update, 60000);
}

function renderTodayHours(labelId, hoursId, statusId) {
  const now    = new Date();
  const dow    = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const hours  = HOURS[dow];
  const lEl = document.getElementById(labelId);
  const hEl = document.getElementById(hoursId);
  const sEl = document.getElementById(statusId);
  if (!lEl) return;
  lEl.textContent = DAY_LABELS[dow];
  if (!hours) {
    hEl.textContent = '休診日';
    sEl.textContent = '本日はお休みをいただいております。';
  } else {
    hEl.textContent = `${hours.am[0]}〜${hours.am[1]} / ${hours.pm[0]}〜${hours.pm[1]}`;
    sEl.textContent = isOpenNow(hours, nowMin) ? '現在診療中です。' : `午前: ${hours.am[0]}〜${hours.am[1]}　午後: ${hours.pm[0]}〜${hours.pm[1]}`;
  }
}

function renderHoursGrid(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const todayDow = new Date().getDay();
  grid.innerHTML = [1,2,3,4,5,6,0].map(d => {
    const h = HOURS[d];
    const isToday = d === todayDow;
    const timeStr = h ? `${h.am[0]}〜${h.am[1]} / ${h.pm[0]}〜${h.pm[1]}` : '休診';
    return `<div class="hours-row${isToday?' highlight':''}${!h?' closed':''}">
      <div class="hours-day">${isToday?'▶ ':''}${DAY_NAMES[d]}曜日</div>
      <div class="hours-time">${timeStr}</div>
    </div>`;
  }).join('');
}

function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

function setActiveNav(currentPage) {
  document.querySelectorAll('.header-nav a, .bottom-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith(currentPage)) a.classList.add('active');
  });
}
