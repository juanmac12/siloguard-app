# SiloGuard — Documentación Final del Backend

**API REST para alerta temprana de deterioro de granos**
Backend .NET 10 + Entity Framework Core + PostgreSQL · Año 2026

---

> **Aclaración de alcance.** Este documento se enfoca en el **backend** de SiloGuard. Las
> pantallas, prototipos y flujo visual del frontend (app React Native / Expo) se documentan
> por separado en la definición de producto y el design system. El detalle de defensa por
> ítem de rúbrica está en `docs/CHECKLIST-DEFENSA.md`.

---

## 1. Resumen ejecutivo

El backend de SiloGuard es una API REST desarrollada con ASP.NET Core (.NET 10) que sostiene
la lógica principal de la aplicación: usuarios y roles, silos, lecturas de sensores, alertas,
umbrales configurables, lotes con Pasaporte de Calidad, soporte técnico y auditoría. Su
objetivo es permitir que la app móvil opere el flujo completo del producto, donde un
productor agropecuario monitorea el estado de sus silos (CO₂, temperatura, humedad), recibe
alertas cuando una variable cruza un umbral, y certifica la calidad de cada lote almacenado.

La autenticación es **híbrida**: el registro y la verificación de email se apoyan en Firebase
Auth (desde el frontend), pero el **login y la emisión de sesión son propios del backend**
(contraseñas con hash+salt BCrypt y JWT firmado por la API). Esta separación mantiene un
backend ordenado y seguro, con control total de roles y permisos, delegando en Firebase solo
lo tedioso (envío de correos de verificación).

La solución está organizada en **tres capas** (presentación / negocio / datos) sin
referencias circulares, con **14 tablas** en PostgreSQL, **30 endpoints REST**, operaciones
transaccionales con rollback, auditoría automática y una suite de tests xUnit.

## 2. Objetivo del backend

- Exponer endpoints REST para que la app móvil pueda crear, consultar y modificar los datos del dominio.
- Validar la identidad del usuario mediante credenciales propias (BCrypt + JWT) y confirmar la verificación de email en Firebase antes de emitir la sesión.
- Mantener la persistencia de usuarios, silos, lecturas, alertas, umbrales, lotes y auditoría en PostgreSQL.
- Aplicar las reglas de negocio críticas: roles permitidos, propiedad de recursos (ownership), estados de alerta y de lote, cálculo del score de calidad y recomputo del estado del silo.
- Garantizar consistencia de datos mediante transacciones con rollback en las operaciones maestro-detalle y de consolidación.
- Registrar automáticamente una traza de auditoría de las operaciones sensibles.

El backend no contiene pantallas ni prototipos. Su función es servir **datos, seguridad y
reglas** al frontend móvil.

## 3. Stack tecnológico

| Aspecto | Tecnología usada | Uso dentro del proyecto |
|---|---|---|
| Runtime / Framework | .NET 10 · ASP.NET Core Web API | Construcción de la API REST mediante controllers |
| Base de datos | PostgreSQL 16 | Persistencia de usuarios, silos, lecturas, alertas, lotes, auditoría |
| ORM | Entity Framework Core + Npgsql | Mapeo de entidades, migraciones, consultas y transacciones |
| Autenticación | JWT propio (HS256) + Firebase Admin SDK | Login con BCrypt + JWT; gate de email verificado vía Firebase |
| Hashing | BCrypt.Net | Hash+salt de contraseñas (salt embebido en el hash `$2a$…`) |
| Validación | FluentValidation | Validación declarativa de DTOs por filtro global |
| Documentación API | Swagger / OpenAPI | Visualización y prueba de endpoints en desarrollo |
| Contenedores | Docker Compose | PostgreSQL + pgAdmin para desarrollo local |
| Tests | xUnit | Pruebas de seguridad (hash/sanitización) y validators |

## 4. Arquitectura general

La arquitectura sigue un esquema cliente-servidor. El frontend móvil consume la API por HTTPS
enviando el JWT propio en el header `Authorization`. El backend valida el token, ejecuta la
lógica en servicios de negocio, persiste con Entity Framework Core y responde con DTOs
pensados para la app móvil.

```
┌─────────────────────────┐   HTTPS · Bearer <JWT>   ┌──────────────────────────────┐
│   App móvil (Expo/RN)   │ ───────────────────────► │        API .NET 10           │
└───────────┬─────────────┘                          │  ┌────────────────────────┐  │
            │ registro + verificación email          │  │ SiloGuard.Api          │  │  presentación
            ▼                                         │  │ Controllers · DTOs ·   │  │
┌─────────────────────────┐                          │  │ Middleware · Swagger   │  │
│    Firebase Auth        │◄─── Admin SDK (login) ────┤  ├────────────────────────┤  │
│  (email_verified)       │                          │  │ SiloGuard.Business     │  │  negocio
└─────────────────────────┘                          │  │ Services · Validators ·│  │
                                                      │  │ JWT · BCrypt · XSS     │  │
                                                      │  ├────────────────────────┤  │
                                                      │  │ SiloGuard.Data         │  │  datos
                                                      │  │ EF Core · Repos · UoW ·│  │
                                                      │  │ Migraciones · Seeder   │  │
                                                      │  └───────────┬────────────┘  │
                                                      └──────────────┼───────────────┘
                                                                     ▼
                                                        ┌──────────────────────────┐
                                                        │  PostgreSQL 16 (Docker)  │
                                                        │  14 tablas · pgAdmin     │
                                                        └──────────────────────────┘
```

**Figura 1.** Esquema general del backend y sus capas. `SiloGuard.Data` no referencia a ningún
proyecto propio; `SiloGuard.Business` referencia a `Data` (usa sus entidades y las interfaces
de repositorio de `Data.Abstractions`, pero **nunca importa EF Core**); `SiloGuard.Api`
referencia a ambas. El acceso a datos vive exclusivamente en `Data/Repositories`.

## 5. Autenticación y seguridad

A diferencia de un backend que solo valida un token externo, SiloGuard implementa
**credenciales propias**: el login valida email + contraseña contra un hash BCrypt guardado
en la base, y emite un **JWT propio**. Firebase se usa únicamente para el envío del correo de
verificación (registro) y para confirmar, vía Admin SDK, que el email esté verificado antes
de emitir la sesión.

1. El usuario se registra desde el frontend → se crea la cuenta en Firebase (envía el mail de verificación) **y** en PostgreSQL (`POST /api/auth/register`, con BCrypt).
2. El usuario inicia sesión → `POST /api/auth/login`: el backend verifica `BCrypt.Verify(password, hash)` y consulta `email_verified` en Firebase (Admin SDK). Si no está verificado, responde 401 sin emitir token.
3. El backend emite su **JWT** (HS256) con claims de identidad y roles.
4. La app llama a los endpoints con `Authorization: Bearer <token>`.
5. El middleware `AddJwtBearer` valida **firma, emisor, audiencia y expiración** en cada request (stateless, sin tabla de sesiones).

**Reglas de seguridad aplicadas:**
- Todos los endpoints requieren autenticación, salvo `POST /api/auth/register`, `POST /api/auth/login` y `GET /health`.
- **Autorización por rol:** `GET /api/admin/usuarios` requiere rol `Admin` (`[Authorize(Roles="Admin")]`).
- **Propiedad de recursos (ownership):** un usuario solo puede ver/editar/borrar sus propios silos, alertas y lotes; el acceso a un recurso ajeno responde 403 (`GetOwnedAsync`).
- **Anti-XSS:** todo texto libre pasa por `HtmlInputSanitizer` antes de persistir (`<script>` → texto neutralizado).
- **Anti-SQLi:** EF Core parametriza todas las consultas; no hay SQL crudo en el backend.

## 6. Parte 6 — Arquitectura, ejecución y evidencias

### 6.1 Arquitectura y decisiones técnicas

El backend se organiza en capas: los controllers reciben las solicitudes HTTP, los servicios
aplican las reglas de negocio, los repositorios + `DbContext` administran el acceso a
PostgreSQL, y los DTOs definen qué información se intercambia con el frontend.

| Capa | Responsabilidad | Ejemplo en el proyecto |
|---|---|---|
| Controllers | Reciben pedidos y devuelven respuestas REST | `SilosController`, `UmbralesController`, `AlertasController` |
| Services | Lógica de negocio, validaciones, transacciones | `SiloService`, `UmbralService`, `LoteService` |
| Data / EF Core | Mapea entidades a PostgreSQL, ejecuta consultas | `SiloGuardDbContext`, repositorios, `UnitOfWork` |
| Domain (Entities) | Define entidades y estados del sistema | `Silo`, `Alert`, `Lote`, `Umbral`, `User` |
| DTOs | Adaptan los datos para no exponer entidades internas | `SiloResponse`, `UmbralesResponse`, `LoteResponse` |

Decisiones:
- **API REST** por ser simple de consumir desde una app móvil y suficiente para el alcance.
- **PostgreSQL** porque el dominio tiene relaciones claras (usuarios, silos, lecturas, alertas, lotes).
- **Auth propia (BCrypt + JWT) + Firebase para verificación** — control total de roles sin reescribir el middleware, y hash+salt propio en la base.
- **EF Core** para trabajar con entidades y migraciones sin SQL manual.
- **Transacciones** en las operaciones críticas (alta de silo, umbrales, finalizar lote, compartir pasaporte) para evitar estados inconsistentes.
- **Auditoría automática** desde `SaveChangesAsync` para no depender de que cada servicio la registre a mano.

### 6.2 Instalación, configuración y ejecución

Requisitos: **.NET SDK 10** y **Docker + Docker Compose**.

```bash
# 1 · Clonar y entrar al backend
git clone https://github.com/juanmac12/siloguard-app.git
cd siloguard-app/backend

# 2 · Base de datos (Postgres 16 + pgAdmin en Docker)
cp .env.example .env
docker compose up -d db

# 3 · Herramienta de migraciones (una sola vez si no la tiene)
dotnet tool install --global dotnet-ef
export PATH="$PATH:$HOME/.dotnet/tools"

# 4 · Aplicar migraciones (crea las 14 tablas)
dotnet ef database update --project src/SiloGuard.Data --startup-project src/SiloGuard.Api

# 5 · Levantar la API (Swagger en :5210, escucha en toda la red)
ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"
```

Al arrancar en `Development`, la API aplica migraciones pendientes y corre el **seeder** (una
sola vez si `Users` está vacío; los datos extra se siembran de forma idempotente): 2 usuarios
demo con sus 2 roles, 6 silos, **1.014 lecturas** (169 por silo — 7 días de historial hora a
hora, suficiente para demostrar el paginado), 5 alertas, 2 lotes, 3 umbrales, 2 técnicos y 4
destinatarios. Además re-ancla los timestamps al presente para que el historial nunca aparezca
vacío en la demo.

- Usuario demo (Productor): `dev@siloguard.com` / `Demo1234`
- Usuario admin (Productor + Admin): `admin@siloguard.com` / `Admin1234`
- Swagger: `http://localhost:5210/swagger` · Health: `http://localhost:5210/health`
- pgAdmin: `http://localhost:5050` (`admin@siloguard.com` / `siloguard_dev_pw`)

**Configuración sensible:** cadena de conexión, JWT y ruta del service account de Firebase se
manejan con `appsettings.Development.json` y archivos no versionados. El
`firebase-service-account.json` está en `.gitignore` (no se commitea). Sin ese archivo, el
gate de verificación de email se omite con un warning (para no romper el arranque en dev); el
usuario `dev@siloguard.com` está en `VerificationBypassEmails` porque se crea directo en
Postgres y nunca pasa por Firebase.

### 6.3 Documentación de API / pruebas

| Evidencia o herramienta | Qué demuestra |
|---|---|
| Swagger / OpenAPI (`/swagger`) | Endpoints documentados, parámetros, cuerpos de request y respuestas |
| `GET /health` | La API responde y está disponible (sin auth) |
| Tests xUnit (`dotnet test`) | 12 casos verdes (9 métodos; un `[Theory]` aporta 4 casos): hash BCrypt, sanitización XSS, validators |
| Pruebas manuales con Swagger | Login, CRUD de silos, umbrales, resolución de alertas, pasaporte |
| Base de datos PostgreSQL (pgAdmin) | Persistencia real y trazas de `AuditLogs` |
| Seeder de datos | Datos suficientes para demostrar paginado y navegación |

Flujo mínimo para demostrar la API:
1. `POST /api/auth/login` → obtener el JWT.
2. `GET /api/silos` → listar silos del usuario.
3. `GET /api/silos/{id}/lecturas?range=7d&page=1&pageSize=50` → historial paginado.
4. `PUT /api/silos/{id}/umbrales` → editar umbrales (transacción); probar el caso inválido → 409 (rollback).
5. `PATCH /api/alertas/{id}/resolver` → resolver una alerta.
6. `POST /api/silos/{id}/lotes` → iniciar lote; `POST /api/lotes/{id}/finalizar` → consolidar el pasaporte.
7. Verificar en pgAdmin las filas nuevas en `AuditLogs`.

### 6.4 Repositorio, evidencias y presentación

| Elemento del repositorio | Función |
|---|---|
| `backend/README.md` | Resume stack, configuración, endpoints y ejecución |
| `src/SiloGuard.Api/Program.cs` | Configura API, autenticación, CORS, Swagger, EF Core, servicios, `/health` |
| `Controllers/` | Expone las rutas REST consumidas por el frontend |
| `Business/Services/` | Reglas de negocio y transacciones |
| `Data/` y `Migrations/` | Base de datos, migraciones, auditoría y seeder |
| `Data/Entities/` y `DTOs/` | Entidades del sistema y modelos de intercambio |
| `docker-compose.yml` | Levanta PostgreSQL + pgAdmin con volúmenes persistentes |
| `tests/SiloGuard.Tests/` | Suite xUnit (seguridad + validators) |

Evidencias recomendadas para la presentación: Swagger abierto, `/health` respondiendo, las 14
tablas en pgAdmin, la demo de rollback de umbrales, y las filas de auditoría generadas. Para
la exposición conviene mostrar primero el flujo desde la app y luego explicar cómo el backend
lo sostiene con endpoints, base de datos y reglas de negocio.

## 7. Modelo de dominio

El modelo se organiza alrededor de usuarios, silos y su monitoreo. Las entidades usan
identificadores propios y relaciones relacionales en PostgreSQL. Los estados se guardan como
texto para facilitar lectura y compatibilidad con el frontend. **14 tablas · 2 relaciones N-N**.

**Relaciones principales:**
- `User` 1–N `Silo` (los datos del establecimiento viven inline en `User`: `FarmName`, `FarmLoc`, `FarmHa`)
- `Silo` 1–N `SensorReading` · `Alert` · `Lote` · `Umbral` (con borrado en cascada)
- `Alert` 1–N `ConsultaSoporte`
- `Tecnico` 1–N `ConsultaSoporte`
- `User` 1–1 `PreferenciasNotificacion`
- **`User` N–N `Role`** mediante `UserRole` (tabla intermedia, PK compuesta)
- **`Lote` N–N `Destinatario`** mediante `LoteDestinatario` (tabla intermedia, PK compuesta)

| Entidad | Descripción |
|---|---|
| `User` | Productor. Guarda perfil, datos del establecimiento y `PasswordHash` (BCrypt) |
| `Role` · `UserRole` | Roles (Productor / Admin) y su asignación N-N |
| `Silo` | Silo/silobolsa monitoreado. Guarda última lectura desnormalizada y estado (ok/warn/critical) |
| `SensorReading` | Lectura de sensores (CO₂, temp, humedad) con timestamp. Check constraints de rango |
| `Alert` | Anomalía detectada (critical/warning/resolved) con nota de resolución |
| `Umbral` | Umbral de alerta por silo y variable (temp/hum/co2), con Warn y Crit. Check `Warn < Crit` |
| `Lote` | Ciclo de almacenamiento con Pasaporte de Calidad (score, promedios, alertas resueltas) |
| `Destinatario` · `LoteDestinatario` | Bancos/acopios/compradores y con quién se compartió cada pasaporte (N-N) |
| `Tecnico` · `ConsultaSoporte` | Técnico de contacto y consultas enviadas desde una alerta |
| `PreferenciasNotificacion` | Preferencias de notificación por usuario (1-1) |
| `AuditLog` | Traza automática de altas/cambios/bajas de entidades sensibles |

> El diseño completo, con columnas y decisiones (desnormalización de últimas lecturas, snapshot
> del lote, check constraints como base del rollback), está en `docs/MODELO-DE-DATOS.md`.

## 8. Módulos funcionales del backend

| Módulo | Responsabilidad principal |
|---|---|
| Autenticación | Registro, login (BCrypt + JWT), gate de email verificado en Firebase |
| Perfil | Consultar/actualizar datos propios, cambio de contraseña, preferencias de notificación |
| Silos | ABM de silos + lectura inicial transaccional; historial paginado de lecturas |
| Umbrales | ABM maestro-detalle de umbrales por silo (reemplazo transaccional, restaurar recomendados) |
| Alertas | Listar (filtrable), consultar, resolver alertas; consultas a técnico |
| Lotes (Pasaporte) | Iniciar/finalizar lote, computar score y promedios, compartir pasaporte (N-N) |
| Soporte | Catálogo de técnicos y consultas enviadas desde una alerta |
| Admin | Listado de usuarios (protegido por rol Admin) |
| Auditoría | Registro automático de operaciones sensibles vía `SaveChangesAsync` |

## 9. Reglas de negocio principales

- **Registro:** crea el usuario con rol `Productor` por defecto; el email debe ser único.
- **Login:** valida contraseña con BCrypt y exige `email_verified` en Firebase (salvo emails en `VerificationBypassEmails`); si no verifica, 401 sin token.
- **Ownership:** un silo/alerta/lote solo es accesible por su dueño; el acceso ajeno responde 403.
- **Alta de silo:** crea el silo junto con su lectura inicial en una **transacción**; si la lectura viola un check constraint de rango, se revierte todo (no queda silo huérfano).
- **Estado del silo:** se recalcula (ok/warn/critical) según los umbrales al registrar una lectura o resolver una alerta.
- **Umbrales:** al guardar (`PUT`), se **reemplazan las 3 filas** (temp/hum/co2) en una transacción; si `Warn ≥ Crit`, el check `CK_Umbral_WarnLtCrit` falla y se revierte, devolviendo 409; `DELETE` restaura los valores recomendados.
- **Resolver alerta:** solo si está activa; cambia estado a `resolved`, registra la nota, incrementa `alerts_resolved` del lote activo y recalcula el estado del silo.
- **Iniciar lote:** solo uno activo por silo a la vez (409 si ya hay uno en `monitoring`); toma un snapshot de grano/tonelaje al iniciar.
- **Finalizar lote:** computa **score + promedios** sobre las lecturas de la ventana `[inicio, fin]` y cuenta las alertas resueltas, todo en una transacción (consolidación).
- **Compartir pasaporte:** alta N-N idempotente y transaccional (no duplica destinatarios ya compartidos).

Las reglas críticas se ejecutan dentro de **transacciones** (`IUnitOfWork` con
`BeginTransaction`/`Commit`/`Rollback`) para mantener consistencia.

## 10. Endpoints principales

**30 endpoints REST** agrupados por recurso. La lista completa y ejecutable está en Swagger.

| Recurso | Endpoints principales | Uso |
|---|---|---|
| Auth (público) | `POST /api/auth/register` · `POST /api/auth/login` | Crear cuenta · obtener JWT |
| Perfil | `GET/PUT /api/perfil` · `PUT /api/perfil/password` · `GET/PUT /api/perfil/notificaciones` | Datos, contraseña, preferencias |
| Silos | `GET/POST /api/silos` · `GET/PUT/DELETE /api/silos/{id}` | ABM de silos |
| Lecturas | `GET /api/silos/{id}/lecturas?range=&page=&pageSize=` | Historial paginado (Skip/Take) |
| Umbrales | `GET/PUT/DELETE /api/silos/{siloId}/umbrales` | ABM maestro-detalle (transaccional) |
| Alertas | `GET /api/alertas?status=&variant=` · `GET /api/alertas/{id}` · `PATCH /api/alertas/{id}/resolver` | Listar (filtro 2 params) · resolver |
| Consultas | `POST /api/alertas/{id}/consultas` · `GET /api/consultas` · `GET /api/tecnicos` | Contacto con técnico |
| Lotes | `GET /api/lotes` · `GET /api/lotes/{id}` · `POST /api/silos/{id}/lotes` · `POST /api/lotes/{id}/finalizar` | Pasaporte de Calidad |
| Compartir | `GET /api/destinatarios` · `GET /api/lotes/{id}/destinatarios` · `POST /api/lotes/{id}/compartir` | N-N transaccional |
| Admin | `GET /api/admin/usuarios` | Rutas protegidas por rol |
| Health | `GET /health` | Verificar que la API está activa (sin auth) |

## 11. Persistencia y configuración

La persistencia se realiza con **PostgreSQL** vía Entity Framework Core, que define tablas,
relaciones, índices, check constraints y migraciones. El backend **aplica migraciones al
iniciar** (en `Development`), por lo que la base queda creada o actualizada automáticamente, e
incluye un **seeder** de datos de prueba útil para demostrar paginado y flujo de uso.

- **Índices:** `SensorReadings(SiloId, Timestamp)` para el historial; índices únicos en `Umbrales(SiloId, Variable)` y en la FK 1-1 de preferencias.
- **Migraciones:** 3 aplicadas — `InitialCreate`, `AddLotes` y `AddUmbralesPasaporteCompartidoYSoporte`.
- **Check constraints (5):** rangos de sensores (`CK_SensorReading_Temp_Range` -50..150, `CK_SensorReading_Hum_Range` 0..100, `CK_SensorReading_Co2_Range` >= 0) y en umbrales `CK_Umbral_WarnLtCrit` (`Warn < Crit`) y `CK_Umbral_Warn_Positive` (`Warn > 0`) — además de validar, son la base de la demo de rollback transaccional.
- **Configuración:** cadena de conexión, JWT y ruta del service account se manejan con `appsettings.Development.json` y `.env` no versionados. `docker-compose.yml` levanta Postgres + pgAdmin con volumen persistente.

*(SiloGuard no maneja carga de archivos: no hay adjuntos en el dominio.)*

## 12. Notificaciones

El dominio contempla notificaciones al productor (alertas push y preferencias), materializadas
en el backend a través de:

- **Alertas persistidas** (`Alerts`): cada anomalía queda registrada con su estado y, al
  resolverse, con la nota de acción tomada — el frontend las lista y filtra.
- **Preferencias de notificación** (`PreferenciasNotificacion`, 1-1 con el usuario):
  advertencias on/off y silencio nocturno con rango horario, vía `GET/PUT /api/perfil/notificaciones`.

**Fuera del alcance actual** (declarado): el **envío real de push** (Expo/FCM) y un **servicio
en segundo plano** que evalúe periódicamente las lecturas para disparar alertas de forma
autónoma. En el MVP las lecturas provienen del seeder (la lanza IoT está simulada); la
infraestructura de alertas y preferencias ya está lista para conectar el envío real sin
cambiar el modelo.

## 13. Errores, validaciones y observabilidad

- Los errores se centralizan en un **middleware global** (`ExceptionHandlingMiddleware`): las excepciones de negocio tipadas se traducen a respuestas claras; las inesperadas devuelven un 500 genérico y el stack trace queda **solo en el log del servidor** (nunca se expone al cliente).
- **Códigos HTTP** adecuados: `400` validación, `401` falta/invalidez de token, `403` rol o propiedad inválida, `404` recurso inexistente, `409` conflicto de estado (p. ej. rollback de umbrales o lote ya activo).
- **Validación declarativa** con FluentValidation (11 validators) aplicada por un filtro global; **sanitización anti-XSS** de todo texto libre.
- **Swagger/OpenAPI** permite probar la API en desarrollo con esquema Bearer.
- **`GET /health`** permite verificar que la API esté activa sin requerir autenticación.
- **Tests xUnit** (`dotnet test`): 12 casos verdes (9 métodos, uno de ellos `[Theory]` con 4 `[InlineData]`) cubriendo hashing BCrypt, sanitización anti-XSS y validators.

## 14. Alcance actual y pendientes razonables

- **Implementado:** API REST, auth híbrida (BCrypt+JWT propio + gate Firebase), usuarios y roles, silos con ABM, lecturas con historial paginado, alertas con resolución, umbrales configurables (ABM transaccional), lotes con Pasaporte de Calidad y compartición N-N, soporte técnico, preferencias de notificación, auditoría automática, seeder y tests.
- **Fuera de alcance actual** (razonable para el MVP): envío real de notificaciones push, servicio en segundo plano de evaluación de lecturas, ingreso de lecturas desde hardware IoT real (hoy simulado por el seeder), entidad de dispositivo IoT ("lanzas") en el backend, y almacenamiento de archivos.

## 15. Conclusión

El backend de SiloGuard cumple el rol central del producto porque concentra las reglas de
negocio que hacen posible el monitoreo y la alerta temprana: registrar productores, mantener
silos y sus lecturas, disparar y resolver alertas, configurar umbrales, y certificar la
calidad de cada lote — manteniendo consistencia de estados y una traza de auditoría.

La solución es suficiente para una entrega final porque separa correctamente
responsabilidades: el frontend se ocupa de la experiencia visual y el backend de la
**seguridad, la persistencia y la lógica transaccional**, con una arquitectura en tres capas,
un modelo de datos relacional de 14 tablas y operaciones críticas protegidas por
transacciones con rollback. A futuro, el proyecto puede evolucionar sumando el envío real de
push, la ingesta de lecturas desde la lanza IoT y tareas en segundo plano, sin cambiar la idea
principal del sistema.

---

*Documentación final del backend de SiloGuard · TP Integrador Programación III TUP 2026.
Complementa a `docs/MODELO-DE-DATOS.md`, `docs/CHECKLIST-DEFENSA.md` y `backend/README.md`.*
