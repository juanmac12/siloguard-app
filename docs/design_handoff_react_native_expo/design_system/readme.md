# SiloGuard — Design System

> Sistema de diseño para **SiloGuard**, una app móvil de monitoreo inteligente
> de granos almacenados para productores agropecuarios.

---

## 1 · Product context

SiloGuard es una aplicación móvil que se apoya en una **lanza con sensores**
clavada sobre el silo o silobolsa. La lanza mide en tiempo real **temperatura,
humedad y CO₂** — los parámetros que determinan la salud del grano — y transmite
los datos por WiFi a la app, donde una **IA** detecta condiciones anómalas
(fermentación, calentamiento, inicio de pudrición) y dispara una **alerta con al
menos 48 hs de anticipación** antes de que el deterioro sea irreversible.

El usuario es el **productor** (único rol del MVP). El producto es **iOS +
Android**, dark-first. Núcleo funcional: Dashboard multi-silo · Detalle del silo ·
Historial de sensores · Alertas (Crítica / Advertencia / Resuelta) · Vinculación
de lanza IoT · Pasaporte de calidad (futuro).

### Sources (store for reference — reader may not have access)
- **Figma:** "SiloGuard — UI Design (1).fig" — páginas usadas: `Foundations`,
  `Components`, `Prototype`. Foundations es la fuente de verdad de tokens; el
  Prototype es el flujo de creación de cuenta y bienvenida.
- **GitHub:** [`EscobarLucas73/SiloguardApp_backend_tup`](https://github.com/EscobarLucas73/SiloguardApp_backend_tup)
  — contiene la definición de producto (`SiloGuard_definicion_producto.md`) y el
  MVP (`Siloguard_mvp.md`) con las 23 pantallas y los 8 flujos. Explorá ese repo
  para entender funcionalidades y pantallas con más profundidad.

---

## 2 · Content fundamentals (voz y tono)

- **Idioma:** español rioplatense (Argentina). Voseo: "Clavá la lanza",
  "Apuntá la cámara", "¿No tenés cuenta? Registrate", "Seguí estos pasos".
- **Persona gramatical:** se le habla al productor de **vos** ("tu silo", "tu
  cuenta"). La marca habla en primera persona del sistema: "SiloGuard te avisa".
- **Tono:** claro, directo, de campo. Cero jerga técnica innecesaria — las alertas
  se explican en **lenguaje simple** (qué pasa · qué zona · cuántas horas quedan ·
  qué hacer). Tranquilizador pero accionable.
- **Casing:** títulos en *sentence case* ("Iniciar sesión", "Asigná un nombre a tu
  silo"). Labels de formulario y eyebrows en **MAYÚSCULA tracked** ("NOMBRE DEL
  SILO", "COLOR TOKENS"). Botones en sentence case ("Guardar y continuar").
- **Unidades del dominio:** `tn` (tonelaje), `ppm` (CO₂), `°C`, `%` humedad,
  score `1–100`. CO₂ siempre con subíndice (CO₂).
- **Emoji:** no se usan. Los estados se comunican con color + iconos de línea.
- **Microcopy de ejemplo:** "Monitoreo en tiempo real." · "Notificación con 48 hs
  de anticipación a pérdidas" · "Podés cambiar estos datos en cualquier momento."

---

## 3 · Visual foundations

**Aesthetic.** Dark-first, sobrio, instrumental — un "panel de control" del grano.
Mucho negro, una sola voz de color (verde agronómico) y datos grandes y legibles.

- **Color.** Canvas casi-negro `#0A0A0A`; superficies en grises apilados
  (`#111` cards/headers, `#1A1A1A` inputs, `#262626` hover); borde hairline
  `#2A2A2A`. Un único **verde de marca `#22C55E`** que vale por "marca" y por
  "estado OK". El resto del color es **estado de salud del grano**: ámbar
  `#F59E0B` (advertencia), rojo `#EF4444` (crítica), azul `#3B82F6` (info/hints).
  Texto `#F5F5F5` / muted `#6B7280`. Los fills de estado son el color al **12%**.
- **Tipografía.** **Inter** en todo el producto (única familia). Escala: Display
  48/700, H1 32/700, H2 24/600, H3 18/600, Body 14/400, Caption 12/400. Tracking
  negativo en titulares (−0.5 a −1.5), positivo en labels/captions (+0.3 / +0.8).
- **Spacing.** Grid estricto de **8pt** con medio paso de 4px (4·8·16·24·32·48·64·96).
  Gutter de pantalla = **24px**. Campos apilados en ritmo de 16–24px.
- **Radios.** Controles (botón/input) `8px`; cards `12–16px`; pills, avatares y
  badges `full`. Nada de esquinas vivas salvo en specimens.
- **Sombras / glow.** Sobre el canvas oscuro las sombras son halos suaves
  (`sm` 0 1 4 / `md` 0 3 12 / `lg` 0 6 24, todas negras). El **glow verde**
  (`0 4 16 rgba(34,197,94,.3)`) es el acento firma — se usa en badges de éxito,
  dispositivo activo y el dot crítico.
- **Cards.** Fondo `--surface`, borde `1px --border`, radio `lg`, padding `16`.
  Sin sombra en reposo; `shadow-md` sólo al hover si son interactivas.
- **Borders.** Hairline de 1px `--border` para divisores y controles; el input en
  foco cambia el borde a verde + anillo `green-tint`.
- **Estados.** Hover: oscurecer el fill (primary → `green-600`) o subir a
  `surface-hover`. Press: `scale(0.985)` — sutil, sin bounce. Selección:
  borde verde + fondo `green-tint`. Disabled: `opacity 0.4`.
- **Animación.** Calma y funcional. Easing estándar `cubic-bezier(0.4,0,0.2,1)`,
  duraciones 120/180/280ms. Sin rebotes. Únicas animaciones decorativas: el spinner
  del splash y la línea de escaneo del QR. Respetá `prefers-reduced-motion`.
- **Layout.** Lienzo móvil 390×844. Status bar 44px, header 54px, nav bar inferior
  64px, ambos en `--surface` con borde hairline. Pantallas de estado (éxito,
  permisos) centradas vertical con un icon-badge de 88px.

---

## 4 · Iconography

- **Sistema:** iconos de **línea, 24×24, trazo 2px, puntas redondeadas** — la misma
  voz que los pocos iconos del Figma (campana, clipboard, usuario, target).
- **Implementación:** el componente **`Icon`** trae un set curado (home, bell,
  clipboard, user, settings, alert-triangle, check, check-circle, x-circle, x,
  info, chevron-left/right/down, scan-qr, wifi, plus-circle, target, thermometer,
  droplet, wind, trending-up, clock, inbox, wifi-off, cloud-off). Heredan
  `currentColor`.
- **Sustitución (flag):** para cobertura completa el set usa trazados estilo
  **Lucide** (ISC), elegidos para igualar el trazo del Figma. Los 4 SVG originales
  del archivo (`assets/icon-*.svg`, `assets/logo-ring.svg`) se copiaron como
  referencia. Si tenés un set propio, reemplazá `components/icon/Icon.jsx`.
- **Logo:** la marca es un **anillo-sensor verde con punto central** (un sondeo /
  radar leyendo el grano) + wordmark "SiloGuard" en Inter SemiBold. Ver
  `assets/logo-mark.svg`.
- **Sensores:** CO₂ → `wind`, temperatura → `thermometer`, humedad → `droplet`.
- **Estados vacíos / offline:** lista vacía → `inbox`, sin red → `wifi-off`,
  error de servidor → `cloud-off`.
- **Emoji / unicode como iconos:** no se usan.

---

## 5 · Index / manifest

**Root**
- `styles.css` — punto de entrada global (sólo `@import`s).
- `tokens/` — `colors · typography · spacing · radius · shadows · semantic · base · fonts`.
- `assets/` — `logo-mark.svg`, `logo-ring.svg`, `icon-alertas/pasaporte/perfil.svg`.
- `guidelines/` — specimen cards (Colors, Type, Spacing, Brand) del tab Design System.
- `readme.md` (este archivo) · `SKILL.md`.

**Components** (`components/<group>/` · namespace `window.SiloGuardDesignSystem_633342`)
- `Button` — primary / secondary / ghost / danger · sizes · disabled.
- `Input` — label + control, focus/error, variante select, leading/trailing icon slot.
- `Checkbox` — control cuadrado de selección (acuerdos T&C, listas multi-select).
- `Icon` — set de iconos de línea (+ `ICON_NAMES`).
- `StatusBadge` + `StatusDot` — estado de salud (Crítica/Advertencia/OK/Resuelta).
- `AlertCard` — CARD ALERT ITEM (Crítica / Aviso / Resuelta).
- `ListItem` — LIST ITEM (Default / Selected / Resolved).
- `NavBar` — tab bar inferior (Dashboard / Alertas / Pasaporte / Perfil).
- `SensorStat` — tile de lectura CO₂ / temperatura / humedad.
- `Toggle` — switch on/off para ajustes y preferencias de notificaciones.
- `Tabs` — barra de navegación con indicador deslizante (`underline` · `pill`).
- `Modal` + `BottomSheet` — overlay centrado · hoja inferior animada.
- `Toast` + `ToastProvider` + `useToast` — notificaciones transitorias (ok · warn · critical · info).
- `EmptyState` — panel de fallback (empty · offline · error · no-alerts).

**UI kits**
- `ui_kits/onboarding-v1/` — **[DEPRECADO]** versión anterior del flujo de
  creación de cuenta y bienvenida (Splash → Dashboard), desactualizada respecto
  a `SiloGuard_definicion_producto.md` v2. Se mantiene como referencia histórica.
  La versión vigente vive en `templates/auth/`.

---

*Generado a partir del Figma de SiloGuard y la definición de producto del repo
`EscobarLucas73/SiloguardApp_backend_tup`.*

---

## 6 · Usage pattern (consumer projects)

```js
// In your root stylesheet:
@import url('./_ds/<folder>/styles.css');

// In a React component:
const { Button, Toggle, Tabs, Modal, Toast, EmptyState } = window.SiloGuardDesignSystem_633342;
```

Toast requires a provider at or above the component tree entry point:

```jsx
<ToastProvider>
  <App />
</ToastProvider>
```
