// Navbar elevation on scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('elevated', window.scrollY > 20);
  }, { passive: true });
}

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileOverlay = document.querySelector('.mobile-overlay');
const closeBtn = document.querySelector('.close-btn');

function openMenu() {
  mobileNav?.classList.add('open');
  mobileOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileNav?.classList.remove('open');
  mobileOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
mobileOverlay?.addEventListener('click', closeMenu);

// Active nav link
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// Intersection Observer — fade-up animations
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// Animated counters
function runCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let val = 0;
  const t = setInterval(() => {
    val = Math.min(val + step, target);
    el.textContent = Math.floor(val) + suffix;
    if (val >= target) clearInterval(t);
  }, 16);
}

const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      runCounter(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-target]').forEach(el => counterIO.observe(el));

// ===== CARROCEL DE ÁREAS =====
(function () {
  const track   = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots    = document.querySelectorAll('.carousel-dot');

  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;
  let current  = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(+dot.dataset.index));
  });

  // Suporte a swipe em touch
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });

  // Inicializar
  goTo(0);
})();

// "Saber mais" — bio expandível na página Sobre
const btnSaber = document.getElementById('btn-saber-mais');
const bioExpand = document.getElementById('bio-expand');
if (btnSaber && bioExpand) {
  btnSaber.addEventListener('click', () => {
    const isOpen = bioExpand.classList.toggle('open');
    btnSaber.setAttribute('aria-expanded', isOpen);
    bioExpand.setAttribute('aria-hidden', !isOpen);
    btnSaber.querySelector('.btn-saber-mais-label').textContent = isOpen ? 'Saber menos...' : 'Saber mais...';
    if (isOpen) {
      setTimeout(() => bioExpand.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  });
}

// Contact form — envia email via mailto:
const form = document.getElementById('contact-form') || document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const get = id => (document.getElementById(id)?.value || '').trim();
    const nome      = get('nome');
    const apelido   = get('apelido');
    const email     = get('email');
    const telefone  = get('telefone');
    const area      = get('area');
    const mensagem  = get('mensagem');

    // Validação básica
    if (!nome || !email || !mensagem) {
      alert('Por favor preencha os campos obrigatórios: Nome, Email e Mensagem.');
      return;
    }

    const subject = `Contacto Website — ${nome} ${apelido}`.trim();
    const body =
      `Nome: ${nome} ${apelido}\n` +
      `Email: ${email}\n` +
      (telefone ? `Telefone: ${telefone}\n` : '') +
      (area     ? `Área de interesse: ${area}\n` : '') +
      `\nMensagem:\n${mensagem}`;

    const mailto = `mailto:paulamartins-12395l@adv.oa.pt` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}
