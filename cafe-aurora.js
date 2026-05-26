/* =========================================================
   Café Aurora — JavaScript customizado
   Hospedado externamente (jsDelivr / GitHub)
   Carregado no Webflow via DOM tag <script src="...">

   Funcionalidades:
   1. Lightbox: clique em imagens do #sobre para ampliá-las
   2. Hover sutil nas imagens (brightness + cursor)
   3. Fade-in das sections ao rolar (respeita prefers-reduced-motion)
   ========================================================= */

(() => {
  'use strict';

  const SECTION_IDS = ['sobre', 'cardapio', 'espaco', 'avaliacoes', 'localizacao', 'reserva'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     CSS injetado (com !important para vencer o Webflow)
     ========================================================= */
  const style = document.createElement('style');
  style.id = 'aurora-customizations-css';
  style.textContent = `
    /* Hover sutil nas imagens do #sobre */
    #sobre .image_cover {
      cursor: zoom-in !important;
      filter: brightness(0.95);
      transition: filter .3s ease, box-shadow .3s ease !important;
    }
    #sobre .image_cover:hover,
    #sobre .image_cover:focus-visible {
      filter: brightness(1.05) !important;
      box-shadow: 0 12px 40px rgba(43, 26, 16, 0.35) !important;
      outline: none;
    }

    /* Lightbox overlay */
    .aurora-lightbox {
      position: fixed;
      inset: 0;
      background: rgba(20, 12, 8, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 2rem;
      opacity: 0;
      transition: opacity .3s ease;
      cursor: zoom-out;
    }
    .aurora-lightbox.aurora-lightbox-open {
      opacity: 1;
    }
    .aurora-lightbox img {
      max-width: 90vw;
      max-height: 85vh;
      border-radius: .75rem;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      transform: scale(0.96);
      transition: transform .35s cubic-bezier(.16, 1, .3, 1);
    }
    .aurora-lightbox.aurora-lightbox-open img {
      transform: scale(1);
    }
    .aurora-lightbox-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border: 2px solid rgba(255, 255, 255, 0.3);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .2s ease, transform .2s ease;
    }
    .aurora-lightbox-close:hover,
    .aurora-lightbox-close:focus-visible {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }
    .aurora-lightbox-caption {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.85);
      font-size: .95rem;
      max-width: 80%;
      text-align: center;
      background: rgba(0, 0, 0, 0.4);
      padding: .6rem 1.2rem;
      border-radius: 999px;
    }
    body.aurora-lightbox-active {
      overflow: hidden;
    }

    /* Fade-in on scroll (respeita reduce motion) */
    .aurora-fade {
      opacity: 0 !important;
      transform: translateY(40px) !important;
      transition: opacity .9s cubic-bezier(.16, 1, .3, 1),
                  transform .9s cubic-bezier(.16, 1, .3, 1) !important;
      will-change: opacity, transform;
    }
    .aurora-fade.aurora-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora-fade {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  /* =========================================================
     LIGHTBOX — funciona mesmo com prefers-reduced-motion
     (acionado por clique do usuário = user-initiated)
     ========================================================= */
  const setupLightbox = () => {
    const sobre = document.getElementById('sobre');
    if (!sobre) {
      console.warn('[Aurora] #sobre não encontrado, pulando lightbox.');
      return;
    }

    const images = sobre.querySelectorAll('img.image_cover, img');
    if (!images.length) {
      console.warn('[Aurora] Nenhuma imagem encontrada no #sobre.');
      return;
    }

    console.log('[Aurora] Lightbox configurado em', images.length, 'imagens do #sobre');

    /* Torna cada imagem clicável + acessível por teclado */
    images.forEach((img) => {
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', `Ampliar imagem: ${img.alt || 'imagem'}`);

      const openLightbox = () => {
        const overlay = document.createElement('div');
        overlay.className = 'aurora-lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Imagem ampliada');

        const bigImg = document.createElement('img');
        bigImg.src = img.src;
        bigImg.alt = img.alt;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'aurora-lightbox-close';
        closeBtn.setAttribute('aria-label', 'Fechar imagem ampliada');
        closeBtn.innerHTML = '&times;';

        const caption = document.createElement('div');
        caption.className = 'aurora-lightbox-caption';
        caption.textContent = img.alt || 'Café Aurora';

        overlay.appendChild(bigImg);
        overlay.appendChild(closeBtn);
        overlay.appendChild(caption);
        document.body.appendChild(overlay);
        document.body.classList.add('aurora-lightbox-active');

        /* Dispara animação de entrada no próximo frame */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => overlay.classList.add('aurora-lightbox-open'));
        });

        const closeLightbox = () => {
          overlay.classList.remove('aurora-lightbox-open');
          setTimeout(() => {
            overlay.remove();
            document.body.classList.remove('aurora-lightbox-active');
            img.focus();
          }, 300);
        };

        overlay.addEventListener('click', (e) => {
          if (e.target === overlay || e.target === closeBtn) closeLightbox();
        });
        const escHandler = (e) => {
          if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escHandler);
          }
        };
        document.addEventListener('keydown', escHandler);
        closeBtn.focus();
      };

      img.addEventListener('click', openLightbox);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox();
        }
      });
    });
  };

  /* =========================================================
     SCROLL FADE — respeita prefers-reduced-motion
     ========================================================= */
  const setupScrollFade = () => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    sections.forEach((s) => s.classList.add('aurora-fade'));

    if (!('IntersectionObserver' in window) || reduceMotion) {
      sections.forEach((s) => s.classList.add('aurora-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aurora-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    /* Espera 2 frames antes de observar para o browser pintar o estado inicial */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sections.forEach((s) => observer.observe(s));
      });
    });
  };

  /* =========================================================
     Inicialização
     ========================================================= */
  const init = () => {
    setupLightbox();
    setupScrollFade();
    console.log('[Café Aurora] Customizações ativas ☕ (reduceMotion:', reduceMotion + ')');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
