/* ===========================
   やまだクリニック | common.js
   =========================== */

/* ── ハンバーガーメニュー ── */
const hamburger = document.getElementById('hamburger');
const spMenu    = document.getElementById('spMenu');
if (hamburger && spMenu) {
  hamburger.addEventListener('click', () => spMenu.classList.toggle('open'));
  spMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => spMenu.classList.remove('open'));
  });
}

/* ── 診療ステータス ── */
function getClinicStatus() {
  const now = new Date();
  const day = now.getDay();
  const t   = now.getHours() * 60 + now.getMinutes();
  const AM_S = 9  * 60;
  const AM_E = 12 * 60;
  const LN_E = 15 * 60;
  const PM_E = 18 * 60;
  if (day === 0) return { open: false, lunch: false, label: '本日休診（日曜）' };
  if (day === 3 || day === 6) {
    if (t >= AM_S && t < AM_E) return { open: true,  lunch: false, label: '診療中（午前）' };
    return { open: false, lunch: false, label: '受付終了 / 午後休診' };
  }
  if (t >= AM_S && t < AM_E) return { open: true,  lunch: false, label: '診療中（午前）' };
  if (t >= AM_E && t < LN_E) return { open: false, lunch: true,  label: '休診中' };
  if (t >= LN_E && t < PM_E) return { open: true,  lunch: false, label: '診療中（午後）' };
  return { open: false, lunch: false, label: '受付終了' };
}

const status = getClinicStatus();

/* ステータスチップ */
document.querySelectorAll('.status-chip').forEach(el => {
  el.classList.add(status.open ? 'open' : 'closed');
  el.textContent = status.label;
});

/* ── 昼バー ── */
if (status.lunch) {
  const BAR_H = 44;

  /* バー生成 */
  const bar = document.createElement('div');
  bar.className = 'lunch-bar open';
  bar.innerHTML = `
    <div class="lunch-bar-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    </div>
    <p class="lunch-bar-text">
      <strong>休診中</strong> です &nbsp;／&nbsp; 午後の診療は <strong>15:00〜</strong> 再開します
    </p>
    <span class="lunch-bar-badge">12:00〜15:00</span>
  `;
  document.body.appendChild(bar);

  /*
   * バーの top = デモバナー高さ + ヘッダー高さ（実測）
   * コンテンツ先頭の margin-top にバー高さ分を加算して重なりを防ぐ
   */
  function applyLunchBarPosition() {
    const demoH   = document.querySelector('.demo-banner')?.offsetHeight  || 34;
    const headerH = document.querySelector('.site-header')?.offsetHeight  || 72;
    bar.style.top = (demoH + headerH) + 'px';

    /* 先頭コンテンツを押し下げ */
    const first = document.querySelector('.main-hero, .page-hero');
    if (first) {
      first.style.marginTop = (demoH + headerH + BAR_H) + 'px';
    }

    /* SP メニューも追従 */
    if (spMenu) spMenu.style.top = (demoH + headerH + BAR_H) + 'px';
  }

  applyLunchBarPosition();
  window.addEventListener('resize', applyLunchBarPosition);
}

/* ── フェードイン ── */
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── アクティブボトムナビ ── */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.sp-bottom-nav a').forEach(a => {
  if ((a.getAttribute('href') || '').split('/').pop() === currentPage) a.classList.add('active');
});
