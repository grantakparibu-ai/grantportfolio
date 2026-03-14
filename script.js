// ── 1. CURSORE CUSTOM ───────────────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

document.addEventListener('mousemove', e => {
  const x = e.clientX, y = e.clientY;
  cursor.style.left   = x + 'px';
  cursor.style.top    = y + 'px';
  follower.style.left = x + 'px';
  follower.style.top  = y + 'px';
});

// ── 2. THEME SWITCHER ────────────────────────────────────────────
const themeBtn = document.getElementById('themeBtn');
const html     = document.documentElement;
const saved    = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── 3. TYPING EFFECT ─────────────────────────────────────────────
const phrases = [
  'Costruisco esperienze web.',
  'Appassionato di Python & SQL.',
  'Sempre in cerca di imparare.',
  'Junior Developer — Milano.'
];

let pIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typingEl');

function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typingEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typingEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 40 : 85);
}
type();

// ── 4. SCROLL REVEAL ─────────────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
