
import { initNavigation } from "./navigation.js";
import { initCountdown } from "./countdown.js";
import { initSnowfall } from "./snowfall.js";
import { initWishGenerator } from "./wish-generator.js";
import { initGallery } from "./gallery.js";

function initApp() {
  const modules = [
    ["Navigation", initNavigation],
    ["Countdown", initCountdown],
    ["Snowfall", initSnowfall],
    ["Wish Generator", initWishGenerator],
    ["Gallery", initGallery]
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

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}
