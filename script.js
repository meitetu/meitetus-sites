// ===== テーマ =====
function applyTheme(theme, animate) {
  const icon = document.getElementById('themeIcon');

  if (animate && icon) {
    icon.style.transform = 'rotate(360deg) scale(0.5)';
    icon.style.opacity   = '0';
    setTimeout(() => {
      icon.style.transition = 'none';
      icon.style.transform  = 'rotate(-360deg) scale(0.5)';
      document.documentElement.setAttribute('data-theme', theme);
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      requestAnimationFrame(() => {
        icon.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
        icon.style.transform  = 'rotate(0deg) scale(1)';
        icon.style.opacity    = '1';
      });
    }, 200);
  } else {
    document.documentElement.setAttribute('data-theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('meitetu_theme', next);
  applyTheme(next, true);
}

// ===== タブ切り替え =====
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  const btn   = document.getElementById('tab-'   + name);
  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 外部リンク警告モーダル =====
function initExtLinks() {
  document.querySelectorAll('a').forEach(a => {
    // リンクが # から始まる内部リンクではなく、ホスト名が自分と違う場合
    if (a.hostname && a.hostname !== window.location.hostname && !a.getAttribute('href').startsWith('#')) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('href');
        openExtModal(url);
      });
    }
  });
}

function openExtModal(url) {
  const modal = document.getElementById('extLinkModal');
  const urlSpan = document.getElementById('extLinkUrl');
  const confirmBtn = document.getElementById('extLinkConfirmBtn');
  
  if (modal && urlSpan && confirmBtn) {
    try {
      urlSpan.textContent = new URL(url).hostname;
    } catch(e) {
      urlSpan.textContent = url;
    }
    confirmBtn.href = url;
    modal.classList.add('active');
  } else {
    // 404ページなどモーダルがない場合のフォールバック
    if(confirm('外部サイトへ移動します: \n' + url + '\nよろしいですか？')) {
      window.open(url, '_blank', 'noopener');
    }
  }
}

function closeExtModal() {
  const modal = document.getElementById('extLinkModal');
  if (modal) modal.classList.remove('active');
}

// ===== モバイルメニュー =====
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ===== 初期化 =====
(function init() {
  // テーマの初期設定
  const saved  = localStorage.getItem('meitetu_theme');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const prefer = mediaQuery.matches ? 'dark' : 'light';
  applyTheme(saved || prefer, false);

  // OSのテーマ変更をリアルタイム監視
  mediaQuery.addEventListener('change', (e) => {
    // ユーザーが手動で設定を上書きしていない場合のみ、OSに連動する
    if (!localStorage.getItem('meitetu_theme')) {
      applyTheme(e.matches ? 'dark' : 'light', true);
    }
  });

  // 外部リンクのフックを初期化
  initExtLinks();

  // URLハッシュ対応
  const hash = location.hash.replace('#', '');
  if (['home', 'profile', 'gadget', 'links'].includes(hash)) switchTab(hash);
})();
