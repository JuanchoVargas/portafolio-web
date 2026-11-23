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
  - "Tenant isolation enforced by a global EF Core filter and proven by an end-to-end test with two clinics"
  - "Clinical photos served only through HMAC-signed URLs that expire after 10 minutes"
  - "Every authenticated request re-checks the account, its role and the clinic's status"
  - "Batch inventory with first-expired-first-out picking and a health traceability report"
metrics:
  - value: "313"
    label: "automated tests"
  - value: "3"
    label: "roles per clinic"
  - value: "10 min"
    label: "signed file URL lifetime"
---

## The problem

An aesthetic clinic in Colombia usually runs on a paper agenda, a spreadsheet for stock and a notebook for cash. Patient records hold health data and before-and-after photos, so a shared system has to keep each clinic's data strictly apart from everyone else's.

## What I built

A web application where each clinic is a tenant with its own branches and three roles: owner, front desk and aesthetician. It covers patients and bulk import from Excel or CSV, clinical history with photo comparison, informed consent signed on screen, scheduling, session packages, batch inventory with expiry alerts, sales with per-line VAT and split payments, and a cash drawer per user and branch. A platform level above the clinics manages accounts and white-label sales channels.

The backend is a layered ASP.NET Core API on SQL Server. The frontend is a React SPA that works on a phone and installs as a PWA.

## Security

The tenant travels in the JWT and a global query filter applies it, together with soft delete, to every query. The tenant ID is set on save and never read from the request body. Roles are enforced on the server. Passwords are hashed with BCrypt, login attempts are rate limited per IP and per account, and third-party billing credentials are stored encrypted with AES-GCM. Uploaded images are validated by content and stripped of EXIF, IPTC and XMP metadata. In production the API refuses to start with a weak signing key or wildcard CORS.

## Result

The system is in production and the code is public. Electronic invoicing is still in development: the provider integration exists, but the end-to-end flow has not been validated. Access auditing is planned next.
