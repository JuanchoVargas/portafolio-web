---
title: "CRM de gestión comercial"
tagline: "CRM/ERP multi-tenant para distribuidoras: catálogo, precios, inventario, ventas y caja"
kind: source
status: "En operación con un cliente piloto"
order: 2
stack: [".NET 8", "ASP.NET Core", "EF Core", "SQL Server", "Vue 3", "xUnit"]
repo: "https://github.com/JuanchoVargas/crm-gestion-comercial"
live: "https://crm.nemedi.com"
cover: "../../../assets/projects/crm-gestion-comercial/01-panel.png"
gallery:
  - src: "../../../assets/projects/crm-gestion-comercial/02-cotizaciones.png"
    alt: "Listado de cotizaciones con su estado, el total y el pedido que generó cada una al aprobarse"
  - src: "../../../assets/projects/crm-gestion-comercial/03-pedidos.png"
    alt: "Pedidos con la ruta de despacho, el estado y los documentos de cotización y salida enlazados"
  - src: "../../../assets/projects/crm-gestion-comercial/04-consulta-precios.png"
    alt: "Consulta de precios de una lista: costo, precio de venta, cómo se calcula y un color según el margen"
  - src: "../../../assets/projects/crm-gestion-comercial/05-inventario-valorizado.png"
    alt: "Inventario valorizado a costo, con el total y el peso de cada marca"
  - src: "../../../assets/projects/crm-gestion-comercial/06-cartera.png"
    alt: "Cartera por cobrar con los saldos por antigüedad y los documentos pendientes de cada cliente"
highlights:
  - "Una sola instalación atiende a varias empresas, aisladas por 43 filtros globales de EF Core"
  - "Seguro por defecto: todo endpoint exige un usuario autenticado salvo que se marque como público"
  - "Borrado lógico que registra quién borró cada registro y cuándo"
  - "La API no arranca sin una clave de firma de JWT fuerte"
metrics:
  - value: "349"
    label: "pruebas automatizadas"
  - value: "43"
    label: "filtros globales por tenant"
  - value: "9"
    label: "módulos"
---

## El problema

Una distribuidora vende muchas marcas, cada una con sus presentaciones, márgenes y listas de precios, y despacha por rutas fijas. El inventario, las compras y la caja tienen que cuadrar con lo vendido. Quería una sola instalación que atendiera a varias empresas sin que sus datos se mezclaran.

## Lo que construí

Una API REST en ASP.NET Core con una SPA en Vue 3. Los módulos cubren el catálogo por marca con un asistente de parametrización, listas de precios con márgenes por marca, clientes con ruta de despacho derivada de la localidad, proveedores y órdenes de compra con sugerido, bodegas con kardex e inventario valorizado, cotizaciones, pedidos y venta de mostrador, caja con cierre diario, un panel de indicadores y usuarios. Productos, clientes y existencias se importan desde Excel con vista previa.

## Seguridad

Al iniciar sesión, la API emite un token con el claim del tenant. El contexto de base de datos lo lee en cada petición y lo aplica con filtros globales; si no hay tenant, las consultas no devuelven filas. Saltarse un filtro exige una llamada explícita en el código. Los controladores no borran registros físicamente. Las operaciones de administración piden roles específicos, y un filtro en el servidor decide qué controladores responden durante el piloto, porque ocultar un menú no es seguridad. Fuera de desarrollo, un error no controlado responde un mensaje genérico con un código de correlación y el detalle va solo al log.

## Resultado

El sistema está en operación con un cliente piloto y el código es público. Hay partes en desarrollo: las pantallas de empleados y de administración de tenants usan datos de ejemplo, las suscripciones están modeladas pero sin conectar, y el esquema actual de la base todavía no se reproduce desde el repositorio.
