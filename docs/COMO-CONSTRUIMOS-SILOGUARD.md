# Cómo construimos SiloGuard — la clase completa

> Guía maestra del proyecto, escrita para que cualquier integrante del equipo pueda
> explicar **qué es la app, por qué existe y cómo está hecha**, con el nivel de detalle
> que exige una defensa. Complementa a `CHECKLIST-DEFENSA.md` (que es el guion operativo
> de la demo); esto es el **entendimiento de fondo**.

---

## 1 · El problema: la plata que se pudre en el campo

En Argentina una parte enorme de la cosecha no se vende al momento: se **almacena**
esperando mejor precio — en silos fijos y, sobre todo, en silobolsas tiradas en el lote.
Ese grano guardado es capital inmovilizado, y es **perecedero**: si entra humedad, si la
temperatura sube, si el grano empieza a respirar de más (fermentación), se arruina. Las
pérdidas postcosecha se estiman en varios puntos porcentuales de la producción — millones
de dólares que se pudren en silencio, porque el productor **no tiene visibilidad** de lo
que pasa adentro de la bolsa. Se entera cuando abre, y ya es tarde.

**SiloGuard es la respuesta a eso**: una lanza con sensores (IoT) clavada en el silo mide
**CO₂, temperatura y humedad** en continuo, y una app móvil convierte esas señales en
información accionable. La promesa central del producto: **avisarte con ~48 horas de
anticipación** — el tiempo que tenés para actuar (airear, inspeccionar, llamar al técnico)
antes de que la pérdida sea irreversible.

### Los tres pilares del producto

1. **Monitoreo** — dashboard multi-silo con estado (verde/amarillo/rojo), lecturas en vivo
   e historial gráfico para ver tendencias y confirmar que una acción correctiva funcionó.
2. **Alertas** — cuando una variable cruza el umbral, alerta Crítica o Advertencia en
   lenguaje simple: qué pasa, dónde, cuánto tiempo tenés y qué hacer. Se cierra con una
   nota de resolución (trazabilidad de la acción).
3. **Pasaporte de Calidad** — el diferencial comercial: cada ciclo de almacenamiento (un
   **Lote**) genera un certificado con score de calidad, promedios y alertas resueltas,
   **compartible con bancos, acopios y compradores**. El grano bien cuidado vale más si
   podés demostrarlo.

### Decisiones de alcance (MVP)

- Un solo rol real (productor); Admin existe para demostrar autorización por roles.
- La lanza IoT se **simula**: el seeder genera las lecturas (una por hora). La
  arquitectura está lista para recibir hardware real (sería un `POST` de lecturas).
- Recomendación manual de aireación (sin control remoto del ventilador).
- Español rioplatense, dark-first, tab bar de 4 secciones: Dashboard · Alertas · Calidad · Perfil.

---

## 2 · La arquitectura en una imagen

```
┌─────────────────────────┐         ┌──────────────────────────────────────┐
│   APP MÓVIL (Expo Go)   │  HTTPS  │            API .NET 10               │
│  React Native + Expo    │ ──────► │  ┌────────────────────────────────┐  │
│  Router                 │  JWT    │  │ SiloGuard.Api  (presentación)  │  │
│                         │         │  │ Controllers · DTOs · Middleware│  │
│  src/app      pantallas │         │  └───────────────┬────────────────┘  │
│  src/services clientes  │         │  ┌───────────────▼────────────────┐  │
│  AppDataContext estado  │         │  │ SiloGuard.Business  (negocio)  │  │
│  expo-secure-store  JWT │         │  │ Services · Validators · JWT ·  │  │
└───────────┬─────────────┘         │  │ BCrypt · Sanitización (sin EF) │  │
            │                       │  └───────────────┬────────────────┘  │
            │ registro +            │  ┌───────────────▼────────────────┐  │
            │ verificación email    │  │ SiloGuard.Data  (datos)        │  │
            ▼                       │  │ EF Core · Repos · UnitOfWork · │  │
┌─────────────────────────┐         │  │ Migraciones · Seeder           │  │
│    Firebase Auth        │◄────────┤  └───────────────┬────────────────┘  │
│  (email_verified via    │  Admin  └──────────────────┼───────────────────┘
│   Admin SDK)            │  SDK                       ▼
└─────────────────────────┘              ┌──────────────────────────┐
                                         │  PostgreSQL 16 (Docker)  │
                                         │  14 tablas · pgAdmin     │
                                         └──────────────────────────┘
```

**Por qué 3 capas** (y no un solo proyecto): separación de responsabilidades verificable.
`Api` traduce HTTP ↔ negocio; `Business` decide (reglas, validación, seguridad) sin saber
qué base de datos hay; `Data` es el único lugar que conoce EF Core y SQL. Las interfaces
de repositorio viven en `Data.Abstractions` para que Business las consuma **sin crear una
referencia circular**. Beneficio práctico: podés testear Business sin base de datos (así
funcionan nuestros 12 tests) y podrías cambiar Postgres por otro motor tocando solo Data.

---

## 3 · El modelo de datos (14 tablas) y sus porqués

### Núcleo

| Tabla | Qué guarda | Decisión de diseño |
|---|---|---|
| `Users` | Productor: datos + **PasswordHash BCrypt** | Hash+salt propio (el salt va embebido en el hash `$2a$11$...`) — no delegamos credenciales |
| `Roles` / `UserRoles` | Roles y su asignación | **N-N real**: PK compuesta (UserId, RoleId). El admin tiene 2 roles para demostrarlo |
| `Silos` | El activo monitoreado | **Desnormalización deliberada**: `LastCo2/LastTemp/LastHum/LastReadingAt` viven en el silo para pintar el dashboard **sin** joinear miles de lecturas. Costo: mantenerlos al día; beneficio: 1 query para la pantalla más usada |
| `SensorReadings` | Serie temporal (1/hora) | Índice compuesto `(SiloId, Timestamp)` para el historial. **Check constraints** de rango (Temp −50..150, Hum 0..100, CO₂ ≥ 0): la base es la última línea de defensa, y son la pieza que hace demostrable el rollback |
| `Alerts` | Anomalías (critical/warning/resolved) | La resolución guarda nota y fecha: trazabilidad de qué hizo el productor |

### Pasaporte de Calidad

| Tabla | Qué guarda | Decisión |
|---|---|---|
| `Lotes` | Un ciclo de almacenamiento (iniciar→finalizar) | Snapshot de grano/tonelaje **al iniciar** (el silo puede cambiar después). Al finalizar, una **transacción** recalcula score y promedios sobre las lecturas de la ventana |
| `Destinatarios` | Bancos / acopios / compradores | Catálogo |
| `LoteDestinatarios` | **Con quién se compartió cada pasaporte** | **Segunda N-N** (PK compuesta LoteId+DestinatarioId + fecha). Convierte "compartir" de un botón decorativo en un hecho de negocio auditado |

### Configuración y soporte

| Tabla | Qué guarda | Decisión |
|---|---|---|
| `Umbrales` | 3 filas por silo (temp/hum/co2) con Warn y Crit | Detalle 1-N del maestro Silo. Check `Warn < Crit` **en la DB a propósito**: la validación de aplicación lo deja pasar para que el rollback transaccional sea un camino real y demostrable |
| `Tecnicos` / `ConsultasSoporte` | Técnicos y consultas escritas desde una alerta | La consulta referencia alerta + técnico + usuario; el mensaje pasa por el sanitizador XSS |
| `PreferenciasNotificaciones` | Advertencias on/off, silencio nocturno | **1-1 real** con Users (FK única) |
| `AuditLogs` | Quién hizo qué y cuándo | Se puebla **sola** desde `SaveChangesAsync` — ningún service escribe auditoría a mano, por eso es imposible olvidarla |

**Migraciones** (3): `InitialCreate` → `AddLotes` → `AddUmbralesPasaporteCompartidoYSoporte`.
**Seeder**: usuario demo, 6 silos, ~1000 lecturas (para que el paginado tenga qué paginar),
5 alertas, lotes, técnicos, destinatarios. Es **idempotente** (cada bloque chequea si ya
existe) y **re-ancla los timestamps al presente** en cada arranque — sin eso, a los pocos
días los rangos del historial quedarían vacíos en la demo.

---

## 4 · Autenticación: el diseño híbrido (sabelo defender)

La decisión más preguntable del proyecto. El flujo:

- **Registro** (`register.tsx`): crea la cuenta en **Firebase** (que envía el email de
  verificación) **y** en nuestra base (`POST /api/auth/register`, con BCrypt). Si la API
  falla, borramos la cuenta de Firebase recién creada para poder reintentar.
- **Login** (`POST /api/auth/login`): 100 % nuestro. `AuthService` busca por email,
  verifica `BCrypt.Verify(password, hash)`, y **además** consulta a Firebase (Admin SDK,
  paquete `FirebaseAdmin`) si el email está verificado. Sin verificar → 401 sin token.
- **Sesión**: emitimos **nuestro propio JWT** (HS256) con claims de identidad y roles. El
  front lo guarda en `expo-secure-store` y lo manda como `Authorization: Bearer` en cada
  request.

**¿Cómo se valida el token en cada request?** No se compara contra nada guardado: el
middleware `AddJwtBearer` **recalcula la firma** con la clave secreta y verifica issuer,
audience y expiración. Es stateless — la criptografía reemplaza a la tabla de sesiones.

**¿Por qué híbrido y no todo Firebase?** Firebase resuelve gratis lo tedioso (emails de
verificación); mantener el login propio nos deja hash+salt en nuestra tabla (rúbrica 1.3
completa), control de roles en el JWT y cero reescritura del middleware. Decisión de
ingeniería: máximo valor, mínimo riesgo.

---

## 5 · Los patrones del backend, explicados

- **Repository + UnitOfWork** — los services no ven el `DbContext`; piden datos a
  interfaces (`ISiloRepository`, `IUmbralRepository`...) y confirman con
  `IUnitOfWork.SaveChangesAsync/BeginTransaction/Commit/Rollback`. Testeable y sin EF en Business.
- **Middleware global de errores** — `ExceptionHandlingMiddleware` es el primer eslabón
  del pipeline: excepciones de negocio tipadas (`NotFoundException` → 404,
  `ConflictException` → 409, `ForbiddenAppException` → 403...) se traducen a respuestas
  claras; **lo inesperado devuelve un 500 genérico y el stack trace va solo al log**.
  Demo clásica: romper la connection string y mostrar que el cliente no ve nada técnico.
- **Validación declarativa** — 11 validators FluentValidation aplicados por un
  `ValidationFilter` global: cualquier DTO con validator registrado se valida solo,
  sin repetir código en los controllers. 400 con detalle por campo.
- **Sanitización anti-XSS** — `HtmlInputSanitizer` limpia todo texto libre antes de
  persistir: `<script>alert(1)</script>` se guarda como `alert(1)`. Anti-SQLi: EF Core
  parametriza todo; el repo no tiene una sola línea de SQL crudo.
- **Ownership además de autenticación** — estar logueado no alcanza: `GetOwnedAsync`
  verifica que el silo/lote/alerta sea **tuyo** o responde 403. (Autenticación = quién
  sos; autorización = qué podés tocar.)
- **Auditoría automática** — override de `SaveChangesAsync`: toda alta/cambio/baja de
  `Silo`, `Alert`, `Lote`, `Umbral`, `LoteDestinatario` genera una fila en `AuditLogs`
  con usuario y timestamp, sin que nadie lo pida.

### Las 3 transacciones (rúbrica Parte 4)

1. **Alta de silo** = maestro-detalle: Silo + lectura inicial en una transacción. Lectura
   fuera de rango → el check de la DB la rechaza → rollback → no queda silo huérfano.
2. **Umbrales (PUT)** = reemplazo del detalle completo: borra las 3 filas e inserta las
   nuevas. Si `warn ≥ crit`, el INSERT viola `CK_Umbral_WarnLtCrit` → **rollback** → los
   umbrales anteriores quedan intactos (verificable con GET). 409 con mensaje claro.
3. **Finalizar lote** = consolidación: calcula promedios y score sobre las lecturas de la
   ventana, cuenta alertas resueltas, cambia estado y fecha — todo o nada.

---

## 6 · El frontend por dentro

- **Expo Router** (file-based): `src/app/(tabs)/` son las 4 secciones; `silo/[id]`,
  `alerta/[id]`, `umbrales/[siloId]` son rutas dinámicas. 27 vistas.
- **`AppDataContext`** — el estado global: al arrancar valida el token guardado contra la
  API (nunca muestra un dashboard vacío con sesión rota) y carga perfil/silos/alertas/lotes.
  Expone acciones (`addSilo`, `resolveAlert`, `iniciarLote`, `filterAlerts`...) que llaman
  a los services y actualizan el estado.
- **`src/services/*Api.ts`** — un cliente por dominio sobre `apiFetch` (config/api.ts):
  agrega el JWT, traduce errores HTTP a `ApiError` con mensaje humano, y ante 401 limpia
  el token y redirige al login.
- **Filtros y paginado hechos como pide la rúbrica**: las solapas de Alertas mandan
  `?status=&variant=` (el WHERE se arma en el servidor) y el historial pagina con
  `page/pageSize` reales contra la DB (Skip/Take) con "Cargar más".
- **Design system propio** — tokens (colores de estado, spacing 8pt, radios) y componentes
  reutilizables (`AlertCard`, `SensorStat`, `StatusBadge`...). Íconos unificados — al
  grupo FoodSave le observaron inconsistencia de íconos; nosotros lo resolvimos por diseño.
- **Estados especiales**: banners de offline (celular sin red vs. lanza sin respuesta),
  acciones deshabilitadas con hint, empty states por pantalla.

---

## 7 · Dos flujos completos para narrar en vivo

**Login**: pantalla valida campos → `authApi.login()` → `POST /api/auth/login` →
`AuthController` → `AuthService` (BCrypt.Verify + gate de Firebase) → JWT → el front lo
guarda en SecureStore → `loadAll()` → Dashboard.

**CRUD de Umbrales (vista → API → DB)**: pantalla `umbrales/[siloId].tsx` (sliders +
validación visual) → `umbralApi.save()` → `PUT /api/silos/{id}/umbrales` con Bearer →
`UmbralesController` (ruta + `[Authorize]` + ValidationFilter) → `UmbralService.UpdateAsync`
(ownership + transacción: DELETE de los 3 viejos, INSERT de los 3 nuevos) →
`UmbralRepository` → tabla `Umbrales` + fila automática en `AuditLogs`. Y la vuelta: la
respuesta actualiza la UI con toast de éxito.

---

## 8 · Estado de verificación — qué está probado y qué falta

### ✅ Verificado automáticamente (hoy, contra la API corriendo)

- Login OK y request sin token → 401.
- 6 silos del seed; paginado real: 24/48/168 lecturas según rango (post-fix de timestamps).
- Filtro por 2 parámetros en la API (`?status=active&variant=critical` → 1 alerta).
- CRUD de umbrales completo + **rollback demostrado** (PUT inválido → 409, datos intactos).
- Compartir pasaporte (N-N), técnicos, consultas con sanitización XSS verificada, preferencias.
- `dotnet test`: **12/12 verdes** · `tsc --noEmit`: sin errores · Docker DB healthy.

### 🖐️ Falta probar A MANO (no puedo tocar tu celular) — hacelo HOY

1. **La app entera en Expo Go** en el celular (misma Wi-Fi; IP en `src/config/api.ts` =
   `192.168.0.9` — verificá que siga siendo la IP de tu compu ese día: `hostname -I`).
2. **Registro completo con un email real**: cuenta nueva → llega el correo de Firebase →
   verificar → login. (Requiere `firebase-service-account.json` presente; si no está, el
   gate se salta con warning — probalo antes.)
3. **Recorrido de las 27 vistas** buscando errores visuales, textos cortados, navegación rota.
4. **Flujo alerta → resolver con nota → verla en Resueltas** desde el celular.
5. **Editar y eliminar un silo** desde la app y verlo desaparecer en pgAdmin (te lo van a pedir).
6. **Umbrales desde el celular** (yo lo probé por API, no desde la pantalla): guardar,
   ver el toast, forzar warn > crit y ver el error 409 en la UI.
7. **El QR de compartir pasaporte / share sheet** en el teléfono.
8. **Ensayo general de la demo por Meet**: compartir pantalla del emulador/celular,
   tiempos del guion (12 min), pestañas del editor pre-abiertas.

---

*Escrito el 15/07/2026, la noche antes de la entrega. Leelo una vez completo, después
repasá `CHECKLIST-DEFENSA.md`, y dormí — un expositor descansado explica mejor que uno
que estudió hasta las 5 AM.*
