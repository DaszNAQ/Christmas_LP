function initGallery() {
  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("gallery-modal");
  const closeButton = document.getElementById("gallery-modal-close");
  const modalImage = document.getElementById("gallery-modal-image");
  const modalCaption = document.getElementById("gallery-modal-caption");

  if (!gallery || !modal || !closeButton || !modalImage || !modalCaption) {
    console.warn("[Christmas] Gallery elements not found.");
    return;
  }

  if (gallery.dataset.initialized === "true") return;

  if (typeof modal.showModal !== "function") {
    console.warn("[Christmas] Dialog API is not supported.");
    return;
  }

  gallery.dataset.initialized = "true";

  let previousOverflow = "";
  let activeTrigger = null;

  function openGallery(button) {
    const imageSrc = button.dataset.fullSrc;
    const caption = button.dataset.caption || "";
    const thumbnail = button.querySelector("img");

    if (!imageSrc || modal.open) return;

    activeTrigger = button;

    modalImage.src = imageSrc;
    modalImage.alt = thumbnail?.alt || caption;
    modalCaption.textContent = caption;

    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    modal.showModal();
    closeButton.focus();
  }

  function closeGallery() {
    if (modal.open) {
      modal.close();
    }
  }

  function handleGalleryClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest("[data-gallery-open]");

    if (!button || !gallery.contains(button)) return;

    openGallery(button);
  }

  function handleModalClick(event) {
    if (event.target === modal) {
      closeGallery();
    }
  }

  function handleModalClose() {
    document.body.style.overflow = previousOverflow;

    modalImage.removeAttribute("src");
    modalImage.alt = "";
    modalCaption.textContent = "";

    if (activeTrigger?.isConnected) {
      activeTrigger.focus();
    }

    activeTrigger = null;
  }

  gallery.addEventListener("click", handleGalleryClick);
  closeButton.addEventListener("click", closeGallery);
  modal.addEventListener("click", handleModalClick);
  modal.addEventListener("close", handleModalClose);
}