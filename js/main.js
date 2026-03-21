(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initScrollReveal();
    initActiveNav(); // ★これがないとナビの太字/下線変化は動きません
  });

  /* ---------------------------------------------
     1. モバイルメニューの開閉
  --------------------------------------------- */
  function initMobileMenu() {
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");
    const lines = document.querySelectorAll(".hamburger-line");

    if (!btn || !menu) return;

    // 開閉切り替え
    btn.addEventListener("click", () => {
      // hiddenクラスの有無などをチェックするより、クラスの付け外しで管理
      const isClosed = menu.classList.contains("translate-x-full");

      if (isClosed) {
        // 開く処理
        menu.classList.remove("translate-x-full");
        btn.classList.add("open"); // CSSで×印にする

        // 背景が白くなるので、ハンバーガー線を黒にする
        lines.forEach((line) => {
          line.classList.remove("bg-white");
          line.classList.add("bg-gray-800");
        });
      } else {
        // 閉じる処理
        menu.classList.add("translate-x-full");
        btn.classList.remove("open");

        // 背景が戻るので、ハンバーガー線を白に戻す
        lines.forEach((line) => {
          line.classList.remove("bg-gray-800");
          line.classList.add("bg-white");
        });
      }
    });

    // リンククリックで閉じる
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.add("translate-x-full");
        btn.classList.remove("open");

        // 白に戻す
        lines.forEach((line) => {
          line.classList.remove("bg-gray-800");
          line.classList.add("bg-white");
        });
      });
    });
  }

  /* ---------------------------------------------
     2. スクロール時のフワッと表示 (Reveal)
  --------------------------------------------- */
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

  /* ---------------------------------------------
     3. ナビゲーションの現在地ハイライト (必須)
  --------------------------------------------- */
  function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;

            // すべてのリンクからactiveを外す
            navLinks.forEach((link) => {
              link.classList.remove("active");
              // CSSではなくTailwindクラスで制御したい場合はここも変更
              // link.classList.remove("font-black");
              // link.classList.add("font-bold");
            });

            // 該当するリンクにactiveをつける
            const activeLink = document.querySelector(
              `header nav a[href="#${currentId}"]`
            );
            if (activeLink) {
              activeLink.classList.add("active");
              // activeLink.classList.add("font-black");
            }
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px", // 画面の真ん中に来たセクションを検知
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();

/* =============================================
   URL Path Management
============================================= */
const PATHS = {
  URLS: {
    // ここでURLを一元管理
    contact: "contact.html", // 本番環境なら 'https://ec-kakeibo.ritaen.com/contact'
    top: "index.html",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  /* =============================================
     0. 環境判定とURL設定 (修正版)
  ============================================= */
  // 「本番ドメインかどうか」で判定する (これ以外はすべてローカル扱いにする)
  const currentDomain = window.location.hostname;
  const prodDomain = "ec-kakeibo.ritaen.com"; // 本番ドメイン

  // 現在のドメインが本番と一致しなければ「ローカル」とみなす
  const isLocal = currentDomain !== prodDomain;

  console.log(
    "現在の環境:",
    isLocal ? "開発中(contact.htmlへ)" : "本番(URLへ)"
  );

  // リンク先の定義
  const PATHS = {
    // ローカルならファイル名、本番なら絶対パスURL
    top: isLocal ? "index.html" : `https://${prodDomain}/`,
    contact: isLocal ? "contact.html" : `https://${prodDomain}/contact`,
  };

  /* =============================================
     1. リンクの書き換え処理
  ============================================= */

  // お問い合わせボタン (.js-link-contact クラスがついているもの)
  const contactLinks = document.querySelectorAll(".js-link-contact");
  contactLinks.forEach((link) => {
    link.href = PATHS.contact;
  });

  // トップへ戻るリンク (.js-link-top クラスがついているもの)
  const topLinks = document.querySelectorAll(".js-link-top");
  topLinks.forEach((link) => {
    link.href = PATHS.top;
  });

  // ... 以下、その他の機能 ...
  if (typeof initMobileMenu === "function") initMobileMenu();
  if (typeof initScrollReveal === "function") initScrollReveal();
  if (typeof initActiveNav === "function") initActiveNav();
  if (typeof initSmoothScroll === "function") initSmoothScroll();
});

