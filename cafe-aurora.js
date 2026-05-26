/* =========================================================
   Café Aurora — Animações on-scroll customizadas
   Hospedado externamente (jsDelivr / GitHub Pages)
   Carregado no Webflow via DOM tag <script src="...">
   ========================================================= */

(() => {
  'use strict';

  const SECTION_IDS = ['sobre', 'cardapio', 'espaco', 'avaliacoes', 'localizacao', 'reserva'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const style = document.createElement('style');
  style.textContent = `
    .aurora-fade {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity .9s cubic-bezier(.16, 1, .3, 1),
                  transform .9s cubic-bezier(.16, 1, .3, 1);
      will-change: opacity, transform;
    }
    .aurora-fade.aurora-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .aurora-stagger > * {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity .6s ease-out, transform .6s ease-out;
    }
    .aurora-stagger.aurora-visible > * {
      opacity: 1;
      transform: translateY(0);
    }
    .aurora-stagger.aurora-visible > *:nth-child(1) { transition-delay: 0ms; }
    .aurora-stagger.aurora-visible > *:nth-child(2) { transition-delay: 90ms; }
    .aurora-stagger.aurora-visible > *:nth-child(3) { transition-delay: 180ms; }
    .aurora-stagger.aurora-visible > *:nth-child(4) { transition-delay: 270ms; }
    .aurora-stagger.aurora-visible > *:nth-child(5) { transition-delay: 360ms; }
    .aurora-stagger.aurora-visible > *:nth-child(6) { transition-delay: 450ms; }
    .aurora-stagger.aurora-visible > *:nth-child(n+7) { transition-delay: 540ms; }
    .aurora-active-link {
      font-weight: 600 !important;
      opacity: 1 !important;
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora-fade, .aurora-stagger > * {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const sections = SECTION_IDS
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) {
    console.warn('[Café Aurora] Nenhuma section encontrada com os IDs configurados.');
    return;
  }

  sections.forEach((section) => {
    section.classList.add('aurora-fade');
    const candidate = section.querySelector(
      '.w-layout-grid, .w-dyn-items, .w-row, ul:not(nav ul):not(footer ul)'
    );
    if (candidate && candidate.children.length >= 2) {
      candidate.classList.add('aurora-stagger');
    }
  });

  if (!('IntersectionObserver' in window) || reduceMotion) {
    sections.forEach((s) => {
      s.classList.add('aurora-visible');
      s.querySelectorAll('.aurora-stagger').forEach((el) => el.classList.add('aurora-visible'));
    });
    return;
  }

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aurora-visible');
          entry.target
            .querySelectorAll('.aurora-stagger')
            .forEach((el) => el.classList.add('aurora-visible'));
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((s) => fadeObserver.observe(s));

  const navLinks = document.querySelectorAll(
    'nav a[href^="#"], a.w-nav-link[href^="#"], .w-nav-menu a[href^="#"]'
  );
  if (navLinks.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const isActive = link.getAttribute('href') === `#${id}`;
              link.classList.toggle('aurora-active-link', isActive);
              if (isActive) link.setAttribute('aria-current', 'true');
              else link.removeAttribute('aria-current');
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => activeObserver.observe(s));
  }

  console.log('[Café Aurora] Animações on-scroll ativas ☕');
})();
