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
    console.warn("Countdown elements could not be found.");
    return;
  }

  let intervalId;

  function getChristmasDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const christmasDate = new Date(currentYear, 11, 25, 0, 0, 0);
    

    const isChristmasDay =
      now.getMonth() === 11 &&
      now.getDate() === 25;

    if (isChristmasDay) {
      return {
        date: christmasDate,
        isChristmas: true
      };
    }

    if (now > christmasDate) {
      return {
        date: new Date(currentYear + 1, 11, 25, 0, 0, 0),
        isChristmas: false
      };
    }

    return {
      date: christmasDate,
      isChristmas: false
    };
  }

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const christmas = getChristmasDate();

    if (christmas.isChristmas) {
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      messageElement.textContent = "Merry Christmas!";

      clearInterval(intervalId);
      return;
    }

    const difference = christmas.date.getTime() - now.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = formatNumber(days);
    hoursElement.textContent = formatNumber(hours);
    minutesElement.textContent = formatNumber(minutes);
    secondsElement.textContent = formatNumber(seconds);

    messageElement.textContent = "Christmas is on its way!";
  }

  updateCountdown();
  intervalId = setInterval(updateCountdown, 1000);
}
