// ===== テーマ管理 (Tailwind Dark Mode 対応) =====
function applyTheme(theme, animate) {
  const html = document.documentElement;
  const icon = document.getElementById('themeIcon');

  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  if (icon) {
    if (animate) {
      icon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s';
      icon.style.transform = 'rotate(180deg) scale(0.5)';
      icon.style.opacity = '0';
      
      setTimeout(() => {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        icon.style.transform = 'rotate(0deg) scale(1)';
        icon.style.opacity = '1';
      }, 200);
    } else {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem('meitetu_theme', next);
  applyTheme(next, true);
}

// ===== タブ切り替え =====
function switchTab(name) {
  // パネルの表示/非表示
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.add('hidden');
  });
  const activePanel = document.getElementById('panel-' + name);
  if (activePanel) activePanel.classList.remove('hidden');

  // タブボタンの状態
  document.querySelectorAll('.m3-tab').forEach(b => {
    b.classList.remove('active');
  });
  const activeTab = document.getElementById('tab-' + name);
  if (activeTab) activeTab.classList.add('active');

  // スクロールトップ
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // URLハッシュの更新（履歴に残さない）
  history.replaceState(null, null, '#' + name);
}

// ===== 外部リンク警告モーダル =====
function initExtLinks() {
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;

    const isExternal = a.hostname && a.hostname !== window.location.hostname;
    const isNotHash = !href.startsWith('#');
    const isNotTelMail = !href.startsWith('tel:') && !href.startsWith('mailto:');

    if (isExternal && isNotHash && isNotTelMail) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        openExtModal(href);
      });
    }
  });
}

function openExtModal(url) {
  const modal = document.getElementById('extLinkModal');
  const content = document.getElementById('extModalContent');
  const urlSpan = document.getElementById('extLinkUrl');
  const confirmBtn = document.getElementById('extLinkConfirmBtn');
  
  if (modal && urlSpan && confirmBtn) {
    try {
      urlSpan.textContent = new URL(url).hostname;
    } catch(e) {
      urlSpan.textContent = url;
    }
    confirmBtn.href = url;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
      content.classList.remove('scale-95');
      content.classList.add('scale-100');
    }, 10);
  } else {
    if(confirm('外部サイトへ移動します: \n' + url + '\nよろしいですか？')) {
      window.open(url, '_blank', 'noopener');
    }
  }
}

function closeExtModal() {
  const modal = document.getElementById('extLinkModal');
  const content = document.getElementById('extModalContent');
  if (modal && content) {
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 200);
  }
}

// ===== モバイルメニュー =====
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
}

// ===== 初期化 =====
(function init() {
  // テーマの初期設定
  const saved = localStorage.getItem('meitetu_theme');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const prefer = mediaQuery.matches ? 'dark' : 'light';
  applyTheme(saved || prefer, false);

  // OSのテーマ変更をリアルタイム監視
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('meitetu_theme')) {
      applyTheme(e.matches ? 'dark' : 'light', true);
    }
  });

  // 外部リンクのフックを初期化
  initExtLinks();

  // URLハッシュ対応
  const hash = location.hash.replace('#', '');
  const validTabs = ['home', 'profile', 'gadget', 'links'];
  if (validTabs.includes(hash)) {
    switchTab(hash);
  } else {
    switchTab('home');
  }
})();
