---
title: "Sales Management CRM"
tagline: "Multi-tenant CRM/ERP for distributors: catalog, pricing, stock, sales and cash"
kind: source
status: "Live with a pilot customer"
order: 2
stack: [".NET 8", "ASP.NET Core", "EF Core", "SQL Server", "Vue 3", "xUnit"]
repo: "https://github.com/JuanchoVargas/crm-gestion-comercial"
live: "https://crm.nemedi.com"
cover: "../../../assets/projects/crm-gestion-comercial/01-panel.png"
gallery:
  - src: "../../../assets/projects/crm-gestion-comercial/02-cotizaciones.png"
    alt: "List of quotes with their status, total and the order each one produced when approved"
  - src: "../../../assets/projects/crm-gestion-comercial/03-pedidos.png"
    alt: "Orders with the delivery route, the status and the linked quote and dispatch documents"
  - src: "../../../assets/projects/crm-gestion-comercial/04-consulta-precios.png"
    alt: "Price lookup for a price list: cost, sale price, how it is calculated and a color for the margin"
  - src: "../../../assets/projects/crm-gestion-comercial/05-inventario-valorizado.png"
    alt: "Inventory valued at cost, with the total and the share of each brand"
  - src: "../../../assets/projects/crm-gestion-comercial/06-cartera.png"
    alt: "Accounts receivable with balances by age and the open documents of each customer"
highlights:
  - "One installation serves several companies, isolated by 43 global EF Core query filters"
  - "Secure by default: every endpoint requires an authenticated user unless it is explicitly public"
  - "Soft delete that records who deleted each record and when"
  - "The API will not start without a strong JWT signing key"
metrics:
  - value: "349"
    label: "automated tests"
  - value: "43"
    label: "global tenant filters"
  - value: "9"
    label: "modules"
---

## The problem

A distributor sells many brands, each with its own pack sizes, margins and price lists, and delivers along fixed routes. Stock, purchasing and cash have to agree with what was sold. I wanted one installation that could serve several companies without their data ever mixing.

## What I built

A REST API in ASP.NET Core with a Vue 3 single-page app. The modules cover the catalog by brand with a setup wizard, price lists with margins per brand, customers with a delivery route derived from their district, suppliers and purchase orders with suggested quantities, warehouses with stock ledger and inventory valuation, quotes, orders and counter sales, cash accounts with a daily close, a dashboard and user management. Products, customers and stock can be imported from Excel with a preview.

## Security

On login the API issues a token carrying the tenant claim. The database context reads it on every request and applies it through global query filters; with no tenant, queries return no rows. Skipping a filter requires an explicit call in the code. Controllers never delete rows physically. Admin operations require specific roles, and a server-side filter decides which controllers respond during the pilot, because hiding a menu is not a security control. Outside development, an unhandled error returns a generic response with a correlation code and the details go only to the log.

## Result

The system runs with a pilot customer and the code is public. Some parts are still in development: the employees and tenant administration screens use sample data, subscriptions are modelled but not wired in, and the current database schema is not yet reproducible from the repository.
