---
title: "Kustom Disfraces"
tagline: "Headless online store for a costume shop in Bogotá, with a sales bot"
kind: case-study
status: "In production"
order: 3
stack: ["Nuxt 4", "Vue 3", "TypeScript", "WooCommerce", "Mercado Pago", "PostgreSQL", "Vercel"]
repo: "https://github.com/JuanchoVargas/ecommerce-disfraces"
live: "https://www.disfraceskustom.com"
cover: "../../../assets/projects/kustom-disfraces/01-inicio.png"
gallery:
  - src: "../../../assets/projects/kustom-disfraces/02-catalogo.png"
    alt: "Catalog of costumes for boys with filters by size, price and product line"
  - src: "../../../assets/projects/kustom-disfraces/03-producto.png"
    alt: "Product page with price, size selection, size guide and cart and WhatsApp buttons"
  - src: "../../../assets/projects/kustom-disfraces/04-carrito-checkout.png"
    alt: "Cart with the order summary and the step to payment"
  - src: "../../../assets/projects/kustom-disfraces/05-guia-tallas.png"
    alt: "Size guide with the measurement tables for each costume line"
  - src: "../../../assets/projects/kustom-disfraces/06-celular.png"
    alt: "The store on a phone: catalog, product page and size guide"
highlights:
  - "The server recalculates every price and rejects a mismatched payment"
  - "Exactly one order per payment, even with repeated notifications"
  - "One bot serves WhatsApp, Messenger and Instagram"
  - "Signed webhooks: no signature or no secret means a 401"
metrics:
  - value: "3"
    label: "messaging channels on one bot engine"
  - value: "18"
    label: "test scripts that run without credentials"
  - value: "1"
    label: "order per payment, enforced by a primary key"
---

## The problem

A costume shop in Bogotá needed to sell online without replacing the WooCommerce back end where its orders and stock already lived. Most customers ask on WhatsApp, Messenger or Instagram before they buy, and the team was answering every message by hand.

## What I built

A headless Nuxt 4 storefront deployed on Vercel. WooCommerce keeps orders and inventory, and PostgreSQL stores what WooCommerce does not model.

- A store with a catalog by audience and category, search, a size guide, a cart, and checkout with Mercado Pago or a hand-off to WhatsApp.
- A sales bot with typo-tolerant product search and size suggestions.
- An inbox to take over conversations from the three channels.
- An inventory panel with bulk edits previewed before they are applied.

## Security

- The browser only talks to the site itself; keys for WooCommerce, Mercado Pago, Meta and email live on the server.
- The payment webhook requires a valid, recent signature and then asks Mercado Pago for the real payment status.
- Meta webhooks are verified over the raw request body.
- The admin panel limits login attempts per IP and stores an HMAC of the IP, not the IP.
- Logs mask customer identifiers.

## Result

The store, checkout, bot and inbox are in production and used by the shop's team. Writing inventory straight to WooCommerce is built and is being enabled in stages. A test framework and continuous integration are the next steps.
