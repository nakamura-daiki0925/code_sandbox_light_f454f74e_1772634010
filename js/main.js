/* =============================================
   1. ローディング制御
============================================= */
// ★修正点：importをやめて、直接画像のURL（文字列）を変数に入れます！
const logoImg = 'images/common/logo-white3.png';

// インポートした変数を使って配列を作る
const BG_IMAGES = [
  'images/hero/hero-bg-gradient.png',
  'images/hero/background-striped.png',
  'images/hero/hero-arc-text.png',
];

// ローディングオーバーレイを作成
function createLoader() {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.style.cssText = `
    position: fixed;
    inset: 0;
    background: #00703C;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.4s ease;
  `;
  
  // ★ imgタグの src に、上の変数がそのまま入ります
  loader.innerHTML = `
    <img src="${logoImg}" alt="" style="width:120px;height:auto;animation:pulse 1.2s ease-in-out infinite;" />
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.95); }
      }
    </style>
  `;
  document.body.appendChild(loader);
  return loader;
}

// 背景画像をプリロード
function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // 失敗しても止めない
          img.src = url;
        })
    )
  );
}

// 初期化（ローディング完了を待つ）
async function initLoading() {
  const loader = createLoader();

  // フォント＋背景画像を並行で待つ
  await Promise.all([
    document.fonts.ready,
    preloadImages(BG_IMAGES),
  ]);

  document.body.classList.add('fonts-loaded');

  // ローダーをフェードアウト
  loader.style.opacity = '0';
  
  setTimeout(() => {
    loader.remove();
    // 幕が開いた瞬間にGOサインを出す！
    document.body.classList.add('is-loaded');
    
    // 全体のJavaScript（アニメーション等）をここから起動する
    startMainScripts(); 
  }, 400);
}


/* =============================================
   2. メインスクリプト（旧 main.js の内容）
   ※ ローディング完了後（GOサイン後）に実行されます
============================================= */
function startMainScripts() {
  console.log("幕が開きました！アニメーション開始！");

  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initEnvLinks(); // URL書き換え処理
}


/* =============================================
   各機能の関数定義
============================================= */

// モバイルメニュー
function initMobileMenu() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  const closeBtn = document.getElementById("menu-close"); // 🌟 ×ボタンを取得
  const lines = document.querySelectorAll(".hamburger-line");

  if (!btn || !menu) return;

  // 🌟 メニューを閉じる処理を1つにまとめる（使い回し用）
  const closeMenu = () => {
    menu.classList.add("translate-x-full");
    btn.classList.remove("open");
    lines.forEach((line) => {
      line.classList.remove("bg-gray-800");
      line.classList.add("bg-white");
    });
  };

  // ハンバーガーボタンを押した時の処理
  btn.addEventListener("click", () => {
    const isClosed = menu.classList.contains("translate-x-full");
    if (isClosed) {
      // 開く
      menu.classList.remove("translate-x-full");
      btn.classList.add("open");
      lines.forEach((line) => {
        line.classList.remove("bg-white");
        line.classList.add("bg-gray-800");
      });
    } else {
      // 閉じる
      closeMenu();
    }
  });

  // 🌟 ×ボタンを押した時に閉じる
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  // リンクを押した時に閉じる
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

// スクロールアニメーション (Reveal)
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "-10% 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

// ナビゲーション現在地ハイライト
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(`header nav a[href="#${currentId}"]`);
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// 環境判定とURL書き換え処理
function initEnvLinks() {
  const currentDomain = window.location.hostname;
  const prodDomain = "ec-kakeibo.ritaen.com";
  const isLocal = currentDomain !== prodDomain;

  const PATHS = {
    top: isLocal ? "index.html" : `https://${prodDomain}/`,
    contact: isLocal ? "contact.html" : `https://${prodDomain}/contact.html`, 
  };


  const contactLinks = document.querySelectorAll(".js-link-contact");
  contactLinks.forEach((link) => { link.href = PATHS.contact; });

  const topLinks = document.querySelectorAll(".js-link-top");
  topLinks.forEach((link) => { link.href = PATHS.top; });
}

/* =============================================
   実行のスタート地点
============================================= */
// DOMの読み込みが終わったら、まずローディングを開始する
document.addEventListener("DOMContentLoaded", initLoading);
