---
title: "NemediClinic"
tagline: "ERP/CRM multi-tenant para clínicas estéticas: de la agenda a la caja"
kind: source
status: "En producción"
order: 1
stack: [".NET 10", "ASP.NET Core", "EF Core", "SQL Server", "React 19", "TypeScript", "xUnit", "Playwright"]
repo: "https://github.com/JuanchoVargas/nemedi-clinic"
live: "https://clinic.nemedi.com"
cover: "../../../assets/projects/nemedi-clinic/01-dashboard.png"
gallery:
  - src: "../../../assets/projects/nemedi-clinic/02-calendario.png"
    alt: "Vista diaria del calendario de la clínica con las citas por esteticista, una de ellas cancelada"
  - src: "../../../assets/projects/nemedi-clinic/04-nueva-venta.png"
    alt: "Pantalla de nueva venta con un producto y un procedimiento, IVA por línea y un abono en efectivo"
  - src: "../../../assets/projects/nemedi-clinic/06-arqueo-caja.png"
    alt: "Diálogo de arqueo que compara el efectivo esperado con el contado antes de cerrar la caja"
  - src: "../../../assets/projects/nemedi-clinic/07-inventario-alertas.png"
    alt: "Alertas de inventario con los lotes vencidos y los que están por vencer"
highlights:
  - "Aislamiento entre clínicas con un filtro global de EF Core, comprobado por una prueba de extremo a extremo con dos clínicas"
  - "Las fotos clínicas solo se entregan con URL firmada con HMAC que vence a los 10 minutos"
  - "Cada petición autenticada vuelve a validar la cuenta, su rol y el estado de la clínica"
  - "Inventario por lotes con salida del que vence primero y reporte de trazabilidad sanitaria"
metrics:
  - value: "313"
    label: "pruebas automatizadas"
  - value: "3"
    label: "roles por clínica"
  - value: "10 min"
    label: "vigencia de la URL firmada de un archivo"
---

## El problema

Una clínica estética en Colombia suele llevar la agenda en papel, el inventario en una hoja de cálculo y la caja en un cuaderno. La historia de cada paciente tiene datos de salud y fotos de antes y después, así que un sistema compartido debe aislar los datos de cada clínica.

## Lo que construí

Una aplicación web donde cada clínica es un tenant con sus sedes y tres roles: dueño, recepción y esteticista. Cubre pacientes con importación desde Excel o CSV, historia clínica con comparador de fotos, consentimiento con firma en pantalla, agenda, paquetes de sesiones, inventario por lotes con alertas de vencimiento, ventas con IVA por línea y varios medios de pago, y caja por usuario y sede. Por encima, un nivel de plataforma administra las clínicas y los canales comerciales con marca blanca.

El backend es una API por capas en ASP.NET Core sobre SQL Server. El frontend es una SPA en React que funciona en celular y se instala como PWA.

## Seguridad

El tenant viaja en el JWT y un filtro global lo aplica, junto con el borrado lógico, a todas las consultas. El tenant se asigna al guardar y nunca se toma de la petición. Los roles se validan en el servidor. Las contraseñas se guardan con BCrypt, el inicio de sesión limita los intentos por IP y por cuenta, y las credenciales de facturación se cifran con AES-GCM. Las imágenes se validan por su contenido y se les quitan los metadatos EXIF, IPTC y XMP. En producción la API no arranca con una clave de firma débil ni con CORS con comodines.

## Resultado

El sistema está en producción y el código es público. La facturación electrónica sigue en desarrollo: la integración existe, pero el flujo completo no está validado. Sigue la auditoría de accesos.
