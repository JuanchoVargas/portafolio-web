// Eventos del DOM con los que se hablan las piezas de la portada. Todos suben
// por el árbol, así que quien escucha no necesita conocer a quien emite.

// Una hoja acaba de entrar a la vista. Lo emite la escena sobre la hoja.
export const SHEET_ENTER = 'sheet:enter';

// La demo de roles cambió de rol. El rol viaja en `detail.role`.
export const ROLE_EVENT = 'demo:role';

// El rol que cambia la pose del personaje por la alterna de la hoja.
export const ALT_ROLE = 'admin';
