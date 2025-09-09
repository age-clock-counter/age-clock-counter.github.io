const secondHand = document.getElementById("second-hand");
const minuteHand = document.getElementById("minute-hand");
const hourHand = document.getElementById("hour-hand");

const todayEl = document.querySelector('.today');
const thisSecEl = document.querySelector('.this-sec');
const nextSecEl = document.querySelector('.next-sec');

const elapsedEl = document.querySelector('.elapsed-time');

const startDate = new Date("2007-12-15T00:00:00");

let hourSmooth = false;
let minuteSmooth = false;
let secondSmooth = false;

function toHijri(date) {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    }).format(date);
}

function clockTick() {
    const now = new Date();
    const diffMs = now - startDate;

    const millisInYear = 354 * 24 * 60 * 60 * 1000;
    const yearsPassed = diffMs / millisInYear;

    const yearsWithinHour = yearsPassed % 60;
    const minutesInt = Math.floor(yearsWithinHour);
    const yearFraction = yearsWithinHour - minutesInt;

    const secondsPrecise = yearFraction * 60;
    const secondsInt = Math.floor(secondsPrecise);

    // 🕒 هنا نحسب الثانية الحالية والتالية
    const secondLengthMs = millisInYear / 60;
    const currentSecondStart = new Date(startDate.getTime() + (Math.floor(yearsPassed * 60) * secondLengthMs));
    const nextSecondStart = new Date(currentSecondStart.getTime() + secondLengthMs);

    todayEl.textContent = "اليوم الحالي: " + toHijri(now);
    thisSecEl.textContent = "بداية الثانية الحالية: " + toHijri(currentSecondStart);
    nextSecEl.textContent = "بداية الثانية التالية: " + toHijri(nextSecondStart);

    elapsedEl.textContent = `${minutesInt}:${secondsInt}.${Math.floor((secondsPrecise-secondsInt)*1000)}`;

    // ---- دوران العقارب ----
    let seconds = secondSmooth
        ? secondsPrecise / 60
        : secondsInt / 60;

    let minutes = minuteSmooth
        ? (minutesInt + seconds) / 60
        : minutesInt / 60;

    const totalHoursPassed = Math.floor(yearsPassed / 60);
    const hoursInt = totalHoursPassed % 12;

    let hours = hourSmooth
        ? (hoursInt + minutes) / 12
        : hoursInt / 12;

    rotateClockHand(secondHand, seconds);
    rotateClockHand(minuteHand, minutes);
    rotateClockHand(hourHand, hours);
}

// event listeners للأزرار
document.getElementById("toggle-hour").addEventListener("click", function() {
    hourSmooth = !hourSmooth;
    this.classList.toggle("active");
});

document.getElementById("toggle-minute").addEventListener("click", function() {
    minuteSmooth = !minuteSmooth;
    this.classList.toggle("active");
});

document.getElementById("toggle-second").addEventListener("click", function() {
    secondSmooth = !secondSmooth;
    this.classList.toggle("active");
});

function rotateClockHand(element, rotation) {
    element.style.setProperty("--rotate", rotation * 360);
}

setInterval(clockTick);

const ticksContainer = document.querySelector(".ticks");
for (let i = 0; i < 60; i++) {
    const tick = document.createElement("div");
    tick.classList.add("tick");
    if (i % 5 === 0) tick.classList.add("big"); // كل 5 دقائق يخليها كبيرة
    tick.style.setProperty("--i", i);
    ticksContainer.appendChild(tick);
}