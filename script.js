(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Footer year (automatic update)
  const updateYear = () => {
    const yrEl = $('#year');
    if (yrEl) yrEl.textContent = new Date().getFullYear();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateYear);
  } else {
    updateYear();
  }

  // Scroll progress + nav border
  const bar = $('#progressBar');
  const nav = $('#nav');
  let ticking = false;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${ratio})`;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');

  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  $$('a', navLinks).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Highlight current section in nav
  const links = $$('.nav-links a[href^="#"]');
  const sections = links
    .map((a) => $(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // Skill filters
  const chips = $$('.chip');
  const skills = $$('.skill');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', String(active));
      });
      skills.forEach((s) => {
        const match = filter === 'all' || s.dataset.cat.split(' ').includes(filter);
        s.classList.toggle('is-hidden', !match);
      });
    });
  });

  // Copy email
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  $('#copyBtn').addEventListener('click', async () => {
    const email = 'mohanaakilan2@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied');
    } catch {
      showToast('Copy failed. Select the email and copy it manually.');
    }
  });
})();
