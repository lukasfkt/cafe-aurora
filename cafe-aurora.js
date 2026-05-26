/* =========================================================
   Café Aurora — JavaScript customizado
   Hospedado externamente (jsDelivr / GitHub)
   Carregado no Webflow via DOM tag <script src="...">

   Funcionalidades (todas restritas à seção #sobre):
   1. Hover sutil nas imagens (brightness + sombra)
   2. Lightbox: clique nas imagens para ampliar em modal
   ========================================================= */

(() => {
  'use strict';

  /* =========================================================
     CSS customizado — !important para vencer o Webflow
     ========================================================= */
  const style = document.createElement('style');
  style.id = 'aurora-customizations-css';
  style.textContent = `
    /* Hover sutil nas imagens do #sobre */
    #sobre img {
      cursor: zoom-in !important;
      filter: brightness(0.95);
      transition: filter .3s ease, box-shadow .3s ease !important;
    }
    #sobre img:hover,
    #sobre img:focus-visible {
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
  `;
  document.head.appendChild(style);

  /* =========================================================
     Lightbox — só nas imagens do #sobre
     Acionado por clique do usuário (user-initiated),
     funciona mesmo com prefers-reduced-motion ativado.
     ========================================================= */
  const init = () => {
    const sobre = document.getElementById('sobre');
    if (!sobre) {
      console.warn('[Aurora] #sobre não encontrado.');
      return;
    }

    const images = sobre.querySelectorAll('img');
    if (!images.length) {
      console.warn('[Aurora] Nenhuma imagem encontrada no #sobre.');
      return;
    }

    console.log('[Aurora] Lightbox configurado em', images.length, 'imagens do #sobre');

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

    console.log('[Café Aurora] Customizações ativas ☕');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
