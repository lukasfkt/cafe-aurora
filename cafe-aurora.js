/* =========================================================
   Café Aurora — JavaScript customizado
   Hospedado externamente (jsDelivr / GitHub)
   Carregado no Webflow via DOM tag <script src="...">

   Funcionalidades:
   1. Lightbox: clique em imagens do #sobre para ampliar em modal
   2. Hover sutil nas imagens (brightness + sombra)
   3. Widget de cotação do mercado do café (consome API AwesomeAPI)
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
    .aurora-lightbox.aurora-lightbox-open { opacity: 1; }
    .aurora-lightbox img {
      max-width: 90vw;
      max-height: 85vh;
      border-radius: .75rem;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      transform: scale(0.96);
      transition: transform .35s cubic-bezier(.16, 1, .3, 1);
    }
    .aurora-lightbox.aurora-lightbox-open img { transform: scale(1); }
    .aurora-lightbox-close {
      position: absolute; top: 1.5rem; right: 1.5rem;
      background: rgba(255, 255, 255, 0.15); color: #fff;
      border: 2px solid rgba(255, 255, 255, 0.3);
      width: 48px; height: 48px; border-radius: 50%;
      font-size: 1.5rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s ease, transform .2s ease;
    }
    .aurora-lightbox-close:hover,
    .aurora-lightbox-close:focus-visible {
      background: rgba(255, 255, 255, 0.3); transform: scale(1.1);
    }
    .aurora-lightbox-caption {
      position: absolute; bottom: 2rem; left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.85);
      font-size: .95rem; max-width: 80%; text-align: center;
      background: rgba(0, 0, 0, 0.4);
      padding: .6rem 1.2rem; border-radius: 999px;
    }
    body.aurora-lightbox-active { overflow: hidden; }

    /* Widget de cotação do mercado do café */
    .aurora-market-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #2b1a10 0%, #5a3a25 100%);
      color: #f4ece2;
      padding: 14px 18px;
      border-radius: 14px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      z-index: 9998;
      max-width: 280px;
      border: 1px solid rgba(217, 194, 167, 0.2);
      backdrop-filter: blur(8px);
      transform: translateY(20px);
      opacity: 0;
      transition: transform .6s cubic-bezier(.16,1,.3,1), opacity .6s ease;
    }
    .aurora-market-widget.is-visible {
      transform: translateY(0);
      opacity: 1;
    }
    .aurora-market-widget__title {
      font-weight: 600;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }
    .aurora-market-widget__row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin: 4px 0;
    }
    .aurora-market-widget__label { opacity: 0.75; font-size: 11px; }
    .aurora-market-widget__value { font-weight: 600; color: #fff; }
    .aurora-market-widget__var { font-weight: 600; font-size: 12px; }
    .aurora-market-widget__var.positive { color: #4ade80; }
    .aurora-market-widget__var.negative { color: #f87171; }
    .aurora-market-widget__hint {
      font-size: 10px;
      opacity: 0.65;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(217, 194, 167, 0.15);
      line-height: 1.4;
    }
    .aurora-market-widget__close {
      position: absolute;
      top: 6px;
      right: 8px;
      background: none;
      border: none;
      color: rgba(244, 236, 226, 0.6);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 4px;
    }
    .aurora-market-widget__close:hover { color: #fff; }
    @media (max-width: 480px) {
      .aurora-market-widget {
        bottom: 12px; right: 12px; left: 12px;
        max-width: none;
      }
    }
  `;
  document.head.appendChild(style);

  /* =========================================================
     Lightbox — clique nas imagens do #sobre
     ========================================================= */
  const setupLightbox = () => {
    const sobre = document.getElementById('sobre');
    if (!sobre) return;

    const images = sobre.querySelectorAll('img');
    if (!images.length) return;

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
     Widget de cotação do mercado do café
     Consome AwesomeAPI (USD-BRL e EUR-BRL) — referências
     globais do mercado do café arábica brasileiro
     ========================================================= */
  const setupMarketWidget = async () => {
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL');
      if (!res.ok) throw new Error('Resposta da API não-OK: ' + res.status);

      const data = await res.json();
      const usd = data.USDBRL;
      const eur = data.EURBRL;

      if (!usd || !eur) throw new Error('Cotações ausentes na resposta');

      const formatBRL = (n) => `R$ ${parseFloat(n).toFixed(2).replace('.', ',')}`;
      const formatVar = (pct) => {
        const v = parseFloat(pct);
        const arrow = v >= 0 ? '▲' : '▼';
        const cls = v >= 0 ? 'positive' : 'negative';
        return `<span class="aurora-market-widget__var ${cls}">${arrow} ${Math.abs(v).toFixed(2)}%</span>`;
      };

      const updatedAt = new Date(parseInt(usd.timestamp) * 1000)
        .toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

      const widget = document.createElement('div');
      widget.className = 'aurora-market-widget';
      widget.setAttribute('role', 'status');
      widget.setAttribute('aria-label', 'Cotação do mercado do café');
      widget.innerHTML = `
        <button class="aurora-market-widget__close" aria-label="Fechar widget">&times;</button>
        <div class="aurora-market-widget__title">☕ Mercado do Café</div>
        <div class="aurora-market-widget__row">
          <span class="aurora-market-widget__label">USD/BRL</span>
          <span><span class="aurora-market-widget__value">${formatBRL(usd.bid)}</span> ${formatVar(usd.pctChange)}</span>
        </div>
        <div class="aurora-market-widget__row">
          <span class="aurora-market-widget__label">EUR/BRL</span>
          <span><span class="aurora-market-widget__value">${formatBRL(eur.bid)}</span> ${formatVar(eur.pctChange)}</span>
        </div>
        <div class="aurora-market-widget__hint">
          Cotações de referência para a exportação do café arábica brasileiro.<br>
          Atualizado: ${updatedAt}
        </div>
      `;

      document.body.appendChild(widget);

      const closeBtn = widget.querySelector('.aurora-market-widget__close');
      closeBtn.addEventListener('click', () => {
        widget.classList.remove('is-visible');
        setTimeout(() => widget.remove(), 600);
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => widget.classList.add('is-visible'));
      });

      console.log('[Aurora] Widget de cotação carregado (USD:', usd.bid, '| EUR:', eur.bid, ')');
    } catch (err) {
      console.warn('[Aurora] Não foi possível carregar cotação:', err.message);
    }
  };

  /* =========================================================
     Inicialização
     ========================================================= */
  const init = () => {
    setupLightbox();
    setupMarketWidget();
    console.log('[Café Aurora] Customizações ativas ☕');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
