# SiloGuard — Backend (.NET 10 + EF Core + PostgreSQL)

API REST del TP integrador de Programación III (UTN). Cubre las Partes 1, 2, 4 y 5 de la
rúbrica (modelo de datos, API REST, maestro-detalle transaccional, seguridad).

## Arquitectura

Solución en 3 capas, sin referencias circulares:

```
backend/
├── SiloGuard.sln
├── docker-compose.yml      # Postgres 16 para desarrollo local
└── src/
    ├── SiloGuard.Api/        # Presentación: Controllers, Program.cs, DTOs, Middleware, Swagger
    ├── SiloGuard.Business/   # Negocio: Services, Validators (FluentValidation), JWT, BCrypt, sanitización XSS
    └── SiloGuard.Data/       # Datos: entidades EF Core, DbContext, migraciones, repositorios, seeder
```

- `SiloGuard.Data` no depende de ningún otro proyecto propio.
- `SiloGuard.Business` depende de `SiloGuard.Data` (usa sus entidades y las interfaces de
  repositorio/unit-of-work que viven ahí — `SiloGuard.Data.Abstractions`), pero nunca
  importa `Microsoft.EntityFrameworkCore` ni ve el `DbContext` directamente. El acceso a
  datos (LINQ, `SaveChanges`) vive exclusivamente en `SiloGuard.Data/Repositories`.
- `SiloGuard.Api` depende de ambas.

## Modelo de datos

7 tablas: `Users`, `Roles`, `UserRoles` (N-N real entre Users y Roles), `Silos` (1-N desde
Users), `SensorReadings` (1-N desde Silos, historial paginable), `Alerts` (1-N desde Silos),
`AuditLogs` (poblada automáticamente desde `SiloGuardDbContext.SaveChangesAsync` cada vez
que se crea/modifica/borra un `Silo` o `Alert`).

Las contraseñas se guardan con BCrypt (`Users.PasswordHash`, formato `$2a$...` — el salt
va embebido en el propio hash).

## Instalación y ejecución

```bash
cd backend
cp .env.example .env               # ajustar password si se quiere
docker compose up -d db            # levanta Postgres en localhost:5432

dotnet tool install --global dotnet-ef   # si no lo tenés instalado
export PATH="$PATH:$HOME/.dotnet/tools"

dotnet ef database update --project src/SiloGuard.Data --startup-project src/SiloGuard.Api

ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"
```

Al arrancar en `Development` la API aplica migraciones pendientes y corre el seeder (una
sola vez, si `Users` está vacío): 2 usuarios demo, 6 silos, ~1000 lecturas de sensores
(7 días de historial por silo) y 5 alertas.

- Usuario demo (rol Productor): `dev@siloguard.com` / `Demo1234`
- Usuario admin (roles Productor + Admin): `admin@siloguard.com` / `Admin1234`

Swagger: `http://localhost:5210/swagger` — botón "Authorize" para pegar el JWT devuelto
por `/api/auth/login` y probar los endpoints protegidos.

Para que el celular con Expo Go llegue a la API, la app debe apuntar a la IP LAN de esta
compu (ej. `http://192.168.0.9:5210/api`), no a `localhost`. El comando de arriba ya usa
`--urls "http://0.0.0.0:5210"` para escuchar en todas las interfaces de red.

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | público | Crea usuario (rol Productor por defecto) |
| POST | `/api/auth/login` | público | Devuelve JWT |
| GET/PUT | `/api/perfil` | JWT | Perfil del usuario autenticado |
| GET | `/api/silos` | JWT | Lista de silos del usuario |
| GET | `/api/silos/{id}` | JWT | Detalle de un silo |
| POST | `/api/silos` | JWT | Crea silo + lectura inicial (transacción, ver abajo) |
| PUT | `/api/silos/{id}` | JWT | Edita un silo |
| DELETE | `/api/silos/{id}` | JWT | Elimina silo (cascada a lecturas y alertas) |
| GET | `/api/silos/{id}/lecturas?range=24h\|48h\|7d&page=&pageSize=` | JWT | Historial paginado |
| GET | `/api/alertas?status=&variant=` | JWT | Lista de alertas, filtrable |
| GET | `/api/alertas/{id}` | JWT | Detalle de alerta |
| PATCH | `/api/alertas/{id}/resolver` | JWT | Marca una alerta como resuelta |
| GET | `/api/admin/usuarios` | JWT + rol Admin | Lista de usuarios (demuestra rutas protegidas por rol) |

Todos los endpoints requieren `Authorization: Bearer <token>` salvo los dos de `auth`.

## Transacción con rollback demostrable (Parte 4.3)

`POST /api/silos` inserta el `Silo` (cabecera) y una `SensorReading` inicial (detalle) en
una misma transacción. `SensorReadings` tiene check constraints de rango en Postgres
(`Temp` entre -50 y 150, `Hum` entre 0 y 100, `Co2 >= 0`). La validación de FluentValidation
es deliberadamente más laxa que esos rangos, así un valor "plausible pero inválido" (ej.
`initialTemp: 999`) pasa la validación de la API pero es rechazado por la base — el
`catch` en `SiloService.CreateAsync` hace `RollbackAsync()`, revirtiendo también el `Silo`
ya insertado. Se puede reproducir así:

```bash
TOKEN=<jwt de login>

# Antes: contar silos
curl -s http://localhost:5210/api/silos -H "Authorization: Bearer $TOKEN" | jq length

# Falla por check constraint -> 409, sin dejar nada a medio guardar
curl -s -X POST http://localhost:5210/api/silos -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","grain":"Soja","tons":10,"acopio":"1 ene 2024","storage":"Silo fijo","initialTemp":999,"initialHum":50,"initialCo2":400}'

# Después: mismo conteo que antes
curl -s http://localhost:5210/api/silos -H "Authorization: Bearer $TOKEN" | jq length
```

## Checklist de verificación (qué revisar para la corrección)

| Rúbrica | Cómo verificarlo |
|---|---|
| Tablas + N-N + hash | `docker exec -it siloguard-db psql -U siloguard -d siloguard -c '\dt'` y `\d "UserRoles"` |
| Migraciones + seeders | `SELECT COUNT(*) FROM "SensorReadings";` (≈1000 filas) |
| Auditoría (bonus) | `PATCH /api/alertas/{id}/resolver` → `SELECT * FROM "AuditLogs" ORDER BY "Timestamp" DESC LIMIT 5;` |
| Verbos HTTP | Swagger UI |
| Validación | `POST /api/auth/register` con password corta → 400 con detalle por campo |
| 3 capas | `grep -r "DbContext" src/SiloGuard.Business` → sin resultados |
| Errores sin detalle técnico | Cualquier 500 devuelve `{statusCode, message genérico, traceId}`; el detalle solo queda en el log del server |
| Maestro-detalle + rollback | Ver sección de arriba |
| JWT + roles | `GET /api/silos` sin token → 401; `GET /api/admin/usuarios` con rol Productor → 403, con Admin → 200 |
| OWASP XSS | `POST /api/silos` con `name: "<script>alert(1)</script>"` → se guarda sin las tags |
| OWASP SQLi | Todo el acceso a datos es LINQ/EF parametrizado, sin `FromSqlRaw` interpolado |
| Swagger + docs | `http://localhost:5210/swagger` |

## Pendiente (Fase B, fuera de este backend)

Reconectar el frontend (`SiloGuard/src/`) para que consuma esta API real en vez del mock
actual de `AppDataContext.tsx`, y reemplazar el login/registro de Firebase por JWT propio.
