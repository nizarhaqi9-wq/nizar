// ---------- year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- sticky nav shadow ----------
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- mobile menu ----------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// ---------- reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = Number(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('in'), delay);
      io.unobserve(el);
    });
  },
  { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = String((i % 4) * 70);
  io.observe(el);
});

// ---------- count-up stats ----------
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const dur = 1100;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((c) => counterIO.observe(c));

// ---------- active nav link on scroll ----------
const sections = [...document.querySelectorAll('main section[id]')];
const linkMap = new Map(
  [...navLinks.querySelectorAll('a')].map((a) => [a.getAttribute('href').slice(1), a])
);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      linkMap.forEach((a) => (a.style.color = ''));
      const active = linkMap.get(entry.target.id);
      if (active) active.style.color = 'var(--text)';
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

sections.forEach((s) => spy.observe(s));
