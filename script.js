// ============================================================
//  CONFIGURATION — fill these in later
// ============================================================

const CORRECT_PIN = "7600";        // ← e.g. "1234"
// The success text is in index.html inside #success-text

// ============================================================
//  Logic — no need to edit below
// ============================================================

const dots      = document.querySelectorAll('.dot');
const keys      = document.querySelectorAll('.key');
const errorMsg  = document.getElementById('error-msg');
const pinScreen = document.getElementById('pin-screen');
const successScreen = document.getElementById('success-screen');
const backBtn   = document.getElementById('back-btn');

let entered = "";
let attempts = 0;
const MAX_ATTEMPTS = 5;
function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < entered.length);
  });
}

function showError(msg) {
  errorMsg.textContent = msg;
  const display = document.querySelector('.pin-display');
  display.classList.add('shake');
  setTimeout(() => display.classList.remove('shake'), 400);
  // Clear dots after a short pause
  setTimeout(() => { entered = ""; updateDots(); }, 500);
}

function switchScreen(from, to) {
  from.classList.remove('active');
  to.classList.add('active');
}

function handleDigit(digit) {
  if (entered.length >= 4) return;
  entered += digit;
  updateDots();
}

function handleSubmit() {
  
  if (entered.length < 4) {
    showError("Enter all 4 digits");
    return;
  }

  if (CORRECT_PIN === "") {
    showError("PIN not set yet!");
    return;
  }

  // Correct PIN → go to final question
  if (entered === CORRECT_PIN) {
    switchScreen(pinScreen, successScreen);
    entered = "";
    updateDots();
    return;
  }

  // Wrong PIN → count the guess
  attempts++;

localStorage.setItem("pinAttempts", attempts);

if (attempts >= MAX_ATTEMPTS) {
  showError("You've used all 5 guesses!");

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

// Keypad clicks
keys.forEach(key => {
  key.addEventListener('click', () => {
    errorMsg.textContent = "";
    const digit  = key.dataset.digit;
    const action = key.dataset.action;
    if (digit !== undefined) handleDigit(digit);
    else if (action === 'clear')  { entered = ""; updateDots(); }
    else if (action === 'submit') handleSubmit();
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  errorMsg.textContent = "";
  if (/^[0-9]$/.test(e.key))   handleDigit(e.key);
  else if (e.key === 'Backspace') { entered = entered.slice(0, -1); updateDots(); }
  else if (e.key === 'Enter')   handleSubmit();
});

// Back button
backBtn.addEventListener('click', () => switchScreen(successScreen, pinScreen));
