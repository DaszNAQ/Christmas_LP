export function initSnowfall() {
  const container = document.getElementById("snowfall");

  if (!container) {
    console.warn("Snowfall container could not be found.");
    return;
  }

  if (container.dataset.initialized === "true") return;
  container.dataset.initialized = "true";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 767px)");

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createSnowflakes() {
    container.replaceChildren();

    if (motionQuery.matches) return;

    const flakeCount = mobileQuery.matches ? 14 : 28;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < flakeCount; i++) {
      const flake = document.createElement("span");
      const duration = random(12, 24);

      flake.className = "snowfall_flake";
      flake.textContent = "❄";
      flake.setAttribute("aria-hidden", "true");

      flake.style.setProperty("--snow-left", `${random(0, 100)}%`);
      flake.style.setProperty("--snow-size", `${random(8, 18)}px`);
      flake.style.setProperty("--snow-duration", `${duration.toFixed(2)}s`);
      flake.style.setProperty("--snow-delay", `${-random(0, duration).toFixed(2)}s`);
      flake.style.setProperty("--snow-opacity", random(0.3, 0.7).toFixed(2));
      flake.style.setProperty("--snow-drift-mid", `${random(-35, 35).toFixed(2)}px`);
      flake.style.setProperty("--snow-drift-end", `${random(-60, 60).toFixed(2)}px`);

      fragment.appendChild(flake);
    }

    container.appendChild(fragment);
    updateSnowfallState();
  }

  function updateSnowfallState() {
    container.classList.toggle("is-paused", document.hidden);
  }

  function handleMotionChange() {
    createSnowflakes();
  }

  function handleMobileChange() {
    createSnowflakes();
  }

  motionQuery.addEventListener("change", handleMotionChange);
  mobileQuery.addEventListener("change", handleMobileChange);
  document.addEventListener("visibilitychange", updateSnowfallState);

  createSnowflakes();

  return () => {
    motionQuery.removeEventListener("change", handleMotionChange);
    mobileQuery.removeEventListener("change", handleMobileChange);
    document.removeEventListener("visibilitychange", updateSnowfallState);

    container.replaceChildren();
    container.classList.remove("is-paused");
    delete container.dataset.initialized;
  };
}
