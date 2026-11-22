export function initNavigation() {
  const menuButton = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (!menuButton || !navigation) {
    console.warn("Navigation elements could not be found.");
    return;
  }

  if (menuButton.dataset.initialized === "true") return;
  menuButton.dataset.initialized = "true";

  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const navLinks = navigation.querySelectorAll('a[href^="#"]');

  function setMenuState(isOpen, returnFocus = false) {
    const shouldOpen = Boolean(isOpen && mobileQuery.matches);

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
    setMenuState(false);
  }

  function handleOutsideClick(event) {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (
      !isOpen ||
      menuButton.contains(event.target) ||
      navigation.contains(event.target)
    ) {
      return;
    }

    closeMenu();
  }

  function handleKeydown(event) {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isOpen) {
      setMenuState(false, true);
    }
  }

  function handleBreakpointChange() {
    setMenuState(false);
  }

  menuButton.addEventListener("click", toggleMenu);
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleKeydown);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  mobileQuery.addEventListener("change", handleBreakpointChange);

  setMenuState(false);

  return () => {
    menuButton.removeEventListener("click", toggleMenu);
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("keydown", handleKeydown);

    navLinks.forEach((link) => {
      link.removeEventListener("click", closeMenu);
    });

    mobileQuery.removeEventListener("change", handleBreakpointChange);

    delete menuButton.dataset.initialized;
    setMenuState(false);
  };
}
