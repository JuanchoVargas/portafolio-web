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
  - "Una instalación atiende a varias empresas, aisladas por 43 filtros"
  - "Seguro por defecto: todo endpoint exige un usuario autenticado"
  - "Borrado lógico: queda quién borró cada registro y cuándo"
  - "La API no arranca sin una clave de firma fuerte"
metrics:
  - value: "349"
    label: "pruebas automatizadas"
  - value: "43"
    label: "filtros globales por tenant"
  - value: "9"
    label: "módulos"
---

## El problema

Una distribuidora vende muchas marcas, cada una con sus presentaciones, márgenes y listas de precios, y despacha por rutas fijas. Inventario, compras y caja tienen que cuadrar con lo vendido, y una sola instalación debía atender a varias empresas sin mezclar sus datos.

## Lo que construí

Una API REST en ASP.NET Core con una SPA en Vue 3. Productos, clientes y existencias se importan desde Excel con vista previa.

- Catálogo por marca y listas de precios con márgenes.
- Clientes con ruta de despacho, proveedores y órdenes de compra con sugerido.
- Bodegas con kardex e inventario valorizado.
- Cotizaciones, pedidos y venta de mostrador.
- Caja con cierre diario, panel de indicadores y usuarios.

## Seguridad

- El token lleva el tenant y el contexto de datos lo aplica con filtros globales; sin tenant, las consultas no devuelven filas.
- Saltarse un filtro exige una llamada explícita en el código.
- Los controladores no borran registros físicamente.
- La administración pide roles específicos, y un filtro en el servidor decide qué responde durante el piloto: ocultar un menú no es seguridad.
- Un error no controlado responde un mensaje genérico con un código de correlación; el detalle va solo al log.

## Resultado

El sistema está en operación con un cliente piloto y el código es público. Hay partes en desarrollo: las pantallas de empleados y de administración de tenants usan datos de ejemplo, las suscripciones están modeladas pero sin conectar, y el esquema actual de la base todavía no se reproduce desde el repositorio.
