export function initWishGenerator() {
  const form = document.getElementById("wish-form");
  const recipientInput = document.getElementById("wish-recipient");
  const nameInput = document.getElementById("wish-name");
  const moodInput = document.getElementById("wish-mood");

  const recipientPreview = document.getElementById("wish-recipient-preview");
  const messagePreview = document.getElementById("wish-message");
  const outputElement = document.getElementById("wish-output");
  const feedbackElement = document.getElementById("wish-feedback");

  const copyButton = document.getElementById("wish-copy");
  const shareButton = document.getElementById("wish-share");

  if (
    !form ||
    !recipientInput ||
    !nameInput ||
    !moodInput ||
    !recipientPreview ||
    !messagePreview ||
    !outputElement ||
    !feedbackElement ||
    !copyButton ||
    !shareButton ||
    !outputElement.querySelector(".wish-preview_title")
  ) {
    console.warn("Wish Generator elements could not be found.");
    return;
  }

  if (form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  let currentWish = "";
  let isActionInProgress = false;
  let hasGeneratedWish = false;

  const wishMessages = {
    family: {
      warm: "May your home be filled with warmth, laughter, and the comfort of being together. Wishing you a peaceful Christmas surrounded by love and beautiful memories.",
      festive: "May your Christmas be filled with joyful celebrations, wonderful surprises, and unforgettable moments. Wishing our family a season full of happiness!",
      heartfelt: "No gift could ever be more precious than the love we share. Thank you for making every moment meaningful. Wishing you a Christmas filled with peace, love, and endless blessings."
    },
    friend: {
      warm: "May this Christmas bring you cozy moments, genuine smiles, and countless little reasons to be happy. So grateful to have you as a friend!",
      festive: "Wishing you a Christmas packed with laughter, exciting adventures, amazing gifts, and unforgettable memories. Let the celebrations begin!",
      heartfelt: "Thank you for being part of my journey and making life brighter. May the coming year bring you everything your heart wishes for. Merry Christmas, my friend!"
    },
    "someone special": {
      warm: "May your Christmas be as beautiful and wonderful as the happiness you bring to those around you. Sending you warmth, love, and a little Christmas magic.",
      festive: "May your holiday sparkle with happiness, laughter, and magical surprises. Wishing you the most wonderful Christmas!",
      heartfelt: "This Christmas, I hope you know just how special you are. May your heart be filled with warmth, your days with happiness, and your dreams with beautiful possibilities."
    }
  };

  const recipientLabels = {
    family: "Family",
    friend: "Friend",
    "someone special": "Someone Special"
  };

  function setFeedback(message) {
    feedbackElement.textContent = message;
  }

  function setActionState(disabled) {
    copyButton.disabled = disabled;
    shareButton.disabled = disabled;
  }

  function invalidateWish() {
    if (!currentWish) return;

    currentWish = "";
    hasGeneratedWish = false;

    outputElement.removeAttribute("data-wish-text");
    setActionState(true);

    setFeedback("Your details changed. Create a new wish to continue.");
  }

  function getWishMessage(recipient, mood) {
    return wishMessages[recipient]?.[mood] || "";
  }

  function updatePreview(recipient, name, message) {
    const greeting = name
      ? `Merry Christmas, ${name}!`
      : "Merry Christmas!";

    const recipientLabel = name
      ? `To ${name}`
      : `To ${recipientLabels[recipient]}`;

    const signature = "With Love, Christmas";

    recipientPreview.textContent = recipientLabel;
    messagePreview.textContent = message;

    outputElement.querySelector(".wish-preview_title").textContent = greeting;

    currentWish = `${greeting}\n\n${message}\n\n${signature}`;

    outputElement.dataset.wishText = currentWish;
    hasGeneratedWish = true;

    setActionState(false);
  }

  function generateWish(event) {
    event.preventDefault();

    const recipient = recipientInput.value;
    const mood = moodInput.value;
    const name = nameInput.value.trim();

    const message = getWishMessage(recipient, mood);

    if (!message || !recipientLabels[recipient]) {
      invalidateWish();
      setFeedback("Unable to generate your Christmas wish.");
      return;
    }

    updatePreview(recipient, name, message);

    setFeedback("Your Christmas wish is ready!");

    form.dispatchEvent(new CustomEvent("wishgenerated", {
      bubbles: true,
      detail: {
        recipient,
        mood,
        name,
        message
      }
    }));
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        console.warn("Clipboard API failed. Trying fallback.", error);
      }
    }

    if (typeof document.execCommand !== "function") {
      throw new Error("Clipboard is not supported.");
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } finally {
      textarea.remove();
    }

    if (!copied) {
      throw new Error("Unable to copy Christmas wish.");
    }
  }

  async function handleCopy() {
    if (!currentWish || isActionInProgress) return;

    isActionInProgress = true;
    setActionState(true);

    try {
      await copyToClipboard(currentWish);
      setFeedback("Your Christmas wish has been copied!");
    } catch (error) {
      console.error("Copy failed:", error);
      setFeedback("Unable to copy. Please try again.");
    } finally {
      isActionInProgress = false;
      setActionState(!hasGeneratedWish);
    }
  }

  async function handleShare() {
    if (!currentWish || isActionInProgress) return;

    isActionInProgress = true;
    setActionState(true);

    try {
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: "Merry Christmas!",
            text: currentWish
          });

          setFeedback("Your Christmas wish is ready to share!");
          return;
        } catch (error) {
          if (error.name === "AbortError") {
            return;
          }

          console.warn("Share failed. Trying clipboard fallback.", error);
        }
      }

      await copyToClipboard(currentWish);
      setFeedback("Sharing is unavailable. Your wish has been copied instead!");
    } catch (error) {
      console.error("Share failed:", error);
      setFeedback("Unable to share or copy. Please try again.");
    } finally {
      isActionInProgress = false;
      setActionState(!hasGeneratedWish);
    }
  }

  form.addEventListener("submit", generateWish);

  recipientInput.addEventListener("change", invalidateWish);
  nameInput.addEventListener("input", invalidateWish);
  moodInput.addEventListener("change", invalidateWish);

  copyButton.addEventListener("click", handleCopy);
  shareButton.addEventListener("click", handleShare);

  setActionState(true);
}
