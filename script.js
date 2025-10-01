// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Active nav link on scroll
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const linkById = Object.fromEntries(navLinks.map(a => [a.getAttribute('href').replace('#',''), a]));

const onScroll = () => {
  const scrollPos = window.scrollY + 90; // offset for fixed nav
  let current = sections[0]?.id;
  for (const sec of sections) {
    if (sec.offsetTop <= scrollPos) current = sec.id;
  }
  navLinks.forEach(a => a.classList.remove('active'));
  if (current && linkById[current]) linkById[current].classList.add('active');
};
document.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-navigation');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('show');
  });
  // Close on link click (mobile)
  navLinks.forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('show');
  }));
}

// Dynamic footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  const toggleBtn = () => {
    if (window.scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  };
  document.addEventListener('scroll', toggleBtn, { passive: true });
  window.addEventListener('load', toggleBtn);
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Auto-detect CV PDF file
(async () => {
  const link = document.getElementById('downloadCV');
  if (!link) return;
  const candidates = [
    'CV.pdf',
    'CV_Dedek_Rahmat.pdf',
    'CV_Dedek Rahmat.pdf',
    'Curriculum_Vitae.pdf',
    'Resume.pdf',
    'Dedek_Rahmat_CV.pdf',
    'Dedek Rahmat CV.pdf'
  ];
  const base = window.location.pathname.replace(/[^/]+$/, '');
  for (const name of candidates) {
    try {
      const url = base + encodeURI(name);
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        link.href = url;
        return;
      }
    } catch (_) { /* ignore */ }
  }
})();
