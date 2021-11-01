const DURATION = 1000;
const MAX_SECONDS = 60;

// const timerInput = document.querySelector("input");
const timerValue = document.getElementById("timerValue");
// const timerButton = document.getElementById("timerButton");
const timerReset = document.getElementById("timerReset");
const timerSlider = document.getElementById("timerSlider");
const snackbar = document.querySelector(".snackbar");
const timerContainer = document.querySelector(".timer");

let timer = 0;
let seconds = MAX_SECONDS;
let isDarkTheme = true;
let isTimerOff = true;
let sequencer;
let lastColor = "";

// service workers (pwa)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js');
    });
  }

timerSlider.oninput = function() {
    timerValue.textContent = this.value + ":00";
}

timerSlider.onchange = function() {
    beginTimer(this);
}

// timerValue.innerText = timer.getMinutes() + ":" + Math.round(timer.getMilliseconds()/60);
// timerInput.addEventListener("input", updateTimerValue);

function updateTimerValue(e) {
    if (e.currentTarget.value < 0 || e.currentTarget.value > 60) {
        displaySnackbar(`${e.currentTarget.value} is not a valid input`);
        timerValue.textContent = "00:00";
        e.currentTarget.value = "00:00";
    } 
    else {
        timerValue.textContent = e.currentTarget.value + ":00";
    }
}

function beginTimer(e) {
    if (timerValue.innerText == "00:00") displaySnackbar("Timer is not set");
    else {
        // console.log('timer is running');     // testing
        isTimerOff = false;
        displayReset();
        // timerReset.classList.remove("hidden");
        // timer = timerInput.value - 1;
        timer = parseInt(timerValue.innerText) - 1;
        sequencer = setInterval(() => {
            if (timer == "1" && seconds =="00") timer = 0;
            // (seconds > 10) ? console.log(`${timer}:${seconds-1}`) : console.log(`${timer}:0${seconds-1}`);
            (seconds > 10) ? timerValue.textContent = `${timer}:${seconds-1}` : timerValue.textContent = `${timer}:0${seconds-1}`;

            timerSlider.value = timer;
            seconds -= 1;
            // restart and reset
            if (seconds == 0) {
                timer -= 1;
                seconds = 60;
            }
            // the last 5 mins, warning!
            if (timer < 5) changeTheme(red);
            // terminate interval
            if (timer < 0) clearInterval(sequencer);
        }, DURATION)
    }
}

function resetTimer() {
    // console.log("timer is stopped");    // testing
    clearInterval(sequencer);
    isTimerOff = true;
    timerValue.innerText = "00:00";
    timerSlider.disabled = false;
    timerSlider.value = "0";
    timerReset.classList.remove("show");
}

function toggleTheme() {
    const doc = document.querySelector("body");
    if (isDarkTheme) {
        doc.classList.remove("dark");
        doc.classList.add("light");
        isDarkTheme = false;
    } else {
        doc.classList.remove("light");
        doc.classList.add("dark");
        isDarkTheme = true;
    }
}

function changeTheme(opt) {
    timerContainer.className = "";
    timerContainer.classList.add('timer', `border-${opt}`);
    timerSlider.className = "";
    timerSlider.classList.add('slider', `slider-${opt}`);
    timerReset.className = "";
    timerReset.classList.add('reset', `border-${opt}`);
    displayReset();
}

function displaySnackbar(message) {
    snackbar.classList.add("show");
    snackbar.innerText = message;
    setTimeout(() => { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

function displayReset() {
    if (!isTimerOff) timerReset.classList.add("show");
}