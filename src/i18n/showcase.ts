// Lo que se muestra en celular en lugar de las demos interactivas: una vitrina
// de lo que se puede construir, contada desde el negocio y no desde la técnica.
export const showcase = {
  en: {
    demoEyebrow: 'What I can build',
    demoTitle: 'For your business, up and running.',
    demoSay: 'I can set this up for your business.',
    securitySay: 'Your data stays under lock and key.',
    cards: [
      {
        title: 'A store that sells on its own',
        text: 'Catalog, cart and online payments. A bot answers on WhatsApp, suggests the size and hands over to a person when needed.',
      },
      {
        title: 'A calendar with no double bookings',
        text: 'Appointments per professional, stock that warns you before it runs out, and a till that balances at closing.',
      },
      {
        title: 'Quotes in a minute',
        text: 'Each customer has their own price list, and an approved quote becomes an order with no retyping.',
      },
      {
        title: 'Your numbers at a glance',
        text: 'Sales, receivables and stock on one dashboard, always up to date.',
      },
    ],
    swipe: 'swipe to see more',
    desktop: 'On a computer you can try these features live.',
    want: 'I want something like this',
    quote: 'Hi Juan Diego. I saw your portfolio and I want something like this for: ',
    securityEyebrow: 'Security',
    securityTitle: 'Your data, well looked after.',
    points: [
      {
        title: 'Everyone sees only their own',
        text: 'Permissions by role, checked on the server and not just on the screen.',
      },
      {
        title: 'Each customer, isolated',
        text: 'One company’s data never mixes with another’s.',
      },
      {
        title: 'Payments that cannot be tampered with',
        text: 'The server calculates the price and every payment is verified with the provider.',
      },
    ],
  },
  es: {
    demoEyebrow: 'Lo que puedo construir',
    demoTitle: 'Para tu negocio, funcionando.',
    demoSay: 'Esto lo puedo montar en tu negocio.',
    securitySay: 'Tus datos quedan bajo llave.',
    cards: [
      {
        title: 'Una tienda que vende sola',
        text: 'Catálogo, carrito y pagos en línea. Un bot responde por WhatsApp, sugiere la talla y pasa a una persona cuando hace falta.',
      },
      {
        title: 'Agenda sin cruces',
        text: 'Citas por profesional, inventario que avisa antes de agotarse y caja que cuadra al cierre.',
      },
      {
        title: 'Cotizaciones en un minuto',
        text: 'Cada cliente con su lista de precios, y la cotización aprobada se vuelve pedido sin volver a digitar.',
      },
      {
        title: 'Tus números a la vista',
        text: 'Ventas, cartera e inventario en un solo tablero, siempre al día.',
      },
    ],
    swipe: 'desliza para ver más',
    desktop: 'En un computador puedes probar estas funciones en vivo.',
    want: 'Quiero algo así',
    quote: 'Hola, Juan Diego. Vi tu portafolio y quiero algo así para: ',
    securityEyebrow: 'Seguridad',
    securityTitle: 'Tus datos, bien cuidados.',
    points: [
      {
        title: 'Cada persona ve solo lo suyo',
        text: 'Permisos por rol, validados en el servidor y no solo en la pantalla.',
      },
      {
        title: 'Cada cliente, aislado',
        text: 'Los datos de una empresa nunca se cruzan con los de otra.',
      },
      {
        title: 'Pagos que no se pueden alterar',
        text: 'El precio lo calcula el servidor y cada pago se verifica con la pasarela.',
      },
    ],
  },
} as const;
