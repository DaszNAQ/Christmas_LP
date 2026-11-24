export function initNavigation() {
  const menuButton = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (!menuButton || !navigation) {
    console.warn("[Christmas] Navigation elements not found.");
    return;
  }

  if (menuButton.dataset.initialized === "true") return;

  menuButton.dataset.initialized = "true";

  const mobileQuery = window.matchMedia("(max-width: 767px)");

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

  function handleNavigationClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest('a[href^="#"]');

    if (link) {
      closeMenu();
    }
  }

  function handleOutsideClick(event) {
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
  }

  function handleKeydown(event) {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isOpen) {
      setMenuState(false, true);
    }
  }

  menuButton.addEventListener("click", toggleMenu);
  navigation.addEventListener("click", handleNavigationClick);
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleKeydown);

  mobileQuery.addEventListener("change", () => {
    setMenuState(false);
  });

  setMenuState(false);
}