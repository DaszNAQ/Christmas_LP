function initScrollReveal() {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (motionQuery.matches || !("IntersectionObserver" in window)) {
    return;
  }

  const selectors = [
    ".countdown .section-heading",
    ".countdown_item",
    ".countdown_message",
    ".wishes .section-heading",
    ".wish-studio_form-wrapper",
    ".wish-preview_card",
    ".gallery .section-heading",
    ".gallery-card"
  ];

  const elements = Array.from(
    document.querySelectorAll(selectors.join(", "))
  ).filter((element) => element.dataset.revealInitialized !== "true");

  if (!elements.length) return;

  elements.forEach((element, index) => {
    element.dataset.revealInitialized = "true";
    element.classList.add("reveal_item");

    element.style.setProperty(
      "--reveal-delay",
      `${(index % 4) * 90}ms`
    );
  });

  let remaining = elements.length;
  let observer;

  function handleMotionChange() {
    if (!motionQuery.matches) return;

    observer.disconnect();

    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    motionQuery.removeEventListener("change", handleMotionChange);
  }

  observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      activeObserver.unobserve(entry.target);
      remaining--;
    });

    if (remaining === 0) {
      activeObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
    }
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach((element) => {
    observer.observe(element);
  });

  motionQuery.addEventListener("change", handleMotionChange);
}