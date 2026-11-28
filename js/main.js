let appInitialized = false;

function initApp() {
  if (appInitialized) return;

  appInitialized = true;

  const modules = [
    ["Navigation", initNavigation],
    ["Countdown", initCountdown],
    ["Snowfall", initSnowfall],
    ["Wish Generator", initWishGenerator],
    ["Gallery", initGallery],
    ["Scroll Reveal", initScrollReveal]
  ];

  modules.forEach(([name, initialize]) => {
    try {
      initialize();
    } catch (error) {
      console.error(`[Christmas] Failed to initialize ${name}:`, error);
    }
  });

  updateCurrentYear();
}

function updateCurrentYear() {
  const yearElement = document.getElementById("current-year");

  if (!yearElement) return;

  const currentYear = String(new Date().getFullYear());

  if (yearElement.textContent !== currentYear) {
    yearElement.textContent = currentYear;
  }
}

function applyConfig() {
  const setText = (selector, text) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = text;
    });
  };

  setText(".logo_text, .footer_logo-text", CONFIG.brand);
  setText(".hero_description", CONFIG.heroMessage);
  setText(".wish-preview_signature", CONFIG.signature);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}