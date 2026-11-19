
export function initNavigation() {
  const menuButton = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (!menuButton || !navigation) {
    console.warn("Navigation elements could not be found.");
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const navLinks = navigation.querySelectorAll('a[href^="#"]');

  function setMenuState(isOpen, returnFocus = false) {
    const shouldOpen = isOpen && mobileQuery.matches;

    navigation.classList.toggle("is-open", shouldOpen);
    menuButton.setAttribute("aria-expanded", String(shouldOpen));
    menuButton.setAttribute(
      "aria-label",
      shouldOpen ? "Close navigation menu" : "Open navigation menu"
    );

    if (!shouldOpen && returnFocus) {
      menuButton.focus();
    }
  }

  function toggleMenu() {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  }

  function closeMenu() {
    if (mobileQuery.matches) {
      setMenuState(false);
    }
  }

  menuButton.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (
      !mobileQuery.matches ||
      !isOpen ||
      menuButton.contains(event.target) ||
      navigation.contains(event.target)
    ) {
      return;
    }

    setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isOpen) {
      setMenuState(false, true);
    }
  });

  mobileQuery.addEventListener("change", () => {
    setMenuState(false);
  });

  setMenuState(false);
}
