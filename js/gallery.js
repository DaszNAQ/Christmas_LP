export function initGallery() {
  const galleryButtons = document.querySelectorAll("[data-gallery-open]");
  const modal = document.getElementById("gallery-modal");
  const closeButton = document.getElementById("gallery-modal-close");
  const modalImage = document.getElementById("gallery-modal-image");
  const modalCaption = document.getElementById("gallery-modal-caption");

  if (
    !galleryButtons.length ||
    !modal ||
    !closeButton ||
    !modalImage ||
    !modalCaption
  ) {
    console.warn("Gallery elements could not be found.");
    return;
  }

  if (typeof modal.showModal !== "function") {
    console.warn("Dialog API is not supported by this browser.");
    return;
  }

  let previousOverflow = "";

  function openGallery(button) {
    const imageSrc = button.dataset.fullSrc;
    const caption = button.dataset.caption || "";
    const thumbnail = button.querySelector("img");

    if (!imageSrc) {
      console.warn("Gallery image source is missing.");
      return;
    }

    modalImage.src = imageSrc;
    modalImage.alt = thumbnail?.alt || caption;
    modalCaption.textContent = caption;

    if (!modal.open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      modal.showModal();
    }
  }

  function closeGallery() {
    if (modal.open) {
      modal.close();
    }
  }

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openGallery(button);
    });
  });

  closeButton.addEventListener("click", closeGallery);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeGallery();
    }
  });

  modal.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;

    modalImage.removeAttribute("src");
    modalImage.alt = "";
    modalCaption.textContent = "";
  });
}
