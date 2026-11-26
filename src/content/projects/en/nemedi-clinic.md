---
title: "NemediClinic"
tagline: "Multi-tenant ERP/CRM that runs an aesthetic clinic, from the schedule to the cash drawer"
kind: source
status: "In production"
order: 1
stack: [".NET 10", "ASP.NET Core", "EF Core", "SQL Server", "React 19", "TypeScript", "xUnit", "Playwright"]
repo: "https://github.com/JuanchoVargas/nemedi-clinic"
live: "https://clinic.nemedi.com"
cover: "../../../assets/projects/nemedi-clinic/01-dashboard.png"
gallery:
  - src: "../../../assets/projects/nemedi-clinic/02-calendario.png"
    alt: "Day view of the clinic calendar with appointments per aesthetician, one of them cancelled"
  - src: "../../../assets/projects/nemedi-clinic/04-nueva-venta.png"
    alt: "New sale screen combining a product and a procedure, with per-line VAT and a partial cash payment"
  - src: "../../../assets/projects/nemedi-clinic/06-arqueo-caja.png"
    alt: "Cash count dialog comparing expected cash against the amount counted before closing the drawer"
  - src: "../../../assets/projects/nemedi-clinic/07-inventario-alertas.png"
    alt: "Inventory alerts listing expired batches and batches close to their expiry date"
highlights:
  - "Each clinic’s data isolated, proven by an end-to-end test"
  - "Clinical photos only through signed links that expire in 10 minutes"
  - "Every request re-checks the account, the role and the clinic"
  - "Batch inventory: what expires first leaves first"
metrics:
  - value: "313"
    label: "automated tests"
  - value: "3"
    label: "roles per clinic"
  - value: "10 min"
    label: "signed file URL lifetime"
---

## The problem

An aesthetic clinic usually runs on a paper appointment book, a spreadsheet for stock and a notebook for cash. Patient records hold health data and photos, so a shared system has to keep each clinic's data apart.

## What I built

A web application where each clinic is a tenant with its own branches and three roles: owner, front desk and aesthetician.

- Patient records, clinical history with photo comparison and consent signed on screen.
- Scheduling and session packages.
- Batch inventory with expiry alerts.
- Sales with per-line VAT and a cash drawer per user and branch.

An ASP.NET Core API on SQL Server and a React SPA that works on a phone and installs as a PWA. A platform level manages the clinics and white-label sales channels.

## Security

- The tenant travels in the JWT and a global query filter applies it to every query; it is never read from the request.
- Roles are enforced on the server.
- Passwords hashed with BCrypt, login attempts limited per IP and per account, and billing credentials encrypted with AES-GCM.
- Uploaded images are validated by content and stripped of metadata.
- In production the API refuses to start with a weak signing key or wildcard CORS.

## Result

The system is in production and the code is public. Electronic invoicing is still in development: the provider integration exists, but the end-to-end flow has not been validated. Access auditing is planned next.
