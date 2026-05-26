# ☕ Café Aurora — Site Institucional

Projeto acadêmico da disciplina **Padrões Web para No Code e Low Code** — UniFECAF.
Site institucional de uma cafeteria fictícia construído com **Webflow** e personalizado com **JavaScript customizado** hospedado em GitHub + jsDelivr CDN.

---

## 🔗 Links

- **🌐 Site publicado:** https://cafe-aurora-477f44.webflow.io/
- **💻 Repositório do JS customizado:** https://github.com/lukasfkt/cafe-aurora
- **📦 JS servido via CDN:** https://cdn.jsdelivr.net/gh/lukasfkt/cafe-aurora@main/cafe-aurora.js

---

## 🎯 Sobre o Projeto

### Finalidade

Site institucional one-page para uma cafeteria artesanal urbana, voltado a pequenos negócios locais que querem presença digital sem orçamento para contratar desenvolvedores. Permite que clientes conheçam o espaço, vejam o cardápio, encontrem a localização e façam reserva online.

### Público-alvo

Jovens adultos urbanos (20–40 anos) que buscam um ambiente aconchegante para trabalhar, conversar ou consumir café e padaria artesanais.

### Estrutura (one-page)

| Seção         | ID             | Conteúdo                                                                |
| ------------- | -------------- | ----------------------------------------------------------------------- |
| Sobre         | `#sobre`       | História da cafeteria + galeria com **lightbox interativo** (3 imagens) |
| Cardápio      | `#cardapio`    | Vitrine de produtos com fotos, descrições e preços                      |
| Espaço        | `#espaco`      | Galeria do ambiente físico                                              |
| Avaliações    | `#avaliacoes`  | Depoimentos de clientes                                                 |
| Localização   | `#localizacao` | Endereço, contato, horário, mapa                                        |
| Reservar mesa | `#reserva`     | Formulário nativo do Webflow (8 campos)                                 |

---

## ✨ Funcionalidades

### Construído visualmente no Webflow

- ✅ Layout responsivo mobile-first (4 breakpoints)
- ✅ Estrutura semântica (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- ✅ Design tokens hierárquicos auto-gerados (`--_colors---core-accent-color--accent-primary`, etc.)
- ✅ Navbar fixa com menu hambúrguer em mobile
- ✅ Formulário de reserva nativo (recebe envios no painel do Webflow, até 50/mês no plano gratuito)
- ✅ Acessibilidade básica: `lang="pt-BR"`, alt em imagens, hierarquia de headings

### Adicionado via JavaScript customizado (cafe-aurora.js)

1. **🖼️ Lightbox nas imagens do #sobre**
   Clica numa imagem da seção "Sobre" → abre modal em tela cheia com fade-in.
   Fecha por clique fora, botão ×, ou tecla **ESC**.
   Totalmente acessível: `role="dialog"`, `aria-modal`, gestão de foco, navegação por Tab/Enter/Espaço.

2. **✨ Hover sutil nas imagens**
   `cursor: zoom-in` + filtro de brilho + sombra suave indicam que as imagens são clicáveis.

3. **☕ Widget de cotação do mercado do café**
   Consome a **API pública AwesomeAPI** (`https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL`) e exibe as cotações de USD/BRL e EUR/BRL — referências relevantes para a exportação do café arábica brasileiro. O widget aparece como um card flutuante no canto inferior direito da tela e pode ser fechado.

---

## 🧰 Stack

| Camada                 | Tecnologia                                                     |
| ---------------------- | -------------------------------------------------------------- |
| Estrutura visual       | **Webflow** (plano gratuito, subdomínio `.webflow.io`)         |
| Design system          | Design tokens automáticos gerados pelo Webflow AI              |
| Fontes                 | Lexend (títulos), Instrument Sans (corpo) — Google Fonts       |
| JavaScript customizado | Vanilla JS (sem libs), IIFE, ES2020+                           |
| Hospedagem do JS       | **GitHub** (repositório público) + **jsDelivr CDN** (gratuita) |
| Integração de API      | **AwesomeAPI** (cotações de moedas, sem autenticação)          |
| Formulário             | Webflow Forms (recebimento nativo, sem servidor)               |

---

## 📁 Estrutura do repositório

```
cafe-aurora/
├── README.md         # Este arquivo — documentação do projeto
├── cafe-aurora.js    # JavaScript customizado servido via jsDelivr CDN
└── prints/           # Screenshots da aplicação publicada
    ├── 01-sobre.png
    ├── 02-lightbox.png
    ├── 03-cardapio.png
    ├── 04-espaco.png
    ├── 05-avaliacoes.png
    ├── 06-localizacao.png
    ├── 07-formulario.png
    └── 08-mobile.png
```

---

## 🚀 Como usar

### Para visualizar o site

Abra https://cafe-aurora-477f44.webflow.io/ em qualquer navegador moderno.

### Para testar o lightbox

1. Role até a seção **Sobre**
2. Clique em qualquer uma das 3 imagens
3. A imagem ampliada aparece em modal
4. Feche clicando fora, no botão × no canto, ou pressionando **ESC**
5. Navegue por teclado: **Tab** até a imagem, depois **Enter** ou **Espaço** para abrir

### Para testar o widget de cotação

- Logo após carregar o site, um card flutuante aparece no canto inferior direito mostrando USD/BRL e EUR/BRL atualizados em tempo real
- Os valores são consumidos da API pública AwesomeAPI a cada carregamento da página
- Clique no × dentro do widget para fechá-lo

### Para testar o formulário de reserva

1. Role até a seção **Reservar mesa**
2. Preencha os campos (Nome, E-mail, Telefone, Data, Horário, Nº de pessoas, Observações, LGPD)
3. Clique em **Reservar** → o envio cai no painel **Forms** do projeto Webflow
4. O dono do projeto recebe notificação por e-mail

---

## 🛠️ Como o JavaScript foi integrado ao Webflow

O plano gratuito do Webflow **não permite** Custom Code no Project Settings nem o uso do componente HTML Embed. A solução adotada foi:

1. **Hospedagem externa** — o arquivo `cafe-aurora.js` está versionado em um repositório público no GitHub.
2. **CDN gratuita** — o **jsDelivr** serve automaticamente qualquer arquivo público do GitHub.
3. **DOM panel do Webflow** — no Designer, criei um elemento `<div>` e usei o painel **DOM** para alterar a tag para `<script>` e adicionar o atributo `src` apontando para a CDN.
4. **Versionamento por commit hash** — uso `cafe-aurora@<hash>` na URL em vez de `@main`, garantindo que a versão exata carregue (sem problemas de cache do jsDelivr).

URL final no Webflow:

```html
<script src="https://cdn.jsdelivr.net/gh/lukasfkt/cafe-aurora@<commit-hash>/cafe-aurora.js"></script>
```

---

## 🔧 Como atualizar o JavaScript

1. Edita o arquivo `cafe-aurora.js` (local ou direto no GitHub)
2. Faz commit das mudanças no repositório `lukasfkt/cafe-aurora`
3. Pega o hash do novo commit (visível em `https://github.com/lukasfkt/cafe-aurora/commits/main`)
4. No Webflow Designer, atualiza o atributo `src` do `<script>` para apontar para o novo hash
5. Publica o site

---

## ♿ Acessibilidade aplicada

- `lang="pt-BR"` na tag `<html>`
- Hierarquia de headings: `h1` único, `h2` em cada seção, `h3` em cards
- Atributo `alt` descritivo em todas as imagens
- Formulário com labels associadas via `for`/`id`
- Lightbox totalmente acessível: `role="dialog"`, `aria-modal="true"`, gestão de foco automática, abre com Enter/Espaço, fecha com ESC
- Widget de cotação com `role="status"` e `aria-label`
- Contraste de cores AA
- Animações user-initiated (cliques, hovers) — funcionam mesmo para usuários com `prefers-reduced-motion: reduce` ativado

---

## 📸 Screenshots

Os screenshots do site publicado estão disponíveis na pasta [`prints/`](./prints/):

| #   | Arquivo              | Conteúdo                                |
| --- | -------------------- | --------------------------------------- |
| 1   | `01-sobre.png`       | Seção Sobre com a galeria de 3 imagens  |
| 2   | `02-lightbox.png`    | Lightbox aberto após clicar numa imagem |
| 3   | `03-cardapio.png`    | Vitrine de produtos                     |
| 4   | `04-espaco.png`      | Galeria do ambiente                     |
| 5   | `05-avaliacoes.png`  | Depoimentos de clientes                 |
| 6   | `06-localizacao.png` | Endereço, contato e horários            |
| 7   | `07-formulario.png`  | Formulário de reserva                   |
| 8   | `08-mobile.png`      | Versão mobile (414px)                   |

---

## 📜 Créditos

- Plataforma: [Webflow](https://webflow.com/) (Starter plan — grátis)
- Hospedagem do JS: [GitHub](https://github.com/) + [jsDelivr](https://www.jsdelivr.com/)
- API de cotações: [AwesomeAPI](https://docs.awesomeapi.com.br/) (sem cadastro)
- Imagens: AI-generated via Webflow + Unsplash
- Fontes: [Google Fonts](https://fonts.google.com/) — Lexend + Instrument Sans
- Ícones e SVGs: nativos do Webflow

---

## 👨‍🎓 Autor

**Lucas Kavada**
Disciplina: Padrões Web para No Code e Low Code
UniFECAF — 2026
