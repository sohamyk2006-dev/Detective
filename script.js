// ============================================================
// CONFIGURATION
// ============================================================

const CORRECT_PIN = "7600";
const MAX_ATTEMPTS = 5;

// ============================================================
// ELEMENTS
// ============================================================

const dots = document.querySelectorAll('.dot');
const keys = document.querySelectorAll('.key');
const errorMsg = document.getElementById('error-msg');
const pinScreen = document.getElementById('pin-screen');
const successScreen = document.getElementById('success-screen');
const backBtn = document.getElementById('back-btn');

// ============================================================
// VARIABLES
// ============================================================

let entered = "";

// Get previous attempts from the browser
let attempts = Number(localStorage.getItem("pinAttempts")) || 0;

// ============================================================
// FUNCTIONS
// ============================================================

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < entered.length);
  });
}

function showError(msg) {
  errorMsg.textContent = msg;

  const display = document.querySelector('.pin-display');
  display.classList.add('shake');

  setTimeout(() => {
    display.classList.remove('shake');
  }, 400);

  // Clear entered PIN
  setTimeout(() => {
    entered = "";
    updateDots();
  }, 500);
}

function switchScreen(from, to) {
  from.classList.remove('active');
  to.classList.add('active');
}

function handleDigit(digit) {

  // Don't allow entering PIN if all attempts are used
  if (attempts >= MAX_ATTEMPTS) return;

  if (entered.length >= 4) return;

  entered += digit;
  updateDots();
}

function handleSubmit() {

  // Check if all attempts have already been used
  if (attempts >= MAX_ATTEMPTS) {
    showError("You've used all 5 guesses!");
    return;
  }

  // Make sure 4 digits have been entered
  if (entered.length < 4) {
    showError("Enter all 4 digits");
    return;
  }

  // Make sure PIN is configured
  if (CORRECT_PIN === "") {
    showError("PIN not set yet!");
    return;
  }

  // ============================================================
  // CORRECT PIN
  // ============================================================

  if (entered === CORRECT_PIN) {

    // Go to final question
    switchScreen(pinScreen, successScreen);

    entered = "";
    updateDots();

    return;
  }

  // ============================================================
  // WRONG PIN
  // ============================================================

  attempts++;

  // Save attempts in browser
  localStorage.setItem("pinAttempts", attempts);

  if (attempts >= MAX_ATTEMPTS) {

    showError("You've used all 5 guesses!");

    // Disable keypad
    keys.forEach(key => {
      key.style.pointerEvents = "none";
      key.style.opacity = "0.5";
    });

    return;
  }

  const remaining = MAX_ATTEMPTS - attempts;

  showError(
    `Wrong code — ${remaining} guess${remaining === 1 ? "" : "es"} remaining`
  );
}

// ============================================================
// KEYPAD CLICKS
// ============================================================

keys.forEach(key => {

  key.addEventListener('click', () => {

    errorMsg.textContent = "";

    const digit = key.dataset.digit;
    const action = key.dataset.action;

    if (digit !== undefined) {
      handleDigit(digit);
    }

    else if (action === 'clear') {

      if (attempts < MAX_ATTEMPTS) {
        entered = "";
        updateDots();
      }

    }

    else if (action === 'submit') {
      handleSubmit();
    }

  });

});

// ============================================================
// KEYBOARD SUPPORT
// ============================================================

document.addEventListener('keydown', (e) => {

  errorMsg.textContent = "";

  if (/^[0-9]$/.test(e.key)) {

    handleDigit(e.key);

  }

  else if (e.key === 'Backspace') {

    if (attempts < MAX_ATTEMPTS) {
      entered = entered.slice(0, -1);
      updateDots();
    }

  }

  else if (e.key === 'Enter') {

    handleSubmit();

  }

});

// ============================================================
// BACK BUTTON
// ============================================================

backBtn.addEventListener('click', () => {

  switchScreen(successScreen, pinScreen);

});
