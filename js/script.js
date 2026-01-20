/* =========
  ローディング画面からの遷移（Home想定）
========= */
window.addEventListener('load', () => {//読み込み完了で処理開始
  const loadingAreaGrey = document.querySelector('#loading');
  const loadingText = document.querySelector('#loading p');
  const title = document.querySelector('.hero .title');

  // loading要素が無いなら何もしない
  if (!loadingAreaGrey) return;

  // 最終的に必ず消す関数
  const finishLoading = () => {
    loadingAreaGrey.style.display = 'none';
    // titleがあるページなら表示演出
    if (title) title.classList.add('is-show');
  };

  //アニメが動かなくても3.5秒後に必ず消す
  const fallbackTimer = setTimeout(finishLoading, 3500);

  // Web Animations APIが使える場合だけアニメ
  if (loadingAreaGrey.animate) {
    const anim1 = loadingAreaGrey.animate(
      { opacity: [1, 0] },
      {
        duration: 2000,//2秒で変化
        delay: 1200,//開始までの遅延
        easing: 'ease',//滑らかに変化
        fill: 'forwards'//アニメ終了時opacity0
      }
    );

    // アニメが正常終了したらタイマーを止めて終了処理
    anim1.onfinish = () => {
      clearTimeout(fallbackTimer);
      finishLoading();
    };
  }

  // テキストのアニメ（無くても動作に影響しない）
  if (loadingText && loadingText.animate) {
    loadingText.animate(
      [
        { opacity: 1, offset: 0.8 },
        { opacity: 0, offset: 1 }//0.8地点までは opacity 1。1.0地点で opacity 0
      ],
      {
        duration: 600,
        easing: 'ease',
        fill: 'forwards'
      }
    );
  }
});



/* =========
  ハンバーガーメニュー（全ページ想定）
========= */
(() => {
  const menuBtn = document.getElementById('menuBtn');
  const slideMenu = document.getElementById('slideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
//ハンバーガーのボタン・メニュー本体・暗転オーバーレイを取得

  // どれか欠けていたら初期化しない
  if (!menuBtn || !slideMenu || !menuOverlay) return;

  menuBtn.addEventListener('click', () => {//ボタンを押したらクラスが付与
    slideMenu.classList.add('open');
    menuOverlay.classList.add('show');
  });

  menuOverlay.addEventListener('click', () => {
    slideMenu.classList.remove('open');
    menuOverlay.classList.remove('show');
  });
})();


/* =========
  パスタの歴史（Historyページ想定）
========= */
(() => {
  const historyItems = document.querySelectorAll('.history-item');
  if (!historyItems || historyItems.length === 0) return;

  const observerOptions = {
    root: null,//画面基準
    threshold: 0.2//20%が見えたら発火
  };

  const historyObserver = new IntersectionObserver((entries, observer) => {//監視
    entries.forEach(entry => {
      if (entry.isIntersecting) {//監視対象が見えた場合
        // 段階ディレイ（0.2秒ずつ）
        const index = Array.from(historyItems).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.2}s`;
        //indexは何番目のアイテムかを表す

        entry.target.classList.add('is-show');
        observer.unobserve(entry.target);//1度表示したら監視を解除
      }
    });
  }, observerOptions);

  historyItems.forEach(item => historyObserver.observe(item));//全histry-item監視開始
})();


/* =========
  レシピ画面のモーダル（Recipeページ想定）
========= */
(() => {
  const modal = document.getElementById('recipeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const cards = document.querySelectorAll('.recipe-card');

  // 必要要素が無ければ何もしない
  if (!modal || !modalTitle || !modalText || !modalImage || !modalClose || cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.dataset.title || '';
      modalText.textContent = card.dataset.text || '';
      modalImage.src = card.dataset.image || '';
      modalImage.alt = card.dataset.title || '';
      //クリックされたらdata属性を読み込んでモーダルに反映

      modal.classList.add('show');
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('show');//閉じるボタンでモーダルを閉じる
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {//中身をクリックしても閉じないための文
      modal.classList.remove('show');
    }
  });

  // ESCキーで閉じる（任意だが便利）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('show');
    }
  });
})();


/* =========
  利用規約の同意チェック（Termsページ想定）
========= */
(() => {
  const checkbox = document.getElementById('agreeCheckbox');
  const button = document.getElementById('agreeButton');

  if (!checkbox || !button) return;

  // 初期状態を反映。未チェックならボタン無効
  button.disabled = !checkbox.checked;

  // チェックで切替
  checkbox.addEventListener('change', () => {//チェックの有無でボタン状態切り替え
    button.disabled = !checkbox.checked;
  });

  // 押下時の遷移例：好きなページへ変更
  button.addEventListener('click', () => {
    // 例：Homeへ遷移
    location.href = "Home.html";
  });
})();