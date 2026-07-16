# Prototipos funcionales (referencia visual autoritativa)

Estos 3 archivos son bundles autocontenidos (fuentes e imágenes embebidas en
base64, sin dependencias externas de red salvo React/ReactDOM/Babel por CDN) del
prototipo de SiloGuard hecho en Claude Design. Se abren directo con doble clic o
`file://` en cualquier navegador y son **totalmente funcionales y navegables**
(tienen una barra de pestañas arriba de cada pantalla para saltar entre vistas).

- `app-screens.html` — Dashboard, Detalle de silo, Agregar/Editar silo, Alertas,
  Detalle de alerta, Contactar técnico, Pasaporte de calidad, Perfil, Historial,
  Umbrales.
- `autenticacion.html` — Splash, Welcome (carrusel), Login, Registro (2 pasos),
  Verificar email, Recuperar contraseña.
- `onboarding.html` — Permisos, Vincular lanza (QR + WiFi + asignación), Tutorial.

## Por qué existen (y por qué no los `.html` de `../screens` y `../templates`)

Los `App Screens.html` (en `../screens/`) y los `*.dc.html` (en `../templates/`)
son exports de Claude Design que dependen de archivos (`_ds_bundle.js`,
`styles.css`, `tokens/*.css`, `assets/logo-mark.svg`) que **no existen en este
repo** con las rutas que ellos esperan. Al abrirlos en un navegador quedan en
pantalla negra o trabados en el spinner de carga — nunca renderizaron. Se
comprobó abriéndolos con Playwright y viendo los `net::ERR_FILE_NOT_FOUND` en
consola.

Esos archivos **no se borran** — los `.jsx` que los acompañan (`profile-screens.jsx`,
`pasaporte-screens.jsx`, `mock-data.js`, etc.) siguen siendo spec de código legible
y útil. Lo que estaba roto era únicamente el wrapper HTML para verlos renderizados.

## Cómo usarlos

Para comparar una pantalla de la app contra el prototipo: abrir el `.html`
correspondiente en un navegador, click en la pestaña de la pantalla en cuestión
arriba del mockup del teléfono, y comparar. No editar el JSX/HTML de estos
archivos ni copiarlo literal al código de la app — son solo referencia visual;
la implementación real vive en `src/` usando primitivos de React Native.
