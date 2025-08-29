// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // cerrar menú móvil
    const menu = document.getElementById('menu');
    const hamburger = document.getElementById('hamburger');
    menu.classList.remove('open'); menu.style.display = '';
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Menú móvil
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
hamburger?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menu.style.display = isOpen ? 'block' : '';
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Sección activa en scroll (observador)
const sections = [...document.querySelectorAll('main section[id], section#inicio')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.menu a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) link.classList.add('active');
    else link.classList.remove('active');
  });
}, { threshold: 0.55 });
sections.forEach(s => observer.observe(s));

// Contador animado (stats)
const counters = document.querySelectorAll('[data-count]');
let counted = false;
const countObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted){
      counted = true;
      counters.forEach(el => {
        const end = parseInt(el.dataset.count, 10);
        const start = 0;
        const dur = 1200;
        const t0 = performance.now();
        function step(t){
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.floor(start + (end - start) * (0.5 - Math.cos(Math.PI * p)/2));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      countObs.disconnect();
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => countObs.observe(c));

// Tabs Agenda
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
  tab.classList.add('active'); tab.setAttribute('aria-selected','true');
  document.querySelectorAll('.tabpanes').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById(tab.getAttribute('aria-controls'));
  pane?.classList.add('active');
}));

// Parallax sutil (si no hay reduce-motion)
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layers = [
    { el: document.querySelector('.decor--1'), depth: 0.06 },
    { el: document.querySelector('.decor--2'), depth: 0.10 },
    { el: document.querySelector('.shards'),   depth: 0.14 }
  ].filter(x => x.el);
  if (prefersReduced || !layers.length) return;

  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      layers.forEach(({el, depth}) => { el.style.transform = `translate3d(0, ${y * depth}px, 0)`; });
      ticking = false;
    });
  }
  function onMove(e){
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const mx = (e.clientX - cx) / cx, my = (e.clientY - cy) / cy;
    layers.forEach(({el, depth}) => { el.style.transform = `translate3d(${mx * 8 * depth}px, ${my * 10 * depth}px, 0)`; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMove, { passive: true });
})();

// Back to top + CTA bar
const back = document.getElementById('backtop');
window.addEventListener('scroll', () => {
  const y = window.scrollY || 0;
  if (y > 400) back.classList.add('show'); else back.classList.remove('show');
});
back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Validación simple del formulario
const form = document.getElementById('form-registro');
const msg = document.getElementById('form-msg');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const required = ['nombre','email','plan','tyc'];
  for (const r of required){
    if (r === 'tyc' && !form.querySelector('input[name="tyc"]').checked){
      msg.textContent = 'Debes aceptar los Términos y Políticas.'; msg.style.color = '#AEEBFF'; return;
    }
    if (!data.get(r)){ msg.textContent = 'Por favor completa los campos obligatorios.'; msg.style.color = '#AEEBFF'; return; }
  }
  // Aquí integrarías tu POST/Fetch al backend o a tu plataforma de pagos
  msg.textContent = '¡Registro enviado! Te contactaremos por email.'; msg.style.color = '#79E0FF';
  form.reset();
});

// Consola
window.addEventListener('load', () => console.log('Landing PM Tour Norte 2025 lista ✅'));
