
export function initScrollReveal() {
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

  const elements = document.querySelectorAll(selectors.join(", "));

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach((element, index) => {
    element.classList.add("reveal_item");
    element.style.setProperty(
      "--reveal-delay",
      `${(index % 4) * 90}ms`
    );

    observer.observe(element);
  });
}
