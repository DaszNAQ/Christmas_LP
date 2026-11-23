import { initNavigation } from "./navigation.js";
import { initCountdown } from "./countdown.js";
import { initSnowfall } from "./snowfall.js";
import { initWishGenerator } from "./wish-generator.js";
import { initGallery } from "./gallery.js";
import { initScrollReveal } from "./scroll-reveal.js";

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}