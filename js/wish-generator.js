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
    !shareButton
  ) {
    console.warn("[Christmas] Wish Generator elements not found.");
    return;
  }

  if (form.dataset.initialized === "true") return;

  const titleElement = outputElement.querySelector(".wish-preview_title");

  if (!titleElement) {
    console.warn("[Christmas] Wish preview title not found.");
    return;
  }

  form.dataset.initialized = "true";

  let currentWish = "";
  let isActionInProgress = false;
  let generationVersion = 0;

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

  function updateActionButtons() {
    const disabled = !currentWish || isActionInProgress;

    copyButton.disabled = disabled;
    shareButton.disabled = disabled;
  }

  function getWishMessage(recipient, mood) {
    return wishMessages[recipient]?.[mood] || "";
  }

  function invalidateWish() {
    if (!currentWish) return;

    currentWish = "";
    generationVersion++;

    updateActionButtons();
    setFeedback("Your details have changed. Create your wish again.");
  }

  function updatePreview(recipient, name, message) {
    const greeting = name
      ? `Merry Christmas, ${name}!`
      : "Merry Christmas!";

    const recipientLabel = name
      ? `To ${name}`
      : `To ${recipientLabels[recipient]}`;

    recipientPreview.textContent = recipientLabel;
    messagePreview.textContent = message;
    titleElement.textContent = greeting;

    currentWish = `${greeting}\n\n${message}\n\nWith Love, Christmas`;

    generationVersion++;
    updateActionButtons();
  }

  function generateWish(event) {
    event.preventDefault();

    const recipient = recipientInput.value;
    const mood = moodInput.value;
    const name = nameInput.value.trim();

    const message = getWishMessage(recipient, mood);

    if (!message) {
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
        console.warn("[Christmas] Clipboard API failed. Using fallback.", error);
      }
    }

    if (typeof document.execCommand !== "function") {
      throw new Error("Clipboard is not supported.");
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const copied = document.execCommand("copy");

    textarea.remove();

    if (!copied) {
      throw new Error("Unable to copy Christmas wish.");
    }
  }

  async function handleCopy() {
    if (!currentWish || isActionInProgress) return;

    const wish = currentWish;
    const version = generationVersion;

    isActionInProgress = true;
    updateActionButtons();

    try {
      await copyToClipboard(wish);

      if (version === generationVersion) {
        setFeedback("Your Christmas wish has been copied!");
      }
    } catch (error) {
      console.error("[Christmas] Copy failed:", error);

      if (version === generationVersion) {
        setFeedback("Unable to copy. Please try again.");
      }
    } finally {
      isActionInProgress = false;
      updateActionButtons();
    }
  }

  async function handleShare() {
    if (!currentWish || isActionInProgress) return;

    const wish = currentWish;
    const version = generationVersion;

    isActionInProgress = true;
    updateActionButtons();

    try {
      let shared = false;

      if (typeof navigator.share === "function") {
        const shareData = {
          title: "Merry Christmas!",
          text: wish
        };

        try {
          if (
            typeof navigator.canShare !== "function" ||
            navigator.canShare(shareData)
          ) {
            await navigator.share(shareData);
            shared = true;
          }
        } catch (error) {
          if (error.name === "AbortError") {
            return;
          }

          console.warn("[Christmas] Share failed. Using clipboard fallback.", error);
        }
      }

      if (shared) {
        if (version === generationVersion) {
          setFeedback("Your Christmas wish has been shared!");
        }

        return;
      }

      await copyToClipboard(wish);

      if (version === generationVersion) {
        setFeedback("Sharing is unavailable. Your wish has been copied instead!");
      }
    } catch (error) {
      console.error("[Christmas] Share failed:", error);

      if (version === generationVersion) {
        setFeedback("Unable to share or copy. Please try again.");
      }
    } finally {
      isActionInProgress = false;
      updateActionButtons();
    }
  }

  form.addEventListener("submit", generateWish);

  form.addEventListener("input", (event) => {
    if (event.target === nameInput) {
      invalidateWish();
    }
  });

  form.addEventListener("change", (event) => {
    if (
      event.target === recipientInput ||
      event.target === moodInput
    ) {
      invalidateWish();
    }
  });

  copyButton.addEventListener("click", handleCopy);
  shareButton.addEventListener("click", handleShare);

  updateActionButtons();
}