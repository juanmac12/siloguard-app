# ✅ Checklist de defensa — SiloGuard · TP Integrador Programación III (TUP 2026)

Guía para mostrar **cada ítem de la rúbrica** (100 pts): qué mostrar y dónde.

> **Antes de arrancar:** `docker compose up -d db` (en `backend/`), levantar la API
> (`ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"`),
> abrir Swagger en `http://localhost:5210/swagger`, y `npx expo start` para la app.
> **Mostrar la app desde el celular/emulador con Expo Go y transmitir por Meet — NO desde localhost web.**
> Login demo: `dev@siloguard.com` / `Demo1234` (bypass de verificación Firebase).

---

## PARTE 1 — Modelo de datos (25)

| Ítem | Qué mostrar | Dónde / cómo |
|---|---|---|
| **1.1** Dominio y tablas (7) | **14 tablas**: `Users`, `Roles`, `UserRoles`, `Silos`, `SensorReadings`, `Alerts`, `Lotes`, `Umbrales`, `Destinatarios`, `LoteDestinatarios`, `Tecnicos`, `ConsultasSoporte`, `PreferenciasNotificaciones`, `AuditLogs`. | pgAdmin (`localhost:5050`, `admin@siloguard.com`/`siloguard_dev_pw`) o `docker exec -it siloguard-db psql -U siloguard -d siloguard` → `\dt`. Código: `backend/src/SiloGuard.Data/Entities/`. |
| **1.2** 1-N y N-N (5) | **1-N**: `Silos→SensorReadings`, `Silos→Alerts`, `Silos→Lotes`, `Silos→Umbrales`, `Alerts→ConsultasSoporte`. **N-N (2 tablas intermedias con PK compuesta)**: `UserRoles` (Users↔Roles) y `LoteDestinatarios` (Lotes↔Destinatarios, "compartir pasaporte"). | pgAdmin → diagrama ER. Código: `Configurations/LoteDestinatarioConfiguration.cs` (`HasKey(ld => new { ld.LoteId, ld.DestinatarioId })`). |
| **1.3** Hash y salt (4) | Contraseñas con **BCrypt propio** (no delegado): el salt va embebido en el hash (`$2a$11$...`). | `SELECT "Email", "PasswordHash" FROM "Users";` → formato `$2...`. Código: `Business/Security/BCryptPasswordHasher.cs`. Test: `SecurityTests.Hash_GeneraSaltDistintoPorPassword`. |
| **1.4** Migraciones y seeders (5) | **3 migraciones** EF Core (`InitialCreate`, `AddLotes`, `AddUmbralesPasaporteCompartidoYSoporte`) + seeder con 6 silos, **~1000 lecturas** (paginado real), 5 alertas, lotes, técnicos, destinatarios. | `dotnet ef migrations list --project src/SiloGuard.Data --startup-project src/SiloGuard.Api`. Código: `Data/Seed/DbSeeder.cs` (idempotente). |
| **1.5** Auditoría bonus (4) | `AuditLogs` se puebla **automáticamente** al crear/modificar/borrar `Silo`, `Alert`, `Lote`, `Umbral`, `LoteDestinatario`, con usuario y timestamp. | Guardar umbrales desde la app → `SELECT * FROM "AuditLogs" ORDER BY "Timestamp" DESC LIMIT 5;`. Código: `SiloGuardDbContext.SaveChangesAsync` (override). |

## PARTE 2 — API REST y lógica de negocio (30)

| Ítem | Qué mostrar | Dónde / cómo |
|---|---|---|
| **2.1** Endpoints y métodos (6) | GET/POST/PUT/PATCH/DELETE con códigos correctos: `201` (crear silo), `204` (delete), `400/401/403/404/409`. | **Swagger** lista todo. Ej: `POST /api/silos` → 201 · `DELETE /api/silos/{id}/umbrales` → 204 · `PATCH /api/alertas/{id}/resolver`. |
| **2.2** Validación y sanitización (5) | **11 validators** FluentValidation aplicados por filtro global + sanitización HTML en todos los inputs de texto. | `Business/Validators/` + `Api/Filters/ValidationFilter.cs`. Demo: POST register con password corto → 400 con detalle por campo. |
| **2.3** Arquitectura 3 capas (7) | `SiloGuard.Api` (controllers/DTOs) → `SiloGuard.Business` (services/validators, **sin EF**) → `SiloGuard.Data` (EF/repos/UoW). Sin ciclos. | Mostrar el flujo de un request: `UmbralesController` → `UmbralService` → `UmbralRepository`. Comentario clave en `Data/Abstractions/IUnitOfWork.cs`. |
| **2.4** Manejo de errores (5) | Middleware global: excepciones de negocio → status + mensaje claro; excepciones no previstas → 500 genérico, stack trace **solo al log**. | `Api/Middleware/ExceptionHandlingMiddleware.cs`. Demo: cambiar la connection string → error controlado sin detalles técnicos. |
| **2.5** Persistencia ORM/CRUD (7) | CRUD completo con EF Core + patrón Repository + UnitOfWork. | Crear → editar → borrar un silo desde la app o Swagger; mostrar `SiloService` / `SiloRepository`. |

## PARTE 3 — Interfaz e integración (20)

| Ítem | Qué mostrar | Dónde / cómo |
|---|---|---|
| **3.1** App ↔ API (4) | La app consume la API real con `Authorization: Bearer <JWT>`. | `src/config/api.ts` (`apiFetch` agrega el token de `expo-secure-store`). |
| **3.2** Pantallas y componentes (4) | 27 vistas: auth, onboarding, dashboard, detalle, historial, alertas, pasaporte, perfil, umbrales. Componentes reutilizables en `src/components/`. | Recorrido en vivo por la app. |
| **3.3** Usabilidad y feedback (4) | Spinners, validación en vivo (registro), toasts/alerts de éxito y error, empty states, banners offline. | Registro (reglas de password en vivo), guardar umbrales (éxito y error 409). |
| **3.4** Búsqueda y filtros (4) | Solapas de Alertas → `GET /api/alertas?status=active&variant=critical` — **2 parámetros resueltos en la API** (WHERE en la consulta). | Código: `src/app/(tabs)/alertas.tsx` (TABS→params) + `AlertaRepository.ListByUserAsync`. Mostrar la URL en Swagger. |
| **3.5** Listado paginado (4) | Historial de lecturas con paginado **real en DB** (Skip/Take) + botón "Cargar más". | App: Historial del silo → "Mostrando X de ~1000 lecturas (página N de M)". API: `GET /api/silos/1/lecturas?range=7d&page=2&pageSize=50`. |

## PARTE 4 — Maestro–detalle (10)

| Ítem | Qué mostrar | Dónde / cómo |
|---|---|---|
| **4.1** Maestro-detalle desde la app (3) | Dashboard (listado) → Detalle del silo (con lecturas/alertas) · Pasaporte → Detalle del lote. | Navegación en vivo. `GET /api/silos/{id}` + `GET /api/silos/{id}/lecturas`. |
| **4.2** ABM cabecera y detalle (4) | **3 ABM**: ① Silo + lectura inicial (alta transaccional, edición, baja en cascada) · ② **Silo + Umbrales** (PUT reemplaza los 3 detalles en transacción, DELETE restaura) · ③ Lote (iniciar / finalizar / **compartir** con destinatarios N-N). | App: menú "⋯" del silo → Umbrales → editar → Guardar. Swagger: `PUT /api/silos/{id}/umbrales`, `POST /api/lotes/{id}/compartir`. |
| **4.3** Transacciones y rollback (3) | **Demo en vivo**: `PUT /api/silos/1/umbrales` con `warn:40, crit:30` → la validación lo deja pasar a propósito, el **check constraint** `Warn < Crit` de la DB lo rechaza → **rollback** → 409 y los umbrales anteriores quedan intactos (verificar con GET). | `UmbralService.UpdateAsync` (BeginTransaction/Commit/Rollback). Igual en `SiloService.CreateAsync` (lectura inicial fuera de rango) y `LoteService.FinalizarAsync`. |

## PARTE 5 — Seguridad (10)

| Ítem | Qué mostrar | Dónde / cómo |
|---|---|---|
| **5.1** JWT (3) | Login propio emite JWT (HS256); además el login exige `email_verified` en Firebase (Admin SDK). | Swagger sin token → 401. `Business/Security/JwtTokenService.cs`. |
| **5.2** Roles y rutas (4) | Todos los controllers con `[Authorize]` (excepto register/login). `AdminController` con `[Authorize(Roles="Admin")]`. **Ownership**: acceder a un silo ajeno → 403. | Demo: `GET /api/admin/usuarios` con el user común → 403; con `admin@siloguard.com`/`Admin1234` → 200. Código: `SiloService.GetOwnedAsync`. |
| **5.3** OWASP XSS/SQLi (3) | Mandar `<script>alert(1)</script>` en una consulta al técnico → se guarda **sin el tag** (sanitizado). SQLi: EF Core parametriza todo (cero SQL crudo en el repo). | Demo en Swagger: `POST /api/alertas/1/consultas`. Código: `HtmlInputSanitizer`. Test: `SecurityTests.Sanitize_EliminaTagsHtml`. |

## PARTE 6 — Documentación (5)

| Ítem | Qué mostrar | Dónde |
|---|---|---|
| **6.1** Arquitectura (1) | Capas, stack y decisiones. | `ARQUITECTURA.md` + `backend/README.md`. |
| **6.2** Instalación (1) | Pasos para levantar DB + API + app. | `backend/README.md` + sección "Cómo levantarlo" de `ARQUITECTURA.md`. |
| **6.3** Docs API / pruebas (1) | Swagger en `/swagger` + **12 tests xUnit verdes**. | `dotnet test` en vivo (`backend/tests/SiloGuard.Tests`). |
| **6.4** Repositorio (2) | Commits por feature, estructura clara, sin binarios ni secretos. **Git flow real**: `main` estable (conectado a la API) + rama `feat/design-handoff` con el rediseño visual en revisión, a integrar en la próxima iteración. | `git log --oneline` · `git branch -r`. |

> ⚠️ **Presentar SIEMPRE desde `main`.** La rama `feat/design-handoff` usa datos mock
> (sin API) — sirve como evidencia de trabajo en equipo, pero NO se demuestra la app
> desde ahí: la rúbrica exige consumo real de la API y datos vivos en la DB.

---

## 🎯 Preguntas que el profesor ya hizo a otros grupos (¡saberlas SÍ o SÍ!)

1. **"¿Qué es lo más importante del usuario en Firebase?"** → El **UID** (identificador único). En nuestro caso: Firebase se usa para registro + verificación de email; nuestra tabla `Users` tiene su propia PK y el login lo valida **nuestra API** con BCrypt + JWT propio.
2. **"¿Cómo se valida el JWT? ¿Cómo compara el token del front con el back?"** → El front manda `Authorization: Bearer <token>`; el middleware `AddJwtBearer` (en `Extensions/ServiceCollectionExtensions.cs`) valida **firma** (clave simétrica HS256), **issuer**, **audience** y **expiración**. No se "compara contra la DB": la firma criptográfica garantiza que lo emitimos nosotros.
3. **"¿Dónde se configura Firebase en .NET? ¿Qué paquete?"** → `FirebaseAdmin` (Admin SDK) en `AddFirebaseAuth()`, con la credencial de service account. Se usa solo para chequear `email_verified` en el login.
4. **"Muestren el proceso de login paso a paso"** → `login.tsx` (validación de campos) → `authApi.login()` → `POST /api/auth/login` → `AuthController` → `AuthService.LoginAsync` (busca por email, `BCrypt.Verify`, chequea Firebase, emite JWT) → el front guarda el token en `expo-secure-store` → `AppDataContext.loadAll()`.
5. **"Muestren un CRUD completo, desde la vista hasta la API y la BD"** → Usar **Umbrales**: pantalla `umbrales/[siloId].tsx` → `umbralApi.save()` → `PUT /api/silos/{id}/umbrales` → `UmbralesController` → `UmbralService.UpdateAsync` (transacción) → `UmbralRepository` → tabla `Umbrales` (mostrar en pgAdmin) → fila nueva en `AuditLogs`.
6. **"¿Cómo hicieron el paginado?"** → `GET /api/silos/{id}/lecturas?page=&pageSize=` → `LecturaService.GetPagedAsync` → `Skip((page-1)*pageSize).Take(pageSize)` en `SensorReadingRepository` + `COUNT` total → responde `{items, page, pageSize, totalCount, totalPages}`.
7. **"Eliminen un registro y muéstrenlo en la BD"** → Eliminar un silo desde la app → cascada borra lecturas/alertas/lotes/umbrales → mostrar en pgAdmin + fila "Deleted" en `AuditLogs`.
8. **NO hardcodear datos** → todo sale del seeder/DB. **Íconos consistentes** → design system propio unificado. **Mostrar desde Expo Go/emulador y transmitir por Meet**, no localhost web.
9. **Entregar**: repo(s) Git a los profesores + **presentación PDF con número de grupo**.

## 🎬 Guion sugerido (10–12 min)

1. App en Expo Go: login → dashboard → detalle de silo (30 s de contexto de negocio).
2. **Swagger**: recorrer endpoints; request sin token → 401 (2.1, 5.1).
3. **pgAdmin**: 14 tablas, FKs, `UserRoles` y `LoteDestinatarios` con PK compuesta (1.1, 1.2). `PasswordHash` BCrypt (1.3).
4. **CRUD completo de Umbrales** desde la app (pregunta 5 de arriba) + `AuditLogs` (1.5, 4.2).
5. **Rollback en vivo**: PUT umbrales con warn>crit → 409 → GET muestra los anteriores (4.3).
6. **Filtros**: solapas de alertas → mostrar la URL con `?status=&variant=` (3.4). **Paginado** en historial (3.5).
7. **Seguridad**: `<script>` sanitizado + silo ajeno → 403 (5.2, 5.3).
8. `dotnet test` → 12 verdes (6.3).
