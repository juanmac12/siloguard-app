# SiloGuard

App mobile de **alerta temprana de deterioro de granos** para productores agropecuarios PyME del Litoral. Una lanza con sensores (IoT) mide **CO₂, temperatura y humedad** dentro del silo en continuo, y la app traduce esas señales en información accionable: estado del silo (verde/amarillo/rojo), alertas en lenguaje simple con acción recomendada, historial gráfico para confirmar que una intervención funcionó, y un **Pasaporte de Calidad** para certificar cada lote almacenado.

---

## Arquitectura general

```
┌─────────────────────────────────────────┐
│           App Mobile (Expo)             │
│  React Native 0.81 · Expo SDK 54        │
│  Expo Router · Firebase Auth (email)    │
└──────────────┬──────────────────────────┘
               │ HTTP (JWT Bearer)
               ▼
┌─────────────────────────────────────────┐
│           API REST (.NET 10)            │
│  ASP.NET Core · EF Core · 3 capas       │
│  JWT propio (HS256) + BCrypt            │
└──────────────┬──────────────────────────┘
               │ Npgsql (EF Core)
               ▼
┌─────────────────────────────────────────┐
│        Base de datos PostgreSQL 16      │
│  14 tablas · auditoría automática       │
│  Docker Compose (+ pgAdmin)             │
└─────────────────────────────────────────┘
```

El backend está organizado en **tres capas** sin referencias circulares:

- **`SiloGuard.Api`** (presentación) — controllers, DTOs, middleware, Swagger.
- **`SiloGuard.Business`** (negocio) — services, validators, JWT, BCrypt, sanitización XSS. Nunca importa EF Core.
- **`SiloGuard.Data`** (datos) — entidades, repositorios, Unit of Work, migraciones y seeder. El único que toca EF Core.

### Modelo de datos

```
users ── user_roles (N:N) ── roles
  └── silos (1:N)
        └── sensor_readings (1:N)    ← lecturas de la lanza (CO₂, temp, humedad)
        └── umbrales (1:1)           ← límites configurables por silo
        └── lotes (1:N)
              └── lote_destinatarios (N:N) ── destinatarios
        └── alerts (1:N)
              └── consultas_soporte (1:N) ── tecnicos
  └── preferencias_notificacion (1:1)

audit_log   ← traza automática de operaciones sensibles
```

Enums (estados de silo, alerta y lote) se guardan como texto. Fechas en **UTC**. Las
operaciones maestro-detalle y de consolidación corren dentro de una **transacción con rollback**.

### Flujo de autenticación (híbrido)

El registro y la verificación de email se apoyan en **Firebase Auth**, pero el **login y la
emisión de sesión son propios del backend** (contraseñas con hash+salt BCrypt y JWT firmado
por la API). Firebase solo se encarga del envío del correo de verificación.

```
Registro:
  Front → crea cuenta en Firebase (envía mail de verificación)
        → POST /api/auth/register (guarda usuario en PostgreSQL con BCrypt)

Login:
  POST /api/auth/login → backend verifica BCrypt.Verify(password, hash)
                       → consulta email_verified en Firebase (Admin SDK)
                       → si está verificado, emite JWT propio (HS256) → SecureStore

Cada request protegido:
  Authorization: Bearer <token> → AddJwtBearer valida firma, emisor,
                                   audiencia y expiración (stateless, sin sesiones)
```

---

## Requisitos previos

| Herramienta | Versión |
|---|---|
| Node.js | 20.x o superior |
| .NET SDK | 10.x |
| Docker + Docker Compose | reciente (para PostgreSQL) |
| Expo Go (celular) | última versión disponible |
| Cuenta / proyecto de Firebase | para verificación de email |

---

## Instalación

### 1. Clonar el proyecto

```bash
git clone https://github.com/juanmac12/siloguard-app.git
cd siloguard-app
```

### 2. Instalar dependencias de la app

```bash
npm install
```

### 3. Levantar la base de datos

```bash
cd backend
docker compose up -d db
# esperá a que el healthcheck quede "healthy":
docker inspect --format '{{.State.Health.Status}}' siloguard-db
# (opcional) pgAdmin en http://localhost:5050
```

### 4. Configurar el backend

`appsettings.json` trae las claves vacías. Para desarrollo, completá los valores en
`appsettings.Development.json` (gitignored) o por variables de entorno:

| Clave | Descripción |
|---|---|
| `ConnectionStrings:Default` | `Host=localhost;Port=5432;Database=siloguard;Username=siloguard;Password=siloguard_dev_pw` |
| `Jwt:Key` | Clave secreta para firmar el JWT (larga y aleatoria) |
| `Jwt:Issuer` / `Jwt:Audience` | `SiloGuard.Api` / `SiloGuard.App` |
| `Jwt:ExpireMinutes` | Duración del token (por defecto 480) |
| `Firebase:CredentialsPath` | Ruta al JSON de la cuenta de servicio de Firebase Admin |
| `Firebase:VerificationBypassEmails` | Emails que saltean el gate de verificación (útil en la defensa) |

Las migraciones y el seeder se aplican **solos al arrancar** en Development
(`db.Database.MigrateAsync()` + `DbSeeder.SeedAsync()`).

### 5. Configurar la URL de la API en la app

La app apunta al backend por IP de LAN. Editá [src/config/api.ts](src/config/api.ts):

```ts
// IP LAN de la compu que corre el backend. Si cambia de red/IP, actualizar acá.
export const API_BASE_URL = "http://<TU_IP_LAN>:5210/api";
```

---

## Ejecución

### Backend (API REST)

```bash
cd backend
dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"
# API en http://localhost:5210
# Swagger:  http://localhost:5210/swagger
# Health:   http://localhost:5210/health
```

Se usa `0.0.0.0` para que el celular en la misma red Wi-Fi pueda alcanzar la API.

### App mobile (Expo Go)

```bash
npx expo start -c
# Escanear el QR con Expo Go desde el celular (misma red Wi-Fi que el backend)
```

---

## API REST

**Base URL:** `http://localhost:5210/api` · Todos los endpoints requieren
`Authorization: Bearer <token>` salvo los marcados como públicos. Los errores usan un formato
homogéneo `{ message, errors }` (`401` sin token válido · `403` recurso ajeno / rol incorrecto ·
`404` inexistente · `400` validación).

### Auth (público)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Crear cuenta `{ email, password, ... }` (BCrypt) |
| POST | `/api/auth/login` | Login → verifica hash + email verificado → devuelve JWT |

### Perfil

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/perfil` | Datos del usuario autenticado |
| PUT | `/api/perfil` | Editar perfil |
| PUT | `/api/perfil/password` | Cambiar contraseña |
| GET | `/api/perfil/notificaciones` | Preferencias de notificación |
| PUT | `/api/perfil/notificaciones` | Actualizar preferencias |

### Silos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/silos` | Mis silos con su estado actual |
| GET | `/api/silos/{id}` | Detalle de un silo (dueño) |
| POST | `/api/silos` | Crear silo |
| PUT | `/api/silos/{id}` | Editar silo (dueño) |
| DELETE | `/api/silos/{id}` | Eliminar silo (dueño) |
| GET | `/api/silos/{id}/lecturas` | Historial de lecturas de sensores |

### Umbrales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/silos/{siloId}/umbrales` | Umbrales configurados del silo |
| PUT | `/api/silos/{siloId}/umbrales` | Configurar / actualizar umbrales |
| DELETE | `/api/silos/{siloId}/umbrales` | Restablecer a valores por defecto |

### Alertas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/alertas` | Mis alertas |
| GET | `/api/alertas/{id}` | Detalle de una alerta |
| PATCH | `/api/alertas/{id}/resolver` | Marcar una alerta como resuelta |

### Lotes y Pasaporte de Calidad

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/lotes` | Mis lotes |
| GET | `/api/lotes/{id}` | Detalle de un lote (Pasaporte) |
| POST | `/api/silos/{siloId}/lotes` | Crear un lote en un silo |
| POST | `/api/lotes/{id}/finalizar` | Consolidar el lote y calcular su score de calidad |
| GET | `/api/destinatarios` | Destinatarios disponibles para compartir |
| GET | `/api/lotes/{id}/destinatarios` | Destinatarios con los que se compartió el lote |
| POST | `/api/lotes/{id}/compartir` | Compartir el Pasaporte con un destinatario |

### Soporte técnico

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tecnicos` | Técnicos disponibles |
| POST | `/api/alertas/{alertaId}/consultas` | Consultar a un técnico sobre una alerta |
| GET | `/api/consultas` | Mis consultas de soporte |

### Admin y Health

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/usuarios` | Listado de usuarios — requiere rol `Admin` |
| GET | `/health` | Liveness de la API (público, sin auth) |

---

## Pantallas

| Módulo | Pantallas |
|---|---|
| Onboarding | Welcome, Tutorial, Permisos |
| Auth | Login, Register, Verificar email, Recuperar contraseña |
| Principal | Dashboard multi-silo, Detalle de silo, Historial de sensores |
| Alertas | Listado de alertas, Detalle de alerta, Contacto técnico |
| Silos | Agregar silo, Editar silo, Umbrales |
| Pasaporte | Pasaporte de Calidad, Detalle de lote |
| Perfil | Perfil, Editar perfil, Cambiar contraseña, Notificaciones, Lanzas (sensores) |

### Funcionalidades destacadas

- **Estado del silo de un vistazo** — semáforo verde/amarillo/rojo recomputado a partir de las últimas lecturas y los umbrales del silo.
- **Alertas accionables** — cuando una variable cruza un umbral, la alerta se muestra en lenguaje simple con una acción concreta recomendada, y se puede marcar como resuelta.
- **Historial gráfico** — evolución de CO₂, temperatura y humedad para confirmar que una intervención corrigió el problema.
- **Pasaporte de Calidad** — cada lote se consolida en un certificado con score de calidad, que puede compartirse con destinatarios (acopios, compradores).
- **Umbrales configurables** — cada silo define sus propios límites por variable.
- **Estados de conexión** — banner de dispositivo offline y mensajes claros cuando no se alcanza el backend.

---

## Seguridad

- Contraseñas hasheadas con **BCrypt** (salt embebido en el hash `$2a$…`). Nunca se almacena texto plano.
- **JWT propio** firmado con `Jwt:Key` (HS256); el middleware valida firma, emisor, audiencia y expiración en cada request protegido (stateless, sin tabla de sesiones).
- **Gate de email verificado**: el login consulta `email_verified` en Firebase (Admin SDK) antes de emitir el token.
- **Autorización por rol**: `GET /api/admin/usuarios` requiere rol `Admin`.
- **Propiedad de recursos (ownership)**: un usuario solo accede a sus propios silos, alertas y lotes; el acceso a un recurso ajeno responde `403`.
- **Anti-XSS**: todo texto libre pasa por un sanitizador antes de persistir.
- **Anti-SQLi**: EF Core parametriza todas las consultas; no hay SQL crudo.

---

## Estructura del proyecto

```
siloguard-app/
├── src/                        # App mobile (Expo Router)
│   ├── app/                    # Rutas / pantallas (file-based routing)
│   ├── components/             # Componentes reutilizables (Button, Input, AlertCard, ...)
│   ├── design-system/          # Tokens (colores, tipografía, spacing) + estilos
│   ├── services/               # Clientes de la API (auth, silo, alerta, lote, umbral, perfil)
│   ├── contexts/               # AppDataContext, ThemeContext
│   ├── config/                 # api.ts (base URL + fetch con manejo de errores)
│   ├── constants/              # Theme
│   └── utils/                  # helpers (relativeTime, ...)
│
├── backend/                    # API REST (.NET 10)
│   ├── src/
│   │   ├── SiloGuard.Api/       # Controllers, DTOs, middleware, Program.cs, Swagger
│   │   ├── SiloGuard.Business/  # Services, validators, JWT, BCrypt, sanitización
│   │   └── SiloGuard.Data/      # Entidades, repos, UoW, migraciones, seeder
│   ├── tests/SiloGuard.Tests/   # Pruebas xUnit (seguridad + validators)
│   └── docker-compose.yml       # PostgreSQL 16 + pgAdmin
│
├── docs/                       # Documentación final (backend, frontend, checklist)
├── ARQUITECTURA.md
├── app.json                    # Configuración de Expo
└── package.json
```

---

## Documentación

- [`docs/DOCUMENTACION-FINAL-BACKEND.md`](docs/DOCUMENTACION-FINAL-BACKEND.md) — arquitectura, seguridad, endpoints y reglas de negocio del backend.
- [`docs/DOCUMENTACION-FINAL-FRONTEND.md`](docs/DOCUMENTACION-FINAL-FRONTEND.md) — producto, flujo de usuario y mapa de pantallas.
- [`ARQUITECTURA.md`](ARQUITECTURA.md) — decisiones técnicas y estructura de capas.
