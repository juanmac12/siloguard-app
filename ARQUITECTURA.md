# SiloGuard — Arquitectura y guía del proyecto

> Referencia del proyecto: design system, tokens de diseño, backend (.NET 10) y convenciones.

---

## Contexto del proyecto

SiloGuard tiene dos partes **independientes** que conviven en este repo:

- **App React Native** (`src/app/`) — app móvil con Expo Router + Firebase. Auth ya funciona, no tocar sin razón.
- **Prototipo HTML** (`src/design-system/screens/App Screens.html`) — SPA en React puro (sin bundler, sin npm) que corre directamente en el browser. Es la fuente de verdad del diseño de pantallas.

El Design System propio tiene bundle precompilado en `src/design-system/`. No uses librerías externas de UI, íconos ni estilos que no estén listados acá.

---

## Archivos clave — leerlos antes de hacer cambios

| Archivo | Para qué sirve |
|---|---|
| `src/design-system/_ds_manifest.json` | Lista de componentes disponibles y sus rutas fuente |
| `src/design-system/_ds_bundle.js` | Bundle compilado con todos los componentes |
| `src/design-system/styles.css` | Entry point de estilos — importa todos los tokens |
| `src/design-system/tokens/semantic.css` | **Variables CSS reales** — siempre consultar antes de escribir `var(--)` |
| `src/design-system/tokens/colors.css` | Paleta base |
| `src/design-system/tokens/typography.css` | Tipografía y escala |
| `src/design-system/tokens/spacing.css` | Grid de 8pt |
| `src/design-system/screens/App Screens.html` | **Prototipo principal** |
| `src/design-system/screens/mock-data.js` | Datos de prueba (silos, alertas, sensores) |
| `src/design-system/screens/historial-screen.jsx` | Pantalla de historial de sensores |
| `src/design-system/screens/profile-screens.jsx` | Pantallas de perfil y configuración |
| `src/design-system/screens/tweaks-panel.jsx` | Panel de tweaks del prototipo |
| `src/design-system/SiloGuard_definicion_producto.md` | **Definición de producto** — 23 pantallas, 8 flows |

---

## Design System Bundle

### Namespace
```js
window.SiloGuardDesignSystem_633342
```
Este nombre es exacto e inamovible. Siempre acceder así:
```js
const { Button, Icon, AlertCard, NavBar } = window.SiloGuardDesignSystem_633342;
```

### Componentes disponibles
Todos los componentes están en `_ds_manifest.json`. Los principales son:

| Componente | Uso |
|---|---|
| `Button` | `variant`: primary / secondary / ghost / danger · `size`: sm/md/lg · `fullWidth` |
| `Input` | `label`, `placeholder`, `hint`, `error`, `as="select"`, `options` |
| `Toggle` | `checked`, `onChange`, `size`: sm/md · `label` |
| `StatusBadge` | `tone`: ok / warn / critical / resolved / info |
| `StatusDot` | `tone`, `size` (número), `glow` |
| `AlertCard` | `variant`: critical/warning/resolved · `title`, `silo`, `time`, `description`, `estimate`, `action` |
| `SensorStat` | `kind`: co2/temp/humidity · `value`, `unit`, `tone`, `trend` |
| `ListItem` | `tone`, `title`, `subtitle`, `value`, `valueUnit`, `state`: default/selected/resolved |
| `NavBar` | `active`, `tabs`, `onChange` · cada tab: `{ id, label, icon, badge? }` |
| `Tabs` | `variant`: underline/pill · `items`, `activeId`, `onChange`, `fullWidth` |
| `Toast` | `tone`, `title`, `message` |
| `ToastProvider` + `useToast` | Proveedor global · `addToast({ tone, title, message })` |
| `Modal` | `open`, `onClose`, `title`, `actions` |
| `BottomSheet` | `open`, `onClose`, `title`, `actions` |
| `EmptyState` | `variant`: empty / offline / error / no-alerts |
| `Icon` | `name`, `size` · heredan `currentColor` |

### ⚠ Íconos — regla crítica
**NUNCA** importes `lucide-react`, `heroicons`, ni ninguna librería de íconos externa.
Los íconos se usan SIEMPRE así:
```js
const { Icon } = window.SiloGuardDesignSystem_633342;
React.createElement(Icon, { name: 'bell', size: 24 })
```
Los nombres válidos están en:
```js
window.SiloGuardDesignSystem_633342.ICON_NAMES // array con todos los nombres
```
Todos los nombres válidos (39 total):
`home`, `bell`, `clipboard`, `user`, `settings`,
`alert-triangle`, `check`, `check-circle`, `x-circle`, `x`, `info`,
`chevron-left`, `chevron-right`, `chevron-down`,
`scan-qr`, `wifi`, `wifi-off`, `plus-circle`, `target`, `phone`,
`inbox`, `cloud-off`,
`thermometer`, `droplet`, `wind`,
`more-vertical`, `trash`, `trending-up`, `clock`,
`edit`, `log-out`, `shield`, `map-pin`, `mail`, `camera`,
`message-circle`, `file-text`, `lock`, `refresh-cw`.

---

## Variables CSS — reglas

**NUNCA** inventes nombres de variables. Siempre verificá en `tokens/semantic.css` antes de escribir `var(--)`.

Variables más usadas:
```css
/* Colores */
--bg                  /* #0A0A0A — fondo principal */
--surface-card        /* #1A1A1A — tarjetas */
--surface-input       /* #262626 — inputs */
--border-default      /* #2A2A2A */
--border-strong       /* más visible */
--action-primary      /* #22C55E — verde marca */
--green-tint          /* rgba(34,197,94,.12) — fondo suave verde */
--status-ok           /* verde */
--status-warn         /* amber */
--status-critical     /* rojo */
--status-info         /* azul */
--text-primary        /* #F5F5F5 */
--text-secondary      /* #6B7280 */

/* Tipografía */
--font-sans           /* Inter */
--text-display        /* 48px / 700 */
--text-h1             /* 32px / 700 */
--text-h2             /* 24px / 600 */
--text-h3             /* 18px / 600 */
--text-body           /* 14px / 400 */
--text-caption        /* 12px / 400 */

/* Spacing (base 8pt) */
--space-1: 4px   --space-2: 8px   --space-3: 16px
--space-4: 24px  --space-5: 32px  --space-6: 48px

/* Radios */
--radius-sm: 6px   --radius-md: 8px
--radius-lg: 12px  --radius-xl: 16px  --radius-full: 9999px

/* Sombras */
--shadow-sm  --shadow-md  --shadow-lg  --glow-green
```
---

## Stack técnico de App Screens.html

- **React 18** cargado via CDN + **Babel standalone** — todo el archivo usa JSX (`type="text/babel"`)
- **Sin npm, sin bundler** — abrís el `.html` directamente en Chrome/Firefox, F5 para recargar
- **Mock data** en `src/design-system/screens/mock-data.js`
- Los JSX externos se cargan con `<script type="text/babel" src="...">` y se acceden via `window.*`

---

## Pantallas del producto

Ver `src/design-system/SiloGuard_definicion_producto.md` para la descripción completa.

---

## Checklist antes de entregar un cambio

- [ ] ¿Los íconos usan `SiloGuardDesignSystem_633342.Icon`? (no librerías externas)
- [ ] ¿Las variables CSS existen en `src/design-system/tokens/semantic.css`?
- [ ] ¿Los componentes se llaman con el nombre exacto del manifest?
- [ ] ¿El NavBar cambia de pantalla correctamente?
- [ ] ¿Los mock data de `mock-data.js` se usan en lugar de datos hardcodeados?

---

## Flujo de trabajo recomendado

1. Leer `src/design-system/SiloGuard_definicion_producto.md` para entender qué pantalla diseñar
2. Leer `src/design-system/_ds_manifest.json` para saber qué componentes usar
3. Consultar `src/design-system/tokens/semantic.css` para las variables CSS necesarias
4. Abrir `src/design-system/screens/App Screens.html` y localizar la sección a modificar
5. Hacer el cambio mínimo necesario

---

## Backend (.NET) — Estado de implementación

> Backend completo y verificado end-to-end. Auth híbrida (2026-07-03): Firebase Auth volvió
> únicamente para registro + verificación de email; el login sigue siendo 100% propio
> (JWT + BCrypt), gateado por `email_verified` de Firebase vía Admin SDK. Ver sección
> "Auth híbrida" más abajo. Detalle completo de arquitectura, endpoints e instalación en
> `backend/README.md` — esto es solo un resumen para orientarse rápido.

### Progreso
- [x] Modelo de datos (7 tablas: `Users`, `Roles`, `UserRoles` N-N, `Silos`, `SensorReadings`, `Alerts`, `AuditLogs`)
- [x] Arquitectura en 3 capas (`SiloGuard.Api` / `SiloGuard.Business` / `SiloGuard.Data`, sin ciclos)
- [x] Auth propia con JWT + BCrypt, login gateado por email verificado en Firebase
- [x] Middleware global de errores (nunca expone stack trace al cliente)
- [x] Controllers: Auth, Perfil, Silos (+ lecturas paginadas), Alertas, Admin
- [x] Validación con FluentValidation + sanitización anti-XSS
- [x] Transacción con rollback demostrable en `POST /api/silos` (silo + lectura inicial)
- [x] Swagger en `/swagger`
- [x] Seeder con datos demo (usuario `dev@siloguard.com` / `Demo1234`, 6 silos, ~1000 lecturas, 5 alertas)
- [x] **Frontend reconectado a la API real** (`src/services/*`, `AppDataContext.tsx`, login/register propios)
- [x] **Pasaporte de Calidad (Lotes)**: entidad `Lote` (1-N con `Silo`), score + promedios de sensores computados al finalizar (en transacción), auditoría automática. Endpoints: `POST /api/silos/{id}/lotes` (iniciar, 409 si ya hay uno activo), `POST /api/lotes/{id}/finalizar`, `GET /api/lotes`, `GET /api/lotes/{id}`. Front: tab Pasaporte + detalle de lote + botón Iniciar/Finalizar en el detalle del silo.

### Estructura

```
backend/
├── SiloGuard.sln
├── docker-compose.yml       # servicio "db": postgres:16, DB "siloguard"
├── .env.example
├── README.md                 # instalación, endpoints, checklist de verificación completo
└── src/
    ├── SiloGuard.Api/         # presentación: Controllers, Program.cs, DTOs, Middleware, Swagger
    ├── SiloGuard.Business/    # negocio: Services, Validators, JWT, BCrypt, sanitización
    └── SiloGuard.Data/        # datos: entidades EF, DbContext, migrations, repositorios, seeder
```

`SiloGuard.Data` no referencia otros proyectos propios. `SiloGuard.Business` referencia
`SiloGuard.Data` (usa sus entidades y las interfaces de repos que viven en
`SiloGuard.Data.Abstractions`) pero nunca importa EF Core directamente. `SiloGuard.Api`
referencia ambas.

### Cómo levantarlo

```bash
cd SiloGuard/backend
docker compose up -d db
ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"
```

Puerto fijo: `5210`, escuchando en `0.0.0.0` para que el celular con Expo Go llegue por LAN
(`http://192.168.0.9:5210/api`, configurado en `src/config/api.ts` del frontend — actualizar
esa constante si cambia la IP de la compu).

### Frontend — qué cambió

- `src/config/api.ts` + `src/services/{authApi,siloApi,alertaApi,perfilApi,tokenStorage}.ts`: cliente HTTP con JWT (`expo-secure-store`).
- `src/contexts/AppDataContext.tsx`: ya no usa mock — hace login/register/CRUD contra la API real.
- `src/app/login.tsx`: sigue llamando solo a la API propia (`/auth/login`). Los botones de Google/Apple quedan decorativos ("Próximamente").
- `src/app/register.tsx`: usa Firebase (`createUserWithEmailAndPassword` + `sendEmailVerification`) y luego registra en la API propia; si el registro en la API falla, borra la cuenta de Firebase recién creada para poder reintentar.
- `src/app/historial/[id].tsx` y `src/app/silo/[id].tsx`: gráficos con datos reales de `/api/silos/{id}/lecturas`.

### Auth híbrida (Firebase registro/verificación + JWT propio) — 2026-07-03

Decisión tomada: **no** reemplazar el backend por validación de tokens de Firebase (eso
hubiera obligado a reescribir el middleware de auth y reprobar todos los endpoints con
roles). En cambio:

- **Registro** (`register.tsx`): crea la cuenta en Firebase, envía el correo de
  verificación con el SDK cliente, y también crea el usuario en la base propia
  (`POST /api/auth/register`, sin cambios — sigue emitiendo un JWT que el frontend
  ignora a propósito).
- **Login** (`login.tsx` → `POST /api/auth/login`, sin cambios en el frontend): el
  backend (`AuthService.LoginAsync`) valida email+password contra su propio hash
  BCrypt como siempre, y **además** llama a `IFirebaseAuthService.IsEmailVerifiedAsync`
  (`SiloGuard.Business/Security/FirebaseAuthService.cs`, usa el Admin SDK
  `FirebaseAuth.GetUserByEmailAsync`). Si el email no está verificado en Firebase,
  devuelve 401 con un mensaje pidiendo verificar el correo — no emite el JWT.
- `src/config/firebase.ts`: config pública del proyecto Firebase (apiKey de cliente,
  no es secreta). `firebase` está de vuelta en `package.json`.
- **Setup del Admin SDK (requerido para que el gate de verificación funcione):**
  generar una clave de service account desde la consola de Firebase (Configuración del
  proyecto → Cuentas de servicio → Generar nueva clave privada), guardarla como
  `backend/src/SiloGuard.Api/firebase-service-account.json` (gitignored) y setear
  `Firebase:CredentialsPath` en `appsettings.Development.json` apuntando a ese archivo
  (ya está seteado a ese nombre por default). **Sin esa credencial, `FirebaseAuthService`
  loguea un warning y deja pasar el login sin chequear verificación** (para no romper el
  arranque en dev) — no depender de eso para producción/entrega final.
- `Firebase:VerificationBypassEmails` en appsettings: lista de emails que se saltan el
  chequeo. Trae `dev@siloguard.com` (el usuario seed de la demo) porque ese usuario se
  crea directo en Postgres y nunca pasa por Firebase.

### Pendiente / fuera de alcance (no lo pidió la rúbrica)

- "Mis lanzas" (`perfil/lanzas.tsx`) sigue siendo mock — no hay entidad de dispositivo IoT en el backend, la rúbrica no lo exige.
- Preferencias de notificaciones (`perfil/notificaciones.tsx`) no persisten.
- "Configurar umbrales" es un placeholder sin implementar.
- No hay botón de "reenviar correo de verificación" — si el usuario lo borra o expira,
  hoy no tiene forma de reenviarlo desde la app (quedaría para una próxima iteración).
