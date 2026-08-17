# MAPA-PROYECTO.md — SiloGuard

> Mapa completo del repo, archivo por archivo. Generado el 2026-08-17, después de sincronizar 45 commits de trabajo (rediseño `feat/design-handoff`, Umbrales, Soporte técnico, Preferencias, Pasaporte compartido) y de deployar el backend a Render. Reemplaza la versión anterior (2026-07-14), que describía un estado bastante más chico del proyecto. Si el código sigue avanzando, este documento puede quedar desactualizado — es un punto de partida, no una fuente de verdad permanente.

---

## 0. Contexto rápido

Este es el repo real (`git@github.com:juanmac12/siloguard-app.git`), rama `main`. Si tu editor muestra una carpeta `SiloGuard/` como hijo del directorio abierto, estás un nivel arriba de donde corresponde — reabrilo apuntando directo a esta carpeta.

**Backend deployado en Render**: `https://siloguard-app.onrender.com` (Postgres gestionado, build vía `backend/Dockerfile`). El frontend (`src/config/api.ts`) apunta ahí por default — no hace falta levantar nada local para correr la app.

Hay una rama remota adicional, `feat/design-handoff`, con el rediseño visual que ya está **mergeado en `main`** (commit `49c582d`) — no hace falta usarla aparte.

---

## 1. Estructura de carpetas

```
SiloGuard/                                  # raíz del repo
├── app.json                                # Config de Expo
├── ARQUITECTURA.md                         # Guía de DS + estado del backend + deploy
├── CLAUDE.md                               # Instrucciones de trabajo para Claude Code
├── LICENSE
├── package.json / package-lock.json
├── tsconfig.json
├── README.md                               # README principal (app + backend)
├── .claude/settings.json
│
├── docs/
│   ├── CHECKLIST-DEFENSA.md                # Guía de defensa vigente (rúbrica → código)
│   ├── DEFENSA.md                          # Guía de defensa anterior (desactualizada)
│   ├── HISTORIAL-CLAUDE.md                 # CLAUDE.md histórico (2026-07-03)
│   ├── COMO-CONSTRUIMOS-SILOGUARD.md
│   ├── DIAGNOSTICO-RUBRICA.md
│   ├── DOCUMENTACION-FINAL-BACKEND.md
│   ├── DOCUMENTACION-FINAL-FRONTEND.md
│   ├── MODELO-DE-DATOS.md
│   ├── PLAN-DE-PRUEBAS.md
│   ├── PRUEBAS-ENTREGA.md
│   ├── SiloGuard_MVP.md
│   ├── SiloGuard_Presentacion.md
│   ├── entrega/                            # .docx de entrega final (front + back)
│   └── design_handoff_react_native_expo/   # Referencias de diseño del rediseño (HTML/JSX/DS)
│
├── src/                                     # ── FRONTEND (Expo + expo-router) ──
│   ├── app/                                 # Rutas (expo-router, file-based)
│   ├── components/                          # Design System (28 componentes)
│   ├── contexts/                            # AppDataContext, ThemeContext
│   ├── hooks/                                # useConnState, useDeviceState, useReducedMotion, useTechAvailability
│   ├── services/                             # Capa de acceso a la API (8 archivos)
│   ├── mock/seed.ts                          # Lo único que sigue siendo mock (lanzas, notif. iniciales)
│   ├── config/                               # api.ts, firebase.ts
│   ├── constants/Theme.ts
│   ├── utils/relativeTime.ts
│   ├── assets/
│   └── design-system/                        # Prototipo HTML/JS original del DS (referencia visual)
│
└── backend/                                  # ── BACKEND (.NET 10, 3 capas + tests) ──
    ├── Dockerfile / .dockerignore             # Deploy: build multi-stage
    ├── docker-compose.yml                     # Postgres 16 + pgAdmin para desarrollo local
    ├── README.md
    ├── SiloGuard.slnx
    ├── src/
    │   ├── SiloGuard.Api/                     # Presentación (8 controllers)
    │   ├── SiloGuard.Business/                # Negocio (11 services, 11 validators)
    │   └── SiloGuard.Data/                    # Datos (14 entidades, 3 migraciones)
    └── tests/
        └── SiloGuard.Tests/                   # xUnit: SecurityTests, ValidatorTests
```

---

## 2. Frontend (`src/`)

### 2.1 `app/` — pantallas (expo-router, ruteo por archivo)

| Archivo | Pantalla / qué hace |
|---|---|
| `_layout.tsx` | Layout raíz: `ThemeProvider` → `ToastProvider` → `AppDataProvider`, `Stack` de navegación sin header. |
| `index.tsx` | Splash. Espera la verificación de sesión y decide: con sesión → `/(tabs)/dashboard`; sin sesión y onboarding no hecho → `/welcome`; sin sesión → `/login`. |
| `welcome.tsx` | Carrusel de 3 slides (monitoreo, alertas, pasaporte) con autoplay, CTA a Registrarme / Iniciar sesión. Reemplaza el splash-a-login directo de antes. |
| `login.tsx` | Login email/contraseña. Google/Apple siguen siendo placeholders. Link a "Olvidé mi contraseña" ahora **sí funciona** (`/recuperar`). |
| `recuperar.tsx` | Recuperar contraseña: pide email, simula el envío (no hay backend de reset todavía), pantalla de confirmación. |
| `register.tsx` | Alta de cuenta. A diferencia de antes, **deja la sesión abierta** tras registrar (el onboarding sigue con `/permisos` → `/vincular-lanza`, que ya usan la API real). |
| `permisos.tsx` | Pantalla de onboarding: pide activar notificaciones antes de vincular el primer silo (simulado, sin permisos nativos reales todavía). |
| `vincular-lanza.tsx` | Wizard de 3 fases (QR → WiFi → asignación de silo) para el onboarding de primer ingreso — reemplaza/complementa a `agregar-silo.tsx` para el flujo de "primera vez". Al finalizar crea el silo vía `addSilo` y va a `/tutorial`. |
| `tutorial.tsx` | Overlay de tutorial con spotlight sobre un mini-dashboard no interactivo (4 pasos: Dashboard, Alertas, Historial, Pasaporte). Al terminar llama `completeOnboarding()`. |
| `agregar-silo.tsx` | Alta de un silo adicional desde el Dashboard (ya con sesión hecha) — wizard similar a `vincular-lanza` pero para silos posteriores al primero. |
| `verificar-email.tsx` | Pantalla intermedia de verificación de email post-registro. |
| `registro-exitoso.tsx` | **Eliminada** en el rediseño — el flujo ahora va directo del registro al onboarding (`/permisos`). |
| `ds-showcase.tsx` | Catálogo visual de componentes del DS, para QA — no forma parte del flujo de usuario. |
| `(tabs)/_layout.tsx` | Tab bar inferior: Dashboard / Alertas / Pasaporte / Perfil, badge de alertas activas. |
| `(tabs)/dashboard.tsx` | Home: silos, chips de resumen, banners de alerta/offline, FAB para agregar silo. |
| `(tabs)/alertas.tsx` | Lista de alertas con tabs de filtro — el filtrado ahora se resuelve en la API (`filterAlerts`), no en el cliente. |
| `(tabs)/pasaporte.tsx` | Lista de lotes (Activos/Certificados) con buscador y filtro por grano. |
| `(tabs)/perfil.tsx` | Perfil: accesos a Editar perfil, **Mis dispositivos** (antes "Mis lanzas"), Notificaciones, **Umbrales de alerta** (antes placeholder, ahora real), Cambiar contraseña, soporte, logout. |
| `silo/[id].tsx` | Detalle de silo: sensores, tabs Información/Alertas, `LoteStatusCard` (iniciar/ver pasaporte), pronóstico, `ZoneChart` con bandas de umbral en vez del sparkline simple de antes. |
| `editar-silo/[id].tsx` | Edición de silo existente + eliminación con confirmación. |
| `historial/[id].tsx` | Historial paginado con selector de rango; el gráfico de barras se reemplazó por `ZoneChart` (bandas de zona segura/advertencia/crítica). |
| `alerta/[id].tsx` | Detalle de alerta + resolución vía `BottomSheet`. Ahora enlaza a `/contacto-tecnico` en vez de solo WhatsApp externo. |
| `contacto-tecnico.tsx` | **Nueva.** Contacto con técnico desde una alerta: llamar / WhatsApp (deshabilitados fuera de horario o sin conexión vía `useTechAvailability` + `useConnState`) o dejar una consulta escrita (`POST /api/alertas/{id}/consultas`). |
| `lote/[id].tsx` | Certificado del Pasaporte de Calidad — ahora usa el componente `Certificate` (portado del prototipo) en vez de JSX inline; agrega compartir con destinatarios reales (`GET /destinatarios`, `POST /lotes/{id}/compartir`). |
| `umbrales/index.tsx` | Redirige al primer silo (`/umbrales/[siloId]`) — no hay selector propio, vive dentro del detalle. |
| `umbrales/[siloId].tsx` | **Nueva pantalla real** (antes placeholder): editar umbrales de advertencia/crítico por silo y variable (CO₂/temp/humedad), con `ThresholdTrack` visual, aplicar a otros silos del mismo grano, restaurar recomendados. Conectada a `PUT/DELETE /api/silos/{id}/umbrales`. |
| `perfil/editar.tsx` | Edición de datos personales y del campo. |
| `perfil/cambiar-password.tsx` | Cambio de contraseña. |
| `perfil/notificaciones.tsx` | Preferencias de notificaciones — ahora persiste 4 de 6 campos contra `GET/PUT /api/perfil/notificaciones` (antes 100% local). |
| `perfil/dispositivos.tsx` | Antes `perfil/lanzas.tsx`. Mismo propósito (listado de lanzas mock), renombrado y con datos desde `src/mock/seed.ts` en vez de hardcodeados en el archivo. |
| `perfil/lanzas.tsx` | **Eliminada**, reemplazada por `perfil/dispositivos.tsx`. |

### 2.2 `services/` — capa de acceso a la API

| Archivo | Endpoints que consume |
|---|---|
| `authApi.ts` | `POST /auth/register`, `POST /auth/login`. |
| `siloApi.ts` | `GET/POST/PUT/DELETE /silos`, `GET /silos/{id}/lecturas`. |
| `alertaApi.ts` | `GET /alertas?status&variant`, `GET /alertas/{id}`, `PATCH /alertas/{id}/resolver`. |
| `loteApi.ts` | `GET/POST /lotes`, iniciar/finalizar/compartir, `GET /destinatarios`. |
| `perfilApi.ts` | `GET/PUT /perfil`, `PUT /perfil/password`, **nuevo:** `GET/PUT /perfil/notificaciones`. |
| `umbralApi.ts` | **Nuevo.** `GET/PUT/DELETE /silos/{id}/umbrales` — reemplaza la persistencia local por SecureStore que tenía el prototipo. |
| `tokenStorage.ts` | JWT en `expo-secure-store`. |
| `types.ts` | Espejo TS de los DTOs del backend (ahora incluye `PreferenciasResponse`, tipos de Umbrales/Destinatarios). |

### 2.3 `contexts/`

| Archivo | Estado que maneja |
|---|---|
| `AppDataContext.tsx` | Creció mucho respecto de la versión anterior. Sigue siendo el estado central (`silos`, `lotes`, `alerts`, `profile`), pero ahora también: `devices` (mock, de `src/mock/seed.ts`), `notificationSettings` (parcialmente persistido), `onboardingDone` (gatea welcome/tutorial), y todo el manejo de **umbrales** (`thresholdsFor`, `recommendedFor`, `setSiloThresholds`, `resetSiloThresholds`, `applyThresholdsToOthers` — este último hace N `PUT` en paralelo con `Promise.allSettled`, sin endpoint bulk). `filterAlerts` expone el filtrado server-side para las tabs de Alertas. |
| `ThemeContext.tsx` | Sin cambios de fondo — tema dark/light en memoria. |

### 2.4 `components/` — Design System (28 archivos, barrel en `index.ts`)

Los 9 originales (`Button`, `Input`, `Icon`, `AlertCard`, `ListItem`, `NavBar`, `ScoreRing`, `SensorStat`, `StatusBadge`) siguen igual en su rol. Nuevos:

| Archivo | Componente |
|---|---|
| `AuthHeader.tsx` | Cabecera simple (back + título) para pantallas de auth/onboarding. |
| `BottomSheet.tsx` | Hoja inferior animada genérica (resolución de alerta, iniciar/finalizar lote, compartir, eliminar). |
| `Modal.tsx` | Overlay centrado animado (confirmaciones, QR ampliado) — variante de escritorio del `BottomSheet`. |
| `Certificate.tsx` | Certificado de calidad completo del Pasaporte (usado en `lote/[id].tsx`), portado del prototipo `pasaporte-screens.jsx`. |
| `LoteStatusCard.tsx` | Card de estado del lote en el detalle de silo — punto de entrada a iniciar/ver pasaporte. |
| `FakeQR.tsx` | QR pseudo-aleatorio determinístico (no decodificable), placeholder visual del Pasaporte. |
| `Checkbox.tsx` | Checkbox cuadrado con relleno verde. |
| `Toggle.tsx` | Switch animado (reemplaza al `Switch` nativo de RN en las pantallas nuevas). |
| `Tabs.tsx` | Barra de tabs genérica, variantes `underline` (secciones primarias) y `pill` (filtros). |
| `DateField.tsx` | Selector de fecha con `@react-native-community/datetimepicker` nativo — reemplaza el input de texto libre de fecha de acopio. |
| `EmptyState.tsx` | Panel para listas vacías / offline / error / "todo en orden", 4 variantes con defaults. |
| `OfflineBanner.tsx` | Exporta 3 banners: `OfflineBanner` (sin internet), `DeviceOfflineBanner` (la lanza no responde, con guía de diagnóstico colapsable), `DisabledHint` (nota inline). |
| `Toast.tsx` | Sistema de notificaciones efímeras: `ToastProvider` + `useToast().addToast(...)`, máx. 3 apiladas. |
| `OnboardingStepProgress.tsx` | Círculos numerados + líneas conectoras para los sub-pasos de "Vincular lanza". |
| `TutorialCard.tsx` | Tarjeta flotante del overlay de `tutorial.tsx`. |
| `ThresholdTrack.tsx` | Visualización de umbrales: bandas de color + marcas + punto de lectura en vivo, usado en `umbrales/[siloId].tsx`. |
| `ZoneChart.tsx` | Gráfico de línea con bandas de fondo por zona (segura/advertencia/crítica), reemplaza al bar chart simple del historial. |
| `Sparkline.tsx` | Mini gráfico de línea sin ejes, autoescalado — usado en tarjetas compactas. |

### 2.5 `hooks/` (nuevo directorio)

| Archivo | Qué hace |
|---|---|
| `useConnState.ts` | Estado de conexión a internet del celular (`online` / `offline-recent` / `offline-prolonged`, umbral 1 h), vía `@react-native-community/netinfo`. Dispara un toast al reconectar. |
| `useDeviceState.ts` | Estado de una lanza según `now - lastSignalAt` (`ok` / `device-offline-recent` / `device-offline-prolonged`, umbrales 10 min / 30 min). |
| `useReducedMotion.ts` | Respeta la preferencia de accesibilidad "reducir movimiento" del sistema operativo. |
| `useTechAvailability.ts` | Disponibilidad del técnico según el reloj real (Lun–Sáb 7:00–20:00), usado en `contacto-tecnico.tsx`. |

### 2.6 `mock/seed.ts` (nuevo, reemplaza mocks que antes vivían sueltos en las pantallas)

Documenta explícitamente qué **no** tiene backend: `SEED_DEVICES` (lanzas — no hay entidad IoT), `RECOM` (umbrales recomendados por tipo de grano, solo de UI — el backend tiene recomendados fijos sin distinguir grano), `SEED_NOTIFICATIONS` (valores iniciales hasta que responde la API; `push` nunca se persiste).

### 2.7 `config/`, `constants/`, `utils/` — sin cambios de fondo

- `config/api.ts` — ahora apunta a `https://siloguard-app.onrender.com/api` (antes IP LAN). Mismo `apiFetch`/`ApiError`.
- `config/firebase.ts` — sin cambios (solo registro/verificación de email).
- `constants/Theme.ts` — agregó `fontFamilyForWeight` (usado en casi todos los componentes nuevos para tipografía Inter cargada con `expo-font`) y `Shadows`.
- `utils/relativeTime.ts` — sin cambios.

---

## 3. Backend (`backend/src/`)

Misma arquitectura en 3 capas sin ciclos: `SiloGuard.Data` ← `SiloGuard.Business` ← `SiloGuard.Api`. Ahora hay además un proyecto de **tests** (`backend/tests/SiloGuard.Tests`), fuera de la solución de producción.

### 3.1 Controllers (8, antes 6)

| Controller | Rutas | `[Authorize]` |
|---|---|---|
| `AuthController` | `POST /auth/register`, `POST /auth/login` | No |
| `SilosController` | CRUD de silos + `GET /silos/{id}/lecturas` | Sí |
| `AlertasController` | `GET/PATCH` alertas | Sí |
| `LotesController` | Lotes + **nuevo**: `GET /destinatarios`, `GET/POST /lotes/{id}/destinatarios`, `POST /lotes/{id}/compartir` (Pasaporte compartido, 2ª relación N-N) | Sí |
| `PerfilController` | Perfil, password + **nuevo**: `GET/PUT /perfil/notificaciones` | Sí |
| `AdminController` | `GET /admin/usuarios` | Sí, rol Admin |
| `UmbralesController` | **Nuevo.** `GET/PUT/DELETE /silos/{siloId}/umbrales` — ABM cabecera-detalle: el maestro es el Silo, el detalle son sus 3 umbrales (uno por variable). `PUT` reemplaza el detalle completo en transacción; `DELETE` restaura los recomendados (borra la personalización). | Sí |
| `SoporteController` | **Nuevo.** `GET /tecnicos`, `POST /alertas/{alertaId}/consultas`, `GET /consultas` — catálogo de técnicos + consultas escritas desde una alerta. | Sí |

También hay un endpoint público fuera de cualquier controller: `GET /health` (mapeado directo en `Program.cs`), sin auth, para chequeos de vida del deploy.

### 3.2 Services (11, antes 7)

Los 6 de antes (`AuthService`, `SiloService`, `LecturaService`, `AlertaService`, `LoteService`, `PerfilService`, `UsuarioAdminService`) siguen con el mismo rol. `LoteService` ahora también maneja el Pasaporte compartido (`ListDestinatariosCatalogoAsync`, `ListDestinatariosDeLoteAsync`, `CompartirAsync` — alta N-N transaccional e idempotente). Nuevos:

| Service | Funciones públicas |
|---|---|
| `UmbralService` | `GetAsync` (devuelve los personalizados si existen, si no calcula recomendados **sin persistir**), `UpdateAsync` (transacción: borra los 3 existentes e inserta los nuevos; si algún insert viola el check `Warn < Crit` de la base, rollback completo — demo de maestro-detalle transaccional), `RestoreAsync` (borra la personalización). |
| `SoporteService` | `ListTecnicosAsync`, `CrearConsultaAsync` (valida ownership de la alerta, asigna técnico explícito o el primero activo, sanitiza el mensaje), `ListMisConsultasAsync`. |
| `PreferenciasService` | `GetAsync` (materializa defaults en el primer acceso), `UpdateAsync`. |

### 3.3 Repositories

Los 6 originales siguen igual. Nuevos: `UmbralRepository` (`ListBySiloAsync`, `AddRangeAsync`, `RemoveRange`), `DestinatarioRepository` (catálogo + `ListSharesByLoteAsync` + `AddSharesAsync`), `SoporteRepository` (técnicos activos + consultas), `PreferenciasRepository` (`GetByUserAsync` + `AddAsync`).

### 3.4 Entities — ahora **14 tablas**, antes 7

Las 7 originales (`User`, `Role`, `UserRole`, `Silo`, `SensorReading`, `Alert`, `Lote`, `AuditLog` — son 8 en realidad, contando `AuditLog`) siguen sin cambios de esquema salvo `Silo` (+1 campo) y `Lote` (+1 campo, relación nueva). Nuevas 6:

| Entity | Campos propios | Relaciones |
|---|---|---|
| `Umbral` | `Id, SiloId, Variable ("temp"\|"hum"\|"co2"), Warn, Crit, UpdatedAt` | N–1 con `Silo` (1-N desde el silo, 3 filas por silo) |
| `Destinatario` | `Id, Nombre, Tipo ("banco"\|"acopio"\|"comprador"), Contacto?` | N–N con `Lote` vía `LoteDestinatario` |
| `LoteDestinatario` | `LoteId, DestinatarioId, CompartidoAt` (clave compuesta) | Tabla intermedia N–N `Lote` ↔ `Destinatario` — **segunda relación N-N** del modelo, junto a `UserRole` |
| `Tecnico` | `Id, Nombre, Telefono, Horario, Activo` | 1–N con `ConsultaSoporte` |
| `ConsultaSoporte` | `Id, AlertaId, TecnicoId, UserId, Mensaje, Estado ("enviada"\|"respondida"), CreatedAt` | N–1 con `Alert`, `Tecnico`, `User` |
| `PreferenciasNotificacion` | `Id, UserId, Advertencias, SilencioNocturno, SilencioDesde?, SilencioHasta?, UpdatedAt` | 1–1 con `User` (FK única) |

### 3.5 `Program.cs` — cambios relevantes desde el último deploy

Además de lo ya documentado (registro de servicios, middleware), tiene 3 cambios hechos específicamente para producción:

1. **Kestrel escucha en `PORT`** si esa variable de entorno está seteada (Railway/Render la inyectan) — si no, se comporta como antes.
2. **Swagger y `MigrateAsync`/`DbSeeder.SeedAsync` ya no dependen de `IsDevelopment()`** — corren siempre, para que un deploy nuevo arranque con esquema y datos aunque el entorno sea `Production`.
3. **`GET /health`** mapeado al final del pipeline, sin auth.

### 3.6 `DbSeeder` — ahora en 3 fases

- **`SeedCoreAsync`** — igual que antes: 2 roles, 2 usuarios, 6 silos, ~1008 lecturas, 5 alertas, 2 lotes. Solo corre si `Users` está vacía.
- **`SeedExtrasAsync`** (nuevo) — siembra las tablas agregadas después, cada una con su propio chequeo idempotente (para que una base ya poblada por `SeedCoreAsync` también las reciba al actualizar): 2 técnicos, 4 destinatarios (banco/acopio/2 compradores), umbrales personalizados de ejemplo en "Silo Sur", y un pasaporte ya compartido de muestra.
- **`RefreshDemoTimestampsAsync`** (nuevo) — en cada arranque, si el dato más reciente tiene más de 2 h de antigüedad, desplaza (`ExecuteUpdateAsync`, sin pasar por change tracker ni disparar auditoría) los timestamps de lecturas/alertas/`LastReadingAt` para que la lectura más nueva sea "ahora". Sin esto, los rangos 24h/48h/7d del historial quedarían vacíos en un deploy que lleva días arriba.

### 3.7 Migraciones (3, antes 2)

| Migración | Qué hace |
|---|---|
| `20260703001459_InitialCreate` | Esquema base: 7 tablas originales. |
| `20260705062440_AddLotes` | Agrega `Lotes`. |
| `20260715053841_AddUmbralesPasaporteCompartidoYSoporte` | Agrega las 6 tablas nuevas: `Umbrales`, `Destinatarios`, `LoteDestinatarios`, `Tecnicos`, `ConsultasSoporte`, `PreferenciasNotificaciones`. |

### 3.8 Tests (`backend/tests/SiloGuard.Tests`, proyecto nuevo)

Suite xUnit con `SecurityTests.cs` y `ValidatorTests.cs` — cubren hashing/salt (BCrypt), sanitización anti-XSS, y validadores de FluentValidation. `docs/CHECKLIST-DEFENSA.md` reporta 12 tests verdes vía `dotnet test`.

### 3.9 Deploy — Render

- `backend/Dockerfile`: build multi-stage (`mcr.microsoft.com/dotnet/sdk:10.0` para publicar, `mcr.microsoft.com/dotnet/aspnet:10.0` como runtime), restaura los 3 `.csproj` en capas separadas para cachear.
- `backend/.dockerignore`: excluye `bin/`, `obj/`, `.env`, `appsettings.Development.json`, `firebase-service-account*.json`.
- Postgres gestionado por Render (plan free), conectado vía `ConnectionStrings__Default` (env var, formato `Host=...;Port=...;Database=...;Username=...;Password=...` — no la URI `postgres://` que muestra el panel de Render).
- Env vars del servicio: `ConnectionStrings__Default`, `Jwt__Key`, `Firebase__VerificationBypassEmails__0`, `ASPNETCORE_ENVIRONMENT=Production`, `DOTNET_hostBuilder__reloadConfigOnChange=false` (evita un crash por límite de `inotify` en el contenedor). `Firebase__CredentialsJson` queda sin usar por ahora — sin ella, `FirebaseAuthService` omite el chequeo de email verificado para todos los usuarios nuevos (no solo el demo).

---

## 4. Dependencias

### 4.1 Frontend — `package.json`

**dependencies** (agregadas desde la última vez marcadas con →): `@expo-google-fonts/inter` →, `@react-native-community/datetimepicker` →, `@react-native-community/netinfo` →, `expo ~54.0.0`, `expo-asset`, `expo-constants`, `expo-font` →, `expo-linking`, `expo-router ~6.0.24`, `expo-secure-store`, `expo-splash-screen` →, `expo-status-bar`, `firebase ^12.15.0`, `react 19.1.0`, `react-dom`, `react-native 0.81.5`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `react-native-web`.

**devDependencies**: `@expo/ngrok`, `@types/react`, `typescript ~5.9.2`.

`npm audit` reporta 29 vulnerabilidades (12 moderate, 16 high, 1 critical) — no revisadas en detalle todavía, probablemente en su mayoría transitivas del ecosistema RN/Expo.

### 4.2 Backend — `.csproj` por proyecto

Sin cambios de paquetes desde la última revisión, salvo lo esperable por los nuevos archivos (mismas dependencias: JWT Bearer, EF Core Design, Swashbuckle en Api; BCrypt, FirebaseAdmin, FluentValidation, JWT en Business; Npgsql en Data). Hay un warning `MSB3277` persistente por conflicto de versión de `Microsoft.EntityFrameworkCore` (10.0.4 vs 10.0.9) entre `Business` y `Data` — no bloquea el build, pendiente de fijar versión explícita si se quiere limpiar el log.

`backend/tests/SiloGuard.Tests.csproj` (nuevo): proyecto xUnit, referencia a `Business` y `Data`.

---

## 5. Archivos de configuración

| Archivo | Qué configura |
|---|---|
| `app.json` | Ahora incluye los plugins `expo-font` y `@react-native-community/datetimepicker` además de `expo-router`/`expo-secure-store`. |
| `tsconfig.json` | Sin cambios — extiende `expo/tsconfig.base` con `strict: true`. |
| `backend/src/SiloGuard.Api/appsettings.json` | **Ojo:** desde el commit `756d75c` (previo a esta sesión) tiene valores de desarrollo en texto plano (connection string y JWT key de dev) — no son secrets reales de producción (Render usa sus propias env vars que pisan esto), pero están expuestos en el repo público. `Firebase.CredentialsJson` (nuevo campo, vacío) se agregó para aceptar el service account como env var. |
| `backend/src/SiloGuard.Api/appsettings.Development.json` | Config de desarrollo local (gitignored). |
| `backend/Dockerfile` / `.dockerignore` | Ver sección 3.9. |
| `backend/docker-compose.yml` | Postgres 16 + pgAdmin para desarrollo local (sin cambios). |
| `.claude/settings.json` | Config de Claude Code para este repo. |

---

## 6. Archivos `.md` existentes

| Archivo | Propósito |
|---|---|
| `CLAUDE.md` | Instrucciones de trabajo para Claude Code en este repo — reglas, cómo levantar el proyecto, tabla de docs. |
| `ARQUITECTURA.md` | Guía del Design System + estado del backend + sección de deploy. |
| `README.md` | README principal del proyecto (app + backend), agregado con la sincronización del 17/08. |
| `LICENSE` | Licencia del repo. |
| `docs/CHECKLIST-DEFENSA.md` | **Guía de defensa vigente** — rúbrica de 100 pts mapeada ítem por ítem a clases/archivos reales, 14 tablas, 30 endpoints, preguntas reales que el profesor hizo a otros grupos, guion sugerido de 10-12 min. |
| `docs/DEFENSA.md` | Guía de defensa anterior (recuperada de un `.html` suelto) — describe un estado más viejo del backend (8 conceptos, sin Umbrales/Soporte/Preferencias). Preferir `CHECKLIST-DEFENSA.md`. |
| `docs/HISTORIAL-CLAUDE.md` | Contenido histórico de un `CLAUDE.md` anterior (2026-07-03) — notas de equipo desactualizadas. |
| `docs/COMO-CONSTRUIMOS-SILOGUARD.md` | Relato del proceso de construcción del proyecto. |
| `docs/DIAGNOSTICO-RUBRICA.md` | Diagnóstico de cobertura contra la rúbrica. |
| `docs/DOCUMENTACION-FINAL-BACKEND.md` | Documentación final del backend (15 secciones, según el commit que la agregó). |
| `docs/DOCUMENTACION-FINAL-FRONTEND.md` | Documentación final del frontend/producto (12 secciones). |
| `docs/MODELO-DE-DATOS.md` | Documentación del modelo de datos (14 tablas). |
| `docs/PLAN-DE-PRUEBAS.md` | Checklist de pruebas funcionales end-to-end — actualizado hoy para reflejar el deploy en Render. |
| `docs/PRUEBAS-ENTREGA.md` | Checklist de pruebas para la entrega, por capa. |
| `docs/SiloGuard_MVP.md` | Fundamentación del producto (problema, usuario "Carlos"). |
| `docs/SiloGuard_Presentacion.md` | Guion de presentación de la materia. |
| `docs/design_handoff_react_native_expo/README.md` + `SiloGuard_definicion_producto_implementado.md` | Documentación del handoff de diseño del rediseño visual. |
| `backend/README.md` | Documentación del backend: arquitectura, modelo de datos, instalación. |
| `src/design-system/SiloGuard_definicion_producto.md` | Definición de producto v2 original (23 pantallas, 8 flujos) — anterior al rediseño. |

---

## 7. Notas sueltas útiles

- **Lo único que sigue siendo mock**: dispositivos/lanzas (`perfil/dispositivos.tsx`, `src/mock/seed.ts` — no hay entidad IoT en el backend) y 2 de 6 campos de preferencias de notificaciones (`push` es local; las alertas críticas nunca se pueden desactivar). Todo lo demás —silos, lecturas, alertas, lotes, umbrales, soporte técnico, pasaporte compartido, perfil, auth— es real contra la API.
- La autenticación sigue siendo híbrida: Firebase solo para registro/verificación de email; login y JWT de sesión 100% del backend propio.
- El recomendado de umbrales por defecto **no coincide exactamente entre frontend y backend**: la UI (`src/mock/seed.ts`, `RECOM`) sugiere valores distintos por tipo de grano; el backend (`UmbralService.Recomendados`) usa valores fijos (temp 28/35, hum 16/20, co2 600/800) sin distinguir grano. Es una discrepancia conocida, no un bug.
- El backend está deployado en Render (free tier): duerme tras inactividad, primera request después de un rato puede tardar 30-60s.
- `appsettings.json` (el committeado) tiene una connection string y JWT key de desarrollo en texto plano desde antes de esta sesión — no son las credenciales reales de producción (esas viven solo en las env vars de Render), pero conviene tenerlo presente si se audita el repo.
