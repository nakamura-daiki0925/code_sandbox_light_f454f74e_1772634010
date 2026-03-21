// loading.js

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
    loader.innerHTML = `
      <img src="images/common/logo-white3.png" alt="" style="width:120px;height:auto;animation:pulse 1.2s ease-in-out infinite;" />
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
  
  // メイン処理
  async function init() {
    const loader = createLoader();
  
    // フォント＋背景画像を並行で待つ
    await Promise.all([
      document.fonts.ready,
      preloadImages(BG_IMAGES),
    ]);
  
    // fonts-loadedクラスを付与
    document.body.classList.add('fonts-loaded');
  
 // ローダーをフェードアウト
 loader.style.opacity = '0';
  
 setTimeout(() => {
   loader.remove();
   document.body.classList.add('is-loaded'); // 👈 ここまでは先ほどの通り
   
   // 📢 追加：全体に向けて「loadingComplete」というGOサインを打ち上げる！
   window.dispatchEvent(new Event('loadingComplete')); 
 }, 400);
}
  
  document.addEventListener('DOMContentLoaded', init);
  