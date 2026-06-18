/* ==================================================
  編集ポイント
  開催日を変更する場合は、下の EVENT_DATE を変更してください。
  形式：YYYY-MM-DDTHH:MM:SS+09:00
  例：2026年9月11日 9:00開始 → "2026-09-11T09:00:00+09:00"
================================================== */
const EVENT_DATE = new Date("2026-09-11T08:30:00+09:00");

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupSmoothScroll();
  setupFaqAccordion();
  setupBackToTop();
  setupCountdown();

  // メイン画像スライダー
  setupHeroSlider();
});


/* ==================================================
  スマホ用ハンバーガーメニュー
================================================== */
function setupMobileMenu() {
  const menuButton = document.querySelector(".menu-button");
  const navList = document.querySelector("#global-nav-list");

  if (!menuButton || !navList) return;

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navList.classList.toggle("is-open", !isOpen);
  });

  // メニュー内リンクを押したらメニューを閉じる
  const navLinks = navList.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      navList.classList.remove("is-open");
    });
  });
}

/* ==================================================
  スムーススクロール
  固定ヘッダーの高さ分だけ位置を調整します。
================================================== */
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      const header = document.querySelector(".site-header");

      if (!targetElement) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: "smooth",
      });

      // URLのハッシュも更新
      history.pushState(null, "", targetId);
    });
  });
}

/* ==================================================
  FAQアコーディオン
================================================== */
function setupFaqAccordion() {
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const faqItem = button.closest(".faq-item");

      if (!faqItem) return;

      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      faqItem.classList.toggle("is-open", !isOpen);
    });
  });
}

/* ==================================================
  ページ上部へ戻るボタン
================================================== */
function setupBackToTop() {
  const backToTopButton = document.querySelector(".back-to-top");

  if (!backToTopButton) return;

  window.addEventListener(
    "scroll",
    () => {
      backToTopButton.classList.toggle("is-show", window.scrollY > 400);
    },
    { passive: true }
  );

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* ==================================================
  開催日までのカウントダウン
================================================== */
function setupCountdown() {
  const messageElement = document.querySelector("#countdown-message");
  const daysElement = document.querySelector("#countdown-days");
  const hoursElement = document.querySelector("#countdown-hours");
  const minutesElement = document.querySelector("#countdown-minutes");
  const secondsElement = document.querySelector("#countdown-seconds");

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

  function updateCountdown() {
    const now = new Date();
    const diff = EVENT_DATE.getTime() - now.getTime();

    // 開催日を過ぎた場合
    if (diff <= 0) {
      if (messageElement) {
        messageElement.textContent = "開催日を迎えました";
      }

      daysElement.textContent = "0";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = Math.floor(totalSeconds % 60);

    daysElement.textContent = String(days);
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
/* ==================================================
  メインビジュアル画像スライダー
  ・自動スライド
  ・左右ボタン
  ・下の丸ボタン
================================================== */
function setupHeroSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  const dotsContainer = slider.querySelector("[data-slider-dots]");

  if (slides.length === 0) return;

  const SLIDE_INTERVAL = 4000; // 画像が切り替わる時間。4000 = 4秒
  let currentIndex = 0;
  let timerId = null;
  const dotButtons = [];

  // 下の丸ボタンを画像の枚数分だけ自動生成
  if (dotsContainer) {
    dotsContainer.innerHTML = "";

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `${index + 1}枚目の画像を表示`);

      dot.addEventListener("click", () => {
        showSlide(index);
        restartAutoSlide();
      });

      dotsContainer.appendChild(dot);
      dotButtons.push(dot);
    });
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dotButtons.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  }

  function showNextSlide() {
    showSlide(currentIndex + 1);
  }

  function showPrevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    if (slides.length <= 1) return;

    stopAutoSlide();
    timerId = setInterval(showNextSlide, SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // 画像が1枚だけならボタン類を非表示
  if (slides.length <= 1) {
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
    if (dotsContainer) dotsContainer.style.display = "none";
    showSlide(0);
    return;
  }

  // 左右ボタン
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showPrevSlide();
      restartAutoSlide();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showNextSlide();
      restartAutoSlide();
    });
  }

  // マウスを乗せている間は自動スライド停止
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  // キーボード操作中も自動スライド停止
  slider.addEventListener("focusin", stopAutoSlide);
  slider.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!slider.contains(document.activeElement)) {
        startAutoSlide();
      }
    }, 0);
  });

  // タブを非表示にしている間は停止
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });

  // 最初の画像を表示
  showSlide(0);

  // 「動きを減らす」設定の人には自動再生しない
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    startAutoSlide();
  }
}
