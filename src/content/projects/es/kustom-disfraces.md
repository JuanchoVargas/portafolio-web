---
title: "Kustom Disfraces"
tagline: "Tienda en línea headless para un negocio de disfraces de Bogotá, con bot de ventas"
kind: case-study
status: "En producción"
order: 3
stack: ["Nuxt 4", "Vue 3", "TypeScript", "WooCommerce", "Mercado Pago", "PostgreSQL", "Vercel"]
repo: "https://github.com/JuanchoVargas/ecommerce-disfraces"
live: "https://www.disfraceskustom.com"
cover: "../../../assets/projects/kustom-disfraces/04-carrito-checkout.png"
gallery: []
highlights:
  - "El servidor recalcula cada precio por SKU y rechaza el pago si no coincide"
  - "Una sola orden por pago, aunque la pasarela envíe varias notificaciones a la vez"
  - "Un mismo motor de bot atiende WhatsApp, Messenger e Instagram y pasa a una persona cuando se pide"
  - "Webhooks firmados que fallan cerrados: sin firma o sin secreto responden 401"
metrics:
  - value: "3"
    label: "canales de mensajería con un solo motor de bot"
  - value: "18"
    label: "scripts de prueba que corren sin credenciales"
  - value: "1"
    label: "orden por pago, garantizada por una llave primaria"
---

## El problema

Un negocio de disfraces de Bogotá necesitaba vender en línea sin reemplazar el WooCommerce donde ya tenía sus órdenes y su inventario. La mayoría de los clientes pregunta por WhatsApp, Messenger o Instagram antes de comprar, y el equipo respondía cada mensaje a mano.

## Lo que construí

Una tienda headless en Nuxt 4 desplegada en Vercel. WooCommerce conserva las órdenes y el inventario; PostgreSQL guarda lo que WooCommerce no modela. La tienda tiene catálogo por público y categoría, buscador, guía de tallas, carrito y checkout con Mercado Pago o cierre del pedido por WhatsApp.

Alrededor de la tienda construí las herramientas con las que trabaja el equipo: un bot de ventas con búsqueda tolerante a errores de escritura y sugerencia de talla, una bandeja para tomar las conversaciones de los tres canales y un panel de inventario con edición masiva y vista previa antes de aplicar.

## Seguridad

El navegador solo habla con los endpoints del propio sitio. Las llaves de WooCommerce, Mercado Pago, Meta y el correo viven en el servidor, y WooCommerce tiene una llave de lectura y otra de escritura. El webhook de pagos exige una firma válida y reciente, y después consulta el estado real del pago en Mercado Pago en lugar de confiar en la notificación. Los webhooks de Meta se verifican sobre el cuerpo crudo. El panel admite cinco intentos de acceso por IP cada 15 minutos y guarda un HMAC de la IP, no la IP. Los logs enmascaran los identificadores de los clientes.

## Resultado

La tienda, el checkout, el bot y la bandeja están en producción y el equipo los usa. La escritura directa del inventario en WooCommerce está construida y se habilita por etapas. Los siguientes pasos son un framework de pruebas e integración continua.
