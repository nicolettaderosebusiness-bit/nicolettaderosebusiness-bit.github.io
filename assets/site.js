const nav = document.querySelector('.site-nav');
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateScroll = () => {
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  nav?.classList.toggle('scrolled', y > 28);
  root.style.setProperty('--progress', `${Math.min(100, y / max * 100)}%`);
  if (!reducedMotion) root.style.setProperty('--hero-y', `${Math.min(80, y * .12)}px`);
};

updateScroll();
window.addEventListener('scroll', updateScroll, { passive: true });

const setMenu = open => {
  navLinks?.classList.toggle('open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  if (menuToggle) menuToggle.textContent = open ? 'Chiudi' : 'Menu';
  document.body.classList.toggle('menu-open', open);
  if (open) nav?.classList.add('scrolled'); else updateScroll();
};

menuToggle?.addEventListener('click', () => setMenu(!navLinks?.classList.contains('open')));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
    setMenu(false);
    menuToggle?.focus();
  }
});

navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

document.querySelectorAll('[data-company-film]').forEach(video => {
  const frame = video.closest('.company-film-frame');
  const toggle = frame?.querySelector('[data-company-film-toggle]');
  let isInView = false;

  const syncVideoControl = () => {
    const isPlaying = !video.paused && !video.ended;
    if (!toggle) return;
    toggle.textContent = isPlaying ? 'Pausa' : 'Avvia';
    toggle.setAttribute('aria-label', isPlaying ? 'Metti in pausa il video' : 'Riproduci il video');
  };

  const playFilm = () => video.play().then(syncVideoControl).catch(syncVideoControl);
  const pauseFilm = () => { video.pause(); syncVideoControl(); };

  toggle?.addEventListener('click', () => {
    if (video.paused) playFilm(); else pauseFilm();
  });
  video.addEventListener('play', syncVideoControl);
  video.addEventListener('pause', syncVideoControl);

  if ('IntersectionObserver' in window) {
    const filmObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        isInView = entry.isIntersecting;
        if (!reducedMotion && isInView && !document.hidden) playFilm();
        else pauseFilm();
      });
    }, { threshold: .35 });
    filmObserver.observe(video);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseFilm();
    else if (!reducedMotion && isInView) playFilm();
  });
  syncVideoControl();
});

document.querySelectorAll('[data-contact-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  const data = new FormData(form);
  const fields = [
    ['Nome e cognome', 'name'],
    ['Azienda / Ente', 'company'],
    ['Email', 'email'],
    ['Telefono', 'phone'],
    ['Tipo di produzione', 'product'],
    ['Quantità indicativa', 'quantity'],
    ['Descrizione del progetto', 'message'],
  ];
  const body = fields
    .map(([label, name]) => `${label}: ${String(data.get(name) || '').trim()}`)
    .filter(line => !line.endsWith(': '))
    .join('\n\n');
  const subjectName = String(data.get('company') || data.get('name') || 'nuovo contatto').trim();
  const mailto = new URL('mailto:info@tipografiaderose.it');
  mailto.searchParams.set('subject', `Richiesta dal sito — ${subjectName}`);
  mailto.searchParams.set('body', body);
  status.textContent = 'Apertura del programma di posta in corso. Verifica il messaggio e conferma l’invio.';
  window.location.href = mailto.toString();
}));
