export function initCountdown() {
  const daysElement = document.getElementById("countdown-days");
  const hoursElement = document.getElementById("countdown-hours");
  const minutesElement = document.getElementById("countdown-minutes");
  const secondsElement = document.getElementById("countdown-seconds");
  const messageElement = document.getElementById("countdown-message");
  const timerElement = document.getElementById("countdown-timer");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement ||
    !messageElement ||
    !timerElement
  ) {
    console.warn("[Christmas] Countdown elements not found.");
    return;
  }

  if (timerElement.dataset.initialized === "true") return;
  timerElement.dataset.initialized = "true";

  let intervalId = null;

  function getChristmasState(now) {
    const year = now.getFullYear();
    const christmasStart = new Date(year, 11, 25, 0, 0, 0);
    const christmasEnd = new Date(year, 11, 26, 0, 0, 0);

    if (now >= christmasStart && now < christmasEnd) {
      return {
        isChristmas: true,
        targetDate: null
      };
    }

    return {
      isChristmas: false,
      targetDate: now < christmasStart
        ? christmasStart
        : new Date(year + 1, 11, 25, 0, 0, 0)
    };
  }

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const christmas = getChristmasState(now);

    if (christmas.isChristmas) {
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      messageElement.textContent = "Merry Christmas!";
      return;
    }

    const difference = christmas.targetDate.getTime() - now.getTime();

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference / 3600000) % 24);
    const minutes = Math.floor((difference / 60000) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = formatNumber(days);
    hoursElement.textContent = formatNumber(hours);
    minutesElement.textContent = formatNumber(minutes);
    secondsElement.textContent = formatNumber(seconds);

    messageElement.textContent = "Christmas is on its way!";
  }

  function startTimer() {
    if (intervalId !== null || document.hidden) return;

    updateCountdown();
    intervalId = window.setInterval(updateCountdown, 1000);
  }

  function stopTimer() {
    if (intervalId === null) return;

    window.clearInterval(intervalId);
    intervalId = null;
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);

  startTimer();

  return () => {
    stopTimer();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    delete timerElement.dataset.initialized;
  };
}