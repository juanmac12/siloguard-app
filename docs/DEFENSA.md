# SiloGuard — Guía de estudio para la defensa

> TP Integrador Programación III (TUP 2026). Todo lo que hay que probar en la app y entender del backend, en un solo documento.
> Stack: App móvil **React Native + Expo** · API **.NET 10 + EF Core + PostgreSQL**.
> Usuario demo: `dev@siloguard.com` / `Demo1234`.
>
> *(Migrado desde `GUIA-ESTUDIO-SILOGUARD.html`, que vivía por error en la raíz del workspace padre en vez de en este repo. El detalle técnico completo está en `backend/README.md`, `ARQUITECTURA.md` y `docs/PRUEBAS-ENTREGA.md`.)*

---

## La app en 30 segundos

Si te preguntan "¿qué hace SiloGuard?", esto es lo que respondés:

SiloGuard le permite a un productor **monitorear el estado de sus silos de grano** desde el celular. Cada silo reporta tres sensores — **CO₂**, **Temperatura**, **Humedad** — y la app:

- muestra el estado de cada silo (ok / advertencia / crítico) y su historial,
- genera **alertas** cuando un sensor pasa un umbral, con una acción recomendada,
- y certifica cada ciclo de almacenamiento con un **Pasaporte de Calidad** (un "lote": se inicia, se monitorea y al finalizar se calcula un puntaje).

**Dos partes independientes:** la **app móvil** (lo que se ve) y la **API backend** (donde vive la lógica y la base de datos). La app no tiene datos propios: **todo lo pide a la API** por HTTP con un token.

---

## A. Checklist de prueba — App móvil

Levantar el backend y la app (ver sección G), entrar con el usuario demo y probar cada cosa funcionando el día de la defensa.

### 1. Autenticación y sesión
- [ ] Abrir la app sin sesión → Splash → pantalla de Login (nunca entra directo al Dashboard).
- [ ] Login con clave incorrecta → muestra el mensaje de error real de la API (401), no entra.
- [ ] Login con el usuario demo → entra al Dashboard con 6 silos cargados desde la API.
- [ ] Registrar un usuario nuevo → crea cuenta, manda mail de verificación, pantalla "Registro exitoso".
- [ ] Cerrar sesión desde Perfil → vuelve al Login; reabrir la app no entra sola.
- [ ] Con el backend apagado, abrir la app → va al Login (no un dashboard vacío colgado).

### 2. Silos — ABM y maestro/detalle
- [ ] Dashboard lista los 6 silos, con estado, temperatura, humedad y CO₂.
- [ ] Tocar un silo → detalle con métricas reales del silo (maestro → detalle).
- [ ] Crear un silo con datos válidos → vuelve al Dashboard y aparece el silo nuevo (201).
- [ ] Crear un silo con campos vacíos → errores de validación en el formulario (cliente).
- [ ] **[clave]** Crear un silo con lectura fuera de rango → da 409 y el silo NO queda creado → demuestra el rollback de la transacción.
- [ ] Editar y eliminar un silo → los cambios se ven al volver; eliminar pide confirmación.

### 3. Historial, filtros y paginado
- [ ] Cambiar el rango 24h / 48h / 7d → el gráfico cambia — el filtro lo resuelve la API, no el cliente.
- [ ] Botón "Cargar más lecturas" → trae la página siguiente desde la base (paginado real, ~1000 lecturas).

### 4. Alertas
- [ ] Tab Alertas lista 5 alertas, con severidad y silo asociado.
- [ ] Abrir el detalle de una alerta → sensor, valor, umbral y acción recomendada.
- [ ] Resolver una alerta con una nota → pasa a "resuelta" y persiste al recargar.

### 5. Perfil
- [ ] Editar perfil → "✓ Guardado", persiste al recargar.
- [ ] **[seguridad]** Editar perfil con `<script>alert(1)</script>` → se guarda sanitizado, sin las etiquetas (anti-XSS).
- [ ] Cambiar contraseña (clave actual incorrecta) → error claro, sin desloguear.
- [ ] Cambiar contraseña válida → después el login sólo funciona con la clave nueva.
- [ ] Cambiar tema oscuro/claro → toda la app cambia de tema.

### 6. Pasaporte de Calidad / Lotes
- [ ] En un silo sin lote → "Iniciar lote" → aparece la tarjeta "Lote en monitoreo" con N° y días.
- [ ] Tab Pasaporte → Activos → lista los lotes en monitoreo (incluye el recién iniciado), desde la API.
- [ ] Abrir un lote (certificado) → score, silo, grano, período, promedios y QR.
- [ ] "Finalizar y generar pasaporte" → el lote pasa a Certificados con score y promedios reales calculados de las lecturas.
- [ ] Iniciar un lote donde ya hay uno activo → mensaje "el silo ya tiene un lote en monitoreo" (no crea otro).

### 7. Manejo de errores
- [ ] Backend apagado + crear un silo → "No se pudo conectar al servidor…" (mensaje claro, no genérico).
- [ ] Token vencido durante el uso → la app redirige al Login automáticamente.

> No probar como "funcionalidad real": Mis lanzas y Notificaciones son mock; "Olvidé mi contraseña" (reset por mail) es trabajo futuro; los botones Google/Apple son decorativos.

---

## B. Cómo entender el backend

No hace falta memorizar código: entendé **cómo está organizado** y **cómo viaja un pedido**. Con eso respondés casi todo.

### La idea central: 3 capas

El backend está partido en tres proyectos, cada uno con una responsabilidad. La regla de oro: **la capa de arriba usa la de abajo, nunca al revés**, y sólo la capa de Datos toca la base.

| Capa | Rol | Dónde |
|---|---|---|
| **Api** — Presentación | La "recepción". Recibe el pedido HTTP, valida el token, arma la respuesta. Son los **Controllers**. No tiene lógica de negocio. | `SiloGuard.Api` · Controllers, Program.cs, Middleware, DTOs |
| **Business** — Negocio | El "cerebro". Las reglas: quién puede hacer qué, cómo se calcula un score, cuándo tirar un 409. Son los **Services**. | `SiloGuard.Business` · Services, Validators, JWT, BCrypt, Sanitización |
| **Data** — Datos | La "memoria". Habla con PostgreSQL vía EF Core. Son las **Entidades**, los **Repositorios** y el **DbContext**. Nadie más toca la base. | `SiloGuard.Data` · Entities, Repositories, Migrations, Seed |
| **Regla** | `Api` → usa → `Business` → usa → `Data` → usa → **PostgreSQL**. Si te preguntan "¿dónde está el acceso a datos?", la respuesta es: **sólo en Data**. | Cómo demostrarlo: no hay ningún `DbContext` dentro de Business. |

### Cómo leer el código (en este orden)

1. **Program.cs** — el arranque: registra servicios, middleware, auth. Es el "índice". *(SiloGuard.Api)*
2. Un **Controller**, ej. `SilosController.cs` — mirá los endpoints (los métodos con `[HttpGet]`, `[HttpPost]`…).
3. El **Service** que usa, `SiloService.cs` — acá está la lógica de verdad (la transacción, el ownership).
4. El **Repository**, `SiloRepository.cs` — la consulta a la base (LINQ / EF Core).
5. La **Entidad**, `Silo.cs` — la tabla como clase, y sus relaciones.

### Cómo viaja un pedido — `GET /api/silos`

1. **Api · Controller** — `SilosController` recibe el request, valida el **JWT** y saca el `userId` del token.
2. **Business · Service** — `SiloService` aplica la regla: "traé sólo los silos **de este usuario**".
3. **Data · Repository** — `SiloRepository` arma la consulta con **LINQ** (se traduce a SQL, parametrizado).
4. **Data · DbContext → PostgreSQL** — EF Core ejecuta el `SELECT` y devuelve las filas como objetos `Silo`.
5. **De vuelta:** el Service devuelve los `Silo`, el Controller los convierte a un **DTO** (`SiloResponse`) y responde **JSON**. El DTO existe para no exponer la entidad interna tal cual.

> **Tip de defensa:** si te piden "mostrame X en el código", abrí el Controller correspondiente y bajá por las capas. Casi todo se explica recorriendo Controller → Service → Repository.

---

## C. Los 8 conceptos que te van a preguntar

Son los puntos de la rúbrica. Para cada uno: qué es, qué decir, y dónde está en el código.

1. **Autenticación (JWT)** — Al hacer login, la API firma un token JWT con los datos del usuario. La app lo guarda y lo manda en cada pedido (`Authorization: Bearer …`). La API lo valida antes de responder.
   Dónde: `AuthService`, `JwtTokenService`, y `[Authorize]` en los controllers.

2. **Autorización y roles (N-N)** — Un usuario puede tener varios roles y un rol lo tienen varios usuarios → relación muchos-a-muchos con la tabla intermedia `UserRoles`. El admin ve `/api/admin/usuarios`; un productor no (403).
   Dónde: entidades `User`/`Role`/`UserRole`; `[Authorize(Roles=…)]`.

3. **Transacción + rollback** — Crear un silo inserta dos cosas (el silo + su lectura inicial). Si la segunda falla, la primera se deshace — no queda un silo "a medias". Eso es una transacción.
   Dónde: `SiloService.CreateAsync` (`BeginTransaction`/`Commit`/`Rollback`). También en `LoteService.FinalizarAsync`.

4. **Validación + sanitización** — Validación: campos obligatorios y rangos (FluentValidation) → si falla, 400 con el detalle. Sanitización: a los textos les saca HTML peligroso → no se puede inyectar `<script>` (anti-XSS).
   Dónde: `Validators/`, `HtmlInputSanitizer`.

5. **Paginado** — El historial de sensores tiene ~1000 lecturas. La API las devuelve de a páginas (`Skip`/`Take` contra la base), no todas juntas ni filtrando en el cliente.
   Dónde: `GET /api/silos/{id}/lecturas?range=&page=`, `LecturaService`.

6. **Manejo de errores** — Un middleware al inicio del pipeline envuelve toda la app: si algo explota, responde un mensaje seguro (`{ message }`) — nunca el stack trace. El detalle queda sólo en el log del servidor.
   Dónde: `ExceptionHandlingMiddleware`.

7. **Auditoría** — Cada alta/baja/modificación de `Silo`, `Alert` y `Lote` se registra sola en la tabla `AuditLogs` (qué, quién, cuándo), sin código extra en los services.
   Dónde: `SiloGuardDbContext.SaveChangesAsync`.

8. **Pasaporte / Lote** — Un Lote es un ciclo de guardado (1-N con Silo). Al finalizar, el backend calcula el pasaporte (score + promedios de sensores) desde las lecturas del período, en una transacción.
   Dónde: `LoteService`, `LotesController`.

---

## D. Los endpoints (mapa rápido)

Todo está en Swagger (`/swagger`) con el botón **Authorize** para pegar el token.

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/auth/login` | Login → devuelve el JWT |
| POST | `/api/auth/register` | Registra un usuario |
| GET | `/api/silos` | Lista los silos del usuario (maestro) |
| GET | `/api/silos/{id}` | Detalle de un silo |
| POST | `/api/silos` | Crea un silo (transacción cabecera + detalle) |
| GET | `/api/silos/{id}/lecturas` | Historial paginado + filtro por rango |
| GET | `/api/alertas` | Lista de alertas |
| POST | `/api/silos/{id}/lotes` | Inicia un lote (409 si ya hay uno activo) |
| POST | `/api/lotes/{id}/finalizar` | Finaliza el lote y calcula el pasaporte |
| GET | `/api/lotes` | Lista los lotes / pasaportes |
| GET | `/api/admin/usuarios` | Sólo rol Admin (si no, 403) |

---

## E. Glosario mínimo

| Término | Definición |
|---|---|
| API REST | El backend al que la app le pide datos por HTTP (GET/POST/PUT/DELETE). |
| Endpoint | Una dirección concreta de la API, ej. `GET /api/silos`. |
| DTO | "Data Transfer Object": el objeto con la forma exacta que se manda/recibe, distinto de la entidad interna. |
| Entidad | Una clase que representa una tabla de la base (ej. `Silo`). |
| ORM / EF Core | La herramienta que traduce clases C# ↔ tablas SQL, sin escribir SQL a mano. |
| DbContext | El objeto de EF Core que representa la conexión y las tablas. |
| Repositorio | La clase que encapsula las consultas a la base para una entidad. |
| Migración | Un script versionado que crea/actualiza el esquema de la base. |
| Seeder | Código que carga datos de prueba (los 6 silos, ~1000 lecturas, etc.). |
| JWT | Un token firmado que prueba quién sos en cada pedido. |
| BCrypt | El algoritmo que guarda la contraseña como hash (nunca en texto plano). |
| Middleware | Código que envuelve cada request (ej. el que atrapa errores). |
| LINQ | La forma de escribir consultas en C# que EF traduce a SQL. |

---

## F. Posibles preguntas de defensa

**¿Por qué el backend está en 3 capas?**
Para separar responsabilidades: la Api recibe pedidos, Business tiene las reglas, Data habla con la base. Eso hace el código más ordenado, testeable y evita que la lógica se mezcle con el acceso a datos. La regla es que sólo Data toca PostgreSQL.

**¿Cómo se protege una contraseña?**
Nunca se guarda en texto plano: se guarda el hash con BCrypt (que incluye un salt). Al hacer login, se compara el hash — la clave original no se puede recuperar de la base.

**Mostrame el rollback / la transacción**
En `SiloService.CreateAsync`: se abre una transacción, se inserta el silo y su lectura inicial; si la lectura viola un rango, salta la excepción y se hace Rollback — el silo tampoco queda. Se demuestra creando un silo con temperatura 999: da 409 y contando las filas antes/después, no se agregó nada.

**¿Dónde se filtra: en la app o en la API?**
En la API. El historial (`/api/silos/{id}/lecturas?range=&page=`) filtra por silo + rango y pagina con `Skip`/`Take` contra la base. El cliente sólo pide la página; no baja todo y filtra localmente.

**¿Cómo evitás inyección de SQL o de scripts?**
SQL: todo el acceso es con LINQ/EF Core parametrizado, no se concatena SQL. XSS: los textos libres pasan por un sanitizador que quita HTML peligroso antes de guardarlos (se prueba metiendo `<script>` en el nombre de un silo).

**¿Qué pasa si el servidor tira un error inesperado?**
Un middleware al inicio del pipeline lo atrapa y responde un mensaje seguro `{ message: "…error interno…" }`, sin stack trace. El detalle queda sólo en el log del servidor. Se demuestra rompiendo la cadena de conexión y llamando un endpoint: da 500 "limpio".

**¿Qué es el Pasaporte de Calidad y cómo se calcula?**
Es el certificado de un lote (un ciclo de guardado en un silo). Se inicia, se monitorea, y al finalizar el backend calcula el score y los promedios de CO₂/temp/humedad a partir de las lecturas del período, dentro de una transacción. El puntaje usa los mismos umbrales que definen si un silo está ok/advertencia/crítico.

**¿La app usa datos simulados?**
No. Todo lo real (silos, lecturas, alertas, perfil, lotes) viene de la API por HTTP con el token. Quedan como mock, y está declarado, sólo cosas fuera del alcance: "Mis lanzas", las preferencias de notificaciones y los botones de Google/Apple.

---

## G. Antes de la defensa — checklist express

- [ ] Levantar la base y la API: `docker compose up -d db` y luego `dotnet run --project src/SiloGuard.Api --urls http://0.0.0.0:5210` (en `SiloGuard/backend`).
- [ ] Verificar Swagger: abrir `http://localhost:5210/swagger` — deben aparecer todos los endpoints.
- [ ] Confirmar la IP en `src/config/api.ts` — debe ser la IP de la compu (`hostname -I`) y el celular en la misma red Wi-Fi.
- [ ] Cargar la credencial de Firebase Admin: el `firebase-service-account.json` en `backend/src/SiloGuard.Api/` (para el gate de email verificado).
- [ ] Arrancar la app: `npx expo start --go -c` en `SiloGuard/` y abrir con Expo Go.
- [ ] Tener a mano el usuario demo: `dev@siloguard.com` / `Demo1234` (6 silos, ~1000 lecturas, 5 alertas, 2 lotes).
