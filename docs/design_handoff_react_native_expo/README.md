# Handoff: SiloGuard — Auth, Onboarding & App Screens → React Native + Expo

## Overview
SiloGuard es una app móvil (iOS + Android) de monitoreo de granos almacenados: una lanza IoT mide temperatura/humedad/CO₂ y una IA alerta con 48hs de anticipación. Este paquete cubre tres bloques para portar a **React Native + Expo**:
- **Templates/Autenticación** → `design_refs/templates/auth/`
- **Templates/Onboarding** → `design_refs/templates/onboarding/`
- **App Screens** (dashboard, silo detail, alertas, umbrales, pasaporte, perfil, historial, contacto técnico, estados especiales) → `design_refs/screens/`

## Documento maestro
`SiloGuard_definicion_producto_implementado.md` (raíz de este bundle) es la **definición de producto de la implementación real**: 26 pantallas + 1 extra, sus funcionalidades y los 10 flows. Leerlo PRIMERO — es la fuente de verdad de alcance. La pantalla de Resumen semanal fue **descartada**: no implementarla.

## About the design files
Todo lo que hay bajo `design_refs/` y `design_system/` son **prototipos HTML/JSX de referencia**, no código de producción para copiar tal cual. La tarea es **recrear estos diseños en Expo/React Native** usando sus propios primitivos (`View`, `Text`, `Pressable`, `ScrollView`, `SafeAreaView`, `react-native-svg`, `expo-font`, `react-navigation`, etc.), no `<div>`/CSS. Traducí fielmente layout, tipografía, color, spacing, radios, sombras y microcopy — no reinterpretes el diseño.

> **Por qué esta re-implementación.** Un intento previo con Claude Code renderizó mal estos diseños. NO copies el HTML/JSX como componentes web: cada `.jsx` de referencia usa `<div>`, CSS custom properties (`var(--…)`) y `style` de web, que **no existen** en React Native. Recreá cada pantalla desde cero con primitivos RN, traduciendo los tokens a un `theme.js` de constantes JS (ver abajo). El HTML es la especificación visual; el código RN es tuyo.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, spacing y radios exactos están documentados abajo y en `design_system/readme.md` — implementar pixel-perfect, no aproximado.

## Design tokens
Fuente completa: `design_system/tokens/*.css` y `design_system/readme.md` §3. Resumen:

**Color** (dark-first, canvas casi negro)
- Canvas app: `#0A0A0A` · Surface (cards/headers): `#111111` · Surface hover/inputs: `#1A1A1A` → `#262626` hover
- Border hairline: `#2A2A2A`
- Marca / estado OK — verde: `#22C55E` (glow: `0 4px 16px rgba(34,197,94,.3)`)
- Advertencia (ámbar): `#F59E0B` · Crítico (rojo): `#EF4444` · Info (azul): `#3B82F6`
- Fills de estado = el color de estado al 12% de opacidad sobre el fondo
- Texto primario: `#F5F5F5` · Texto muted: `#6B7280`

**Tipografía** — Inter (única familia, pesos 400/600/700)
- Display 48/700 · H1 32/700 · H2 24/600 · H3 18/600 · Body 14/400 · Caption 12/400
- Tracking: negativo en titulares (−0.5 a −1.5), positivo en labels/captions (+0.3 a +0.8)
- En Expo: cargar Inter con `expo-font` / `@expo-google-fonts/inter` (Regular, SemiBold, Bold)

**Spacing** — grid de 8pt con medio paso de 4px: `4·8·16·24·32·48·64·96`. Gutter de pantalla 24px.

**Radios** — controles (botón/input) 8px · cards 12–16px · pills/avatares/badges full (999).

**Sombras** — sm `0 1 4`, md `0 3 12`, lg `0 6 24` (negro). En RN usar `shadow*`/`elevation` (Android) — ver notas de implementación.

**Motion** — easing `cubic-bezier(0.4,0,0.2,1)`, duraciones 120/180/280ms, sin bounce. Usar `Animated`/`Reanimated` con ese easing. Respetar `AccessibilityInfo.isReduceMotionEnabled`.

**Layout** — lienzo de referencia 390×844 (iPhone). Status bar 44px, header 54px, tab bar inferior 64px, ambos en `--surface` con borde hairline.

## Voz y contenido
- Español rioplatense, voseo ("Clavá la lanza", "Registrate", "Asigná un nombre a tu silo").
- Títulos en sentence case; labels de formulario y eyebrows en MAYÚSCULA con tracking.
- Sin emoji. Estados se comunican con color + iconos de línea, nunca texto solo.
- Unidades: `tn`, `ppm`, `°C`, `%`, score 1–100. CO₂ siempre con subíndice.
- Ver `design_system/readme.md` §2 para el detalle completo de tono.

## Componentes del design system (`design_system/components/`)
Cada carpeta trae `Nombre.jsx` (referencia web), `Nombre.d.ts` (props/tipos) y `Nombre.prompt.md` (uso). Recrear como componentes RN nativos con la misma API de props:
`Button` (primary/secondary/ghost/danger, sizes, disabled) · `Input` (label, focus/error, select, icon slots) · `Checkbox` · `Icon` (set de línea 24×24 trazo 2px — usar `react-native-svg`) · `StatusBadge` + `StatusDot` (Crítica/Advertencia/OK/Resuelta) · `AlertCard` · `ListItem` · `NavBar` (tab bar inferior) · `SensorStat` (tile CO₂/temp/humedad) · `Toggle` · `Tabs` (underline/pill) · `Modal` + `BottomSheet` · `Toast`/`ToastProvider`/`useToast` · `EmptyState` (empty/offline/error/no-alerts).

Iconos: set de línea estilo Lucide (ISC), ver `design_system/assets/` y `Icon.jsx` para los paths exactos.

## Variantes a codificar (decisiones del usuario)
El prototipo expone estas variantes vía un panel de Tweaks (en `App Screens.html`, objeto `TWEAK_DEFAULTS`). Estas son las decisiones a llevar a código:

### 1 · Mi perfil → usar SIEMPRE la variante **"Propuesta"**
`profileVariant: "propuesta"`. Implementá SOLO esta versión (`ProfileScreen` con `variant==='propuesta'` en `design_refs/screens/profile-screens.jsx`); **descartá la variante "Actual"**, no la portes. La Propuesta es:
- Avatar centrado 72px + nombre (H2 20/700) + email con badge "Verificado" (pill verde).
- Card de campo tappable (verde-tint) → navega a Editar perfil: nombre del campo, ubicación · N silos · N ha.
- Sección **CONFIGURACIÓN**: Notificaciones · Umbrales de alerta.
- Sección **SEGURIDAD**: Cambiar contraseña.
- Sección **AYUDA**: Repetir tutorial · Soporte por WhatsApp · Términos y condiciones · Política de privacidad.
- Botón **Cerrar sesión** (ghost, rojo) + bottom sheet de confirmación.
- Footer: `SiloGuard v1.0.0 · Eliminar cuenta` (rojo).
- Nota: en la Propuesta el acceso a **Dispositivos/Mis lanzas NO está en el menú de perfil** (a diferencia de la variante Actual). La pantalla `DevicesScreen` igual existe y es alcanzable desde Onboarding/gestión — no la inventes dentro del perfil Propuesta.

### 2 · Estados especiales (banners de conexión) — implementar los 3 estados de cada eje como estados de runtime, NO como un valor fijo
Son dos ejes independientes. En producción se derivan de datos reales (NetInfo / timestamp de última señal de la lanza); en el prototipo se fuerzan por tweak. Portá la LÓGICA de los 3 estados, no un único valor.

**A · Conexión del celular** — `connState: 'online' | 'offline-recent' | 'offline-prolonged'` (ref: `OfflineBanner` + `DisabledHint` en `estados-especiales.jsx`)
- `online` — comportamiento normal.
- `offline-recent` (< 1 h, demo ≈12 min) — banner ámbar "Sin conexión a internet · Último dato recibido: hace N min" arriba del Dashboard/Detalle.
- `offline-prolonged` (≥ 1 h, demo ≈128 min) — mismo banner + "Los datos pueden estar desactualizados".
- En AMBOS offline: FAB "+" deshabilitado, acciones de escritura deshabilitadas (p.ej. "Marcar como resuelta" con `DisabledHint`), lista de silos atenuada (opacity .75), timestamps en tiempo relativo. Toast "Conexión restablecida" al volver a `online`.

**B · Estado de la lanza (device)** — `deviceState: 'ok' | 'device-offline-recent' | 'device-offline-prolonged'` (ref: `DeviceOfflineBanner` en `estados-especiales.jsx`, dentro de Detalle de silo)
- `ok` — normal.
- `device-offline-recent` (< 30 min, demo ≈12 min) — banner ÁMBAR "La lanza no responde · Última señal: hace N min" dentro del Detalle del silo, sensores atenuados, acordeón "¿Qué puedo hacer?" con 4 pasos de diagnóstico + "Contactar soporte".
- `device-offline-prolonged` (≥ 30 min, demo ≈96 min) — mismo banner en tono ROJO/crítico.
- En ambos device-offline: sensores en tono muted y el menú "⋯" **restringe Iniciar/Finalizar lote**.
- (En el prototipo este eje se demuestra sólo sobre el silo id 2 "Silo Sur"; en código aplica por-dispositivo según su última señal.)

### 3 · Contacto con técnico → **Disponibilidad** `techAvailability: 'auto' | 'en-horario' | 'fuera-de-horario'`
Ref: `ContactoTecnicoScreen` en `contacto-tecnico-screen.jsx`. En producción usar **`auto`** (deriva del reloj real: **Lunes a sábados, 7:00–20:00**). `en-horario`/`fuera-de-horario` son los dos estados a los que `auto` resuelve — implementá AMBOS comportamientos:
- **En horario** — botón "Llamar ahora" y "Enviar mensaje (WhatsApp)" habilitados; link "Prefiero dejar mi consulta por escrito" (formulario opcional: motivo + texto ≥10 chars).
- **Fuera de horario** — llamada y WhatsApp deshabilitados; se muestra por defecto el **formulario de consulta escrita** con aviso "Fuera de horario… dejá tu consulta y te respondemos a primera hora".
- Cruce con `connState`: si el celular está offline, "Enviar mensaje"/enviar consulta se deshabilitan (requieren red), pero **la llamada telefónica sigue disponible** (no requiere internet).

## Screens a implementar

**Autenticación** (`design_refs/templates/auth/Auth.dc.html`) — Splash → Welcome (carrusel) → Login → Registro (2 pasos). Sub-componentes: `AuthHeader`, `AuthStatusBar`, `AuthStepDots`.

**Onboarding** (`design_refs/templates/onboarding/Onboarding.dc.html`) — Solicitud de permisos → Vincular lanza (QR + WiFi + asignación de nombre) → Tutorial walkthrough. Sub-componentes: `OnboardingStepProgress`, `TutorialCard`.

**App Screens** (`design_refs/screens/`):
- `App Screens.html` — Dashboard multi-silo, Detalle de silo (tabs info/historial), Lista de alertas, Detalle de alerta, Agregar silo (QR/WiFi), Editar/eliminar silo, shell de navegación (tab bar + toasts).
- `umbrales-screen.jsx` — Configuración de umbrales por sensor (temp/humedad/CO₂), con tracks de rango y filtro por tipo de grano.
- `pasaporte-screens.jsx` — Lista de lotes, certificado de calidad (QR, score ring, compartir).
- `profile-screens.jsx` — Perfil de usuario y ajustes.
- `historial-screen.jsx` — Historial de lecturas de sensores.
- `contacto-tecnico-screen.jsx` — Contacto con soporte técnico.
- `estados-especiales.jsx` — Empty states, offline, error.
- `mock-data.js` — forma de los datos (silos, alertas, lotes) — usar como referencia de modelo de datos, no como fuente real.

## Interactions & behavior
- Navegación: usar `@react-navigation/native-stack` (+ bottom-tabs para Dashboard/Alertas/Pasaporte/Perfil).
- Alertas: 3 estados (Crítica / Advertencia / Resuelta) con badges y filtros por tab.
- Vinculación de lanza: flujo QR (cámara, `expo-camera` o `expo-barcode-scanner`) + selección WiFi + asignación de nombre de silo.
- Formularios: validación inline, estados de error en `Input`.
- Toasts transitorios para confirmaciones (ok/warn/critical/info).
- Press state: `scale(0.985)` sin bounce — implementar con `Pressable` + `Animated.spring`/`Reanimated` (sin bounce, easing indicado arriba).

## Implementation notes (RN/Expo specific)
- Sombras: usar `shadowColor/shadowOffset/shadowOpacity/shadowRadius` en iOS y `elevation` en Android; no hay equivalente 1:1 a CSS box-shadow multicapa — aproximar con el valor más cercano.
- CSS vars (`--surface`, `--space-md`, etc.) → definir como constantes JS (`theme.js`) con los valores exactos de `design_system/tokens/*.css`, no como CSS custom properties (RN no las soporta).
- Iconos: convertir los SVG (`assets/*.svg`, `Icon.jsx`) a componentes `react-native-svg`, no `Image`.
- Fuentes: Inter vía `@expo-google-fonts/inter`, pesos 400/600/700 solamente.
- No agregar features/pantallas fuera de las listadas sin confirmarlo con el usuario.

## Assets
`design_system/assets/logo-mark.svg`, `logo-ring.svg`, `icon-alertas.svg`, `icon-pasaporte.svg`, `icon-perfil.svg`. Iconos de UI generales están en `design_system/components/icon/Icon.jsx`.

## Files in this bundle
```
design_system/            → tokens, componentes de referencia (jsx+d.ts+prompt.md), readme, assets
design_refs/templates/auth/       → flujo de autenticación (.dc.html + subcomponentes)
design_refs/templates/onboarding/ → flujo de onboarding (.dc.html + subcomponentes)
design_refs/screens/              → App Screens.html + pantallas jsx sueltas + mock-data.js
```
