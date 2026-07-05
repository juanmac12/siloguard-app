# SiloGuard — Guía de pruebas para la entrega (Mobile + Backend API)

> Checklist de verificación **por capa**, pensado para correr antes de entregar y como
> guión durante la defensa. Complementa `PLAN-DE-PRUEBAS.md` (que está ordenado por
> funcionalidad); este documento está ordenado por **qué probar en la app** vs **qué
> probar en la API**, y marca qué cubre cada punto de la rúbrica.
>
> **Usuario demo (seeder):** `dev@siloguard.com` / `Demo1234` → 6 silos, ~1000 lecturas, 5 alertas.
> **Admin:** `admin@siloguard.com` (ver contraseña en el seeder / README del backend).

---

## 0. Antes de probar nada — levantar el entorno

```bash
# Terminal 1 — Backend + DB
cd SiloGuard/backend
docker compose up -d db
ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"

# Terminal 2 — App
cd SiloGuard
npx expo start --go -c
```

Verificaciones de arranque:

- [ ] `http://localhost:5210/swagger` abre y lista los endpoints.
- [ ] La IP en `src/config/api.ts` (`API_BASE_URL`) coincide con la IP LAN de la compu (`ip addr`).
- [ ] El celular está en la **misma red Wi‑Fi** que la compu.

> Si algo de esto falla, la app muestra "No se pudo conectar al servidor…" (mensaje claro,
> no un error genérico) — eso ya es un comportamiento a favor, no un bug.

---

# PARTE A — Pruebas en la app móvil (React Native / Expo)

> El foco acá es **UX, navegación, estados de carga/error y que consuma la API real**
> (rúbrica Parte 3 — UI e integración, y Parte 4 — maestro/detalle desde la app).

## A1. Autenticación y sesión

| # | Qué probar | Esperado | Rúbrica |
|---|---|---|---|
| A1.1 | Abrir la app sin sesión previa | Splash → **Login** (nunca directo al Dashboard) | 3.2 |
| A1.2 | Login con credenciales incorrectas | Alerta con el mensaje real de la API (401), no entra | 3.3 |
| A1.3 | Login con el usuario demo | Entra al Dashboard con 6 silos cargados de la API | 3.1 |
| A1.4 | Registro de usuario nuevo | Crea cuenta en Firebase + API propia, manda mail de verificación, pantalla "Registro exitoso" | 3.1 |
| A1.5 | Login con email sin verificar | 401 pidiendo verificar el correo *(requiere credencial Admin SDK configurada)* | 5.1 |
| A1.6 | Cerrar sesión desde Perfil | Vuelve al Login; reabrir la app no entra sola | 5.1 |
| A1.7 | App con sesión previa y **backend apagado** | Splash → **Login** (no un dashboard vacío/colgado) | 2.4 |

## A2. Silos — ABM y maestro/detalle

| # | Qué probar | Esperado | Rúbrica |
|---|---|---|---|
| A2.1 | Dashboard lista los silos | 6 silos con estado (ok/warn/critical), temp, humedad, CO₂ | 4.1 |
| A2.2 | Tocar un silo → detalle | Score + métricas reales de `GET /api/silos/{id}` | 4.1 |
| A2.3 | Crear silo (botón +) con datos válidos | 201, vuelve al Dashboard, aparece el silo nuevo | 4.2 |
| A2.4 | Crear silo con campos vacíos | Errores de validación **en el formulario (cliente)** | 3.3 |
| A2.5 | Crear silo con lectura fuera de rango (ej. temp 999) | 409 y el silo **no** queda creado (rollback) | 4.3 |
| A2.6 | Editar silo | Cambios visibles al volver al detalle y al Dashboard | 4.2 |
| A2.7 | Eliminar silo | Pide confirmación, desaparece con sus alertas | 4.2 |

## A3. Historial, filtros y paginado

| # | Qué probar | Esperado | Rúbrica |
|---|---|---|---|
| A3.1 | Historial de un silo, cambiar rango 24h / 48h / 7d | El gráfico cambia (el filtro lo resuelve la API, no el cliente) | 3.4 |
| A3.2 | Botón "Cargar más lecturas" | Trae la página siguiente desde la DB (paginado real) | 3.5 |

## A4. Alertas

| # | Qué probar | Esperado | Rúbrica |
|---|---|---|---|
| A4.1 | Tab Alertas | 5 alertas del seeder, con severidad y silo asociado | 4.1 |
| A4.2 | Detalle de alerta | Sensor, valor, umbral y acción recomendada | 4.1 |
| A4.3 | Resolver una alerta con nota | Pasa a "resuelta" y **persiste** al recargar/reabrir | 4.2 |

## A5. Perfil

| # | Qué probar | Esperado | Rúbrica |
|---|---|---|---|
| A5.1 | Editar perfil (nombre, teléfono, campo, hectáreas) | "✓ Guardado", persiste al recargar | 4.2 |
| A5.2 | Editar perfil con `<script>alert(1)</script>` en el nombre | Se guarda **sanitizado**, sin las tags | 5.3 |
| A5.3 | Cambiar contraseña con la actual incorrecta | Error "La contraseña actual no es correcta" (sin desloguear) | 5.1 |
| A5.4 | Cambiar contraseña con nueva < 8 chars / confirmación distinta | Errores de validación (cliente) | 3.3 |
| A5.5 | Cambiar contraseña válida | "✓ Contraseña cambiada"; login sólo funciona con la clave nueva | 5.1 |
| A5.6 | Cambiar tema oscuro/claro | Toda la app cambia de tema | 3.2 |

## A6. Manejo de errores en la app

| # | Qué probar | Esperado | Rúbrica |
|---|---|---|---|
| A6.1 | Apagar el backend y crear un silo | "No se pudo conectar al servidor…" (mensaje claro) | 2.4 |
| A6.2 | Token vencido/inválido durante el uso | La app redirige al Login automáticamente (401 → `clearToken`) | 5.2 |

## A7. Feedback visual (revisar de paso)

- [ ] Estados "Guardando…" / "Eliminando…" visibles durante las operaciones.
- [ ] Loading/spinner en el historial mientras trae datos.
- [ ] Confirmaciones antes de eliminar.

## A8. Pasaporte de Calidad / Lotes (feature real — persiste en el backend)

| # | Qué probar | Esperado | Rúbrica |
|---|---|---|---|
| A8.1 | Detalle de un silo sin lote activo → botón **"Iniciar lote"** | Se crea el lote; aparece la tarjeta "Lote en monitoreo" con N° y días | 4.2 |
| A8.2 | Tab Pasaporte → pestaña **Activos** | Lista los lotes en monitoreo (incluye el recién iniciado) desde la API | 3.1 |
| A8.3 | Tocar un lote (card) | Certificado con score, silo, grano, período, promedios y QR | 4.1 |
| A8.4 | Detalle del silo con lote activo → **"Finalizar y generar pasaporte"** | El lote pasa a **Certificados** con score y promedios reales computados | 4.2 |
| A8.5 | Tab Pasaporte → pestaña **Certificados** | Muestra los lotes finalizados | 3.1 |
| A8.6 | Iniciar un lote en un silo que ya tiene uno en monitoreo | Mensaje "El silo ya tiene un lote en monitoreo" (no crea otro) | 3.3 |

### ⚠️ Fuera de alcance — NO probar como funcionalidad real (declarado como mock)
- **Mis lanzas** — mock, sin entidad IoT.
- **Notificaciones** — toggles no persisten.
- **Configurar umbrales** — placeholder.
- **Google / Apple login** — botones decorativos.
- **"Olvidé mi contraseña"** (reset por email) — trabajo futuro. *(El cambio de contraseña desde Perfil sí funciona.)*

---

# PARTE B — Pruebas en la API backend (.NET 10 / EF Core / PostgreSQL)

> El foco acá es **contratos HTTP, códigos de estado, seguridad, transacciones y persistencia**
> (rúbrica Parte 1, 2 y 5). Probar con **Swagger** (`/swagger`, botón *Authorize*) o con `curl`.
> Swagger es la fuente de verdad de las rutas exactas.

## B0. Obtener el token (para el resto de las pruebas)

```bash
# Login → devuelve el JWT
TOKEN=$(curl -s -X POST http://localhost:5210/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@siloguard.com","password":"Demo1234"}' | jq -r '.token')
echo "$TOKEN"   # debe imprimir un JWT (3 bloques separados por puntos)
```

## B1. Autenticación y JWT (Parte 5.1)

| # | Request | Esperado |
|---|---|---|
| B1.1 | `POST /api/auth/login` con credenciales válidas | 200 + `token` (JWT propio) |
| B1.2 | `POST /api/auth/login` con password incorrecta | 401 |
| B1.3 | `POST /api/auth/register` con email nuevo | 201 (crea usuario en la DB propia) |
| B1.4 | `POST /api/auth/register` con email repetido | 409 |
| B1.5 | Login de un email registrado pero **no verificado en Firebase** | 401 pidiendo verificar *(requiere Admin SDK)* |

## B2. Endpoints, métodos HTTP y códigos (Parte 2.1)

```bash
# GET lista (maestro)
curl -s http://localhost:5210/api/silos -H "Authorization: Bearer $TOKEN" | jq '.[0]'

# GET detalle
curl -s http://localhost:5210/api/silos/1 -H "Authorization: Bearer $TOKEN" | jq

# POST crear → 201
curl -i -s -X POST http://localhost:5210/api/silos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nombre":"Silo Test","capacidad":100, ... }'   # ver campos exactos en Swagger

# PUT editar → 200
curl -i -s -X PUT http://localhost:5210/api/silos/1 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{...}'

# DELETE → 204
curl -i -s -X DELETE http://localhost:5210/api/silos/99 -H "Authorization: Bearer $TOKEN"
```

| # | Prueba | Esperado |
|---|---|---|
| B2.1 | GET lista / GET detalle | 200 |
| B2.2 | POST válido | 201 |
| B2.3 | PUT válido | 200 |
| B2.4 | DELETE válido | 204 |
| B2.5 | GET a un id inexistente | 404 |

## B3. Validación y sanitización (Parte 2.2 / 5.3)

| # | Prueba | Esperado |
|---|---|---|
| B3.1 | POST silo con campos obligatorios vacíos | 400 con detalle de errores por campo (FluentValidation) |
| B3.2 | POST silo con valor fuera de rango | 400/409 según el caso |
| B3.3 | Crear/editar con `<script>alert(1)</script>` en un texto | Se guarda **sin las tags** (anti‑XSS), verificable con un GET posterior |
| B3.4 | Intentar SQLi en un parámetro (`' OR 1=1 --`) | No ejecuta nada raro (LINQ/EF parametrizado) |

## B4. Filtro por 2 parámetros + paginado (Parte 3.4 / 3.5)

```bash
# Filtra por silo + rango de fecha, paginado — resuelto en la API
curl -s "http://localhost:5210/api/silos/1/lecturas?range=7d&page=1" \
  -H "Authorization: Bearer $TOKEN" | jq '. | {total: (.items|length), page}'
```

| # | Prueba | Esperado |
|---|---|---|
| B4.1 | `GET /api/silos/{id}/lecturas?range=&page=` | 200, resultados filtrados por silo + rango |
| B4.2 | Pedir `page=1`, `page=2`, … | Cada página trae un set distinto (Skip/Take real en la DB, ~7 páginas con 1015 lecturas) |

## B5. Transacción / rollback (Parte 4.3)

| # | Prueba | Esperado |
|---|---|---|
| B5.1 | POST silo cuya **lectura inicial** es inválida (fuera de rango) | 409 y, al contar filas de `Silos` antes/después, **no** queda el silo (rollback de la transacción cabecera+detalle) |

```sql
-- Verificación en la DB (docker exec ... psql), antes y después del POST fallido:
SELECT count(*) FROM "Silos";
```

## B6. Seguridad y roles (Parte 5.2)

| # | Request | Esperado |
|---|---|---|
| B6.1 | `GET /api/silos` **sin** header Authorization | 401 |
| B6.2 | `GET /api/admin/usuarios` con token de rol **Productor** | 403 |
| B6.3 | `GET /api/admin/usuarios` con token de **Admin** | 200 con el listado |
| B6.4 | Cualquier endpoint con un token inventado/vencido | 401 |

```bash
curl -i -s http://localhost:5210/api/silos                       # sin token → 401
curl -i -s http://localhost:5210/api/admin/usuarios -H "Authorization: Bearer $TOKEN"  # Productor → 403
```

## B7. Manejo de errores sin exponer stack trace (Parte 2.4)

| # | Prueba | Esperado |
|---|---|---|
| B7.1 | Romper la cadena de conexión de la DB (appsettings) y llamar un endpoint | 500 con `{"message":"Ocurrió un error interno…"}` — **sin** stack trace en la respuesta; el detalle sólo en el log del servidor |

## B8. Persistencia y modelo (Parte 1)

| # | Prueba | Esperado |
|---|---|---|
| B8.1 | Inspeccionar la DB: 7 tablas de dominio + `__EFMigrationsHistory` | Estructura correcta |
| B8.2 | `\d "UserRoles"` | PK compuesta + 2 FKs (N‑N real User↔Role) |
| B8.3 | `Users.PasswordHash` | Formato BCrypt `$2a$11$…` (nunca texto plano) |
| B8.4 | Tabla `AuditLogs` | Se puebla sola al crear/editar/borrar silos y alertas (usuario + timestamp) |

```bash
# Ejemplo de inspección (ajustar nombre del contenedor/DB):
docker exec -it siloguard-db psql -U postgres -d siloguard -c '\dt'
```

## B9. Lotes / Pasaporte de Calidad (Parte 2/4 — maestro-detalle + transacción)

```bash
# Iniciar lote en un silo sin lote activo → 201
LID=$(curl -s -X POST "http://localhost:5210/api/silos/2/lotes" -H "$AUTH" | jq -r '.id')

# Finalizar → 200, el backend computa score + promedios sobre las lecturas
curl -s -X POST "http://localhost:5210/api/lotes/$LID/finalizar" -H "$AUTH" \
  | jq '{status, score, avgCo2, avgTemp, avgHum, alertsResolved}'
```

| # | Prueba | Esperado |
|---|---|---|
| B9.1 | `POST /api/silos/{siloId}/lotes` en un silo sin lote activo | 201, lote `monitoring` con `codigo` `SG-YYYY-XXXX` |
| B9.2 | `POST /api/silos/{siloId}/lotes` con un lote ya activo | 409 "El silo ya tiene un lote en monitoreo" |
| B9.3 | `GET /api/lotes` | 200, lista los lotes del usuario (2 seed + los creados) |
| B9.4 | `POST /api/lotes/{id}/finalizar` | 200, `status=finalized` + `score`/promedios computados de las lecturas (transacción) |
| B9.5 | `GET /api/lotes/{id}` | 200, pasaporte del lote |
| B9.6 | `GET /api/lotes/{id}` de otro usuario | 403 |
| B9.7 | `GET /api/lotes/999999` | 404 |
| B9.8 | `GET /api/lotes` sin token | 401 |
| B9.9 | `AuditLogs` tras iniciar/finalizar | Filas `Lote / Added` y `Lote / Modified` (auditoría automática) |

---

## Resumen de cobertura por rúbrica

| Parte | Se cubre en |
|---|---|
| 1 · Modelo de datos | B8 |
| 2 · API REST y negocio | B2, B3, B4, B7 |
| 3 · UI e integración | A1–A6 |
| 4 · Maestro‑detalle / ABM / transacción | A2, A4, B5 |
| 5 · Seguridad | A1.5, A5.2, B1, B3.3–3.4, B6 |
| 6 · Documentación | `backend/README.md` + Swagger + este doc |

> **Recordatorio pre‑entrega:** que todo esto funcione en tu compu no alcanza si el
> repositorio remoto no lo tiene. Confirmá `git push` de todo antes de entregar.
