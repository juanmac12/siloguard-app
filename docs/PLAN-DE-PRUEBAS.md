# SiloGuard — Plan de pruebas funcionales

> Checklist para verificar la app de punta a punta antes de la entrega.
> **Requisito previo:** el backend tiene que estar corriendo (ver abajo). Si no lo está,
> la app ahora muestra "No se pudo conectar al servidor…" en vez de errores genéricos.

## 0. Preparación del entorno

```bash
cd SiloGuard/backend
docker compose up -d db
ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"
```

En otra terminal:

```bash
cd SiloGuard
npx expo start --go -c
```

- [ ] La API responde en `http://localhost:5210/swagger` (Swagger UI carga en el navegador).
- [ ] El celular está en la **misma red Wi-Fi** que la compu, y `src/config/api.ts`
      apunta a la IP correcta de la compu (`ip addr` → hoy `192.168.0.9`).

**Usuario demo (seeder):** `dev@siloguard.com` / `Demo1234` — trae 6 silos, ~1000 lecturas y 5 alertas.

---

## 1. Arranque y autenticación

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 1.1 | Abrir la app por primera vez (sin sesión previa) | Splash animado → pantalla de **Login** (nunca directo al dashboard) |
| 1.2 | Abrir la app con sesión iniciada previamente y backend corriendo | Splash → **Dashboard** con los datos cargados |
| 1.3 | Abrir la app con sesión previa pero backend **apagado** | Splash → **Login** (no un dashboard vacío) |
| 1.4 | Login con credenciales incorrectas | Alerta con mensaje de error de la API (401), sin entrar |
| 1.5 | Login con `dev@siloguard.com` / `Demo1234` | Entra al Dashboard con 6 silos |
| 1.6 | Registro de usuario nuevo | Crea cuenta en Firebase + API propia, manda correo de verificación, pantalla "Registro exitoso" |
| 1.7 | Login con email registrado pero **sin verificar** | 401 con mensaje pidiendo verificar el correo (requiere credencial del Admin SDK configurada) |
| 1.8 | Cerrar sesión desde Perfil | Vuelve al Login; reabrir la app no entra sola al dashboard |

## 2. Silos (ABM completo — maestro/detalle)

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 2.1 | Dashboard lista los silos | 6 silos del seeder con estado (ok/warn/critical), temperatura, humedad y CO₂ |
| 2.2 | Tocar un silo | Detalle con lecturas reales de `GET /api/silos/{id}` |
| 2.3 | **Crear silo** (botón +) con datos válidos | 201, vuelve al Dashboard y el silo nuevo aparece en la lista |
| 2.4 | Crear silo con campos vacíos | Errores de validación en el formulario (cliente) |
| 2.5 | Crear silo con lectura fuera de rango (ej. temperatura 999) | 409 de la API y el silo **no** queda creado (rollback de transacción) |
| 2.6 | **Editar silo** | Cambios visibles al volver al detalle y al Dashboard |
| 2.7 | **Eliminar silo** | Pide confirmación, desaparece de la lista junto con sus alertas |

## 3. Historial y paginado

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 3.1 | Historial de un silo, rango 24h / 48h / 7d | El gráfico cambia según el rango (filtro resuelto en la API) |
| 3.2 | "Cargar más lecturas" | Trae la página siguiente desde la DB (paginado real, no en cliente) |

## 4. Alertas

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 4.1 | Tab Alertas | 5 alertas del seeder, con severidad y silo asociado |
| 4.2 | Detalle de alerta | Sensor, valor, umbral y acción recomendada |
| 4.3 | Resolver una alerta con nota | Pasa a "resuelta" y persiste al recargar (pull-to-refresh / reabrir) |

## 5. Perfil

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 5.1 | Ver perfil | Datos del usuario logueado |
| 5.2 | **Editar perfil** (nombre, teléfono, campo, hectáreas) | "✓ Guardado", vuelve atrás y los datos quedan actualizados; persisten al recargar |
| 5.3 | Editar perfil con XSS (`<script>alert(1)</script>` en el nombre) | Se guarda sanitizado, sin las tags |
| 5.4 | Tema oscuro/claro | Toda la app cambia de tema |
| 5.5 | **Cambiar contraseña** con la actual incorrecta | Error en el campo: "La contraseña actual no es correcta." (409, sin desloguear) |
| 5.6 | Cambiar contraseña con nueva < 8 caracteres o confirmación distinta | Errores de validación en el formulario (cliente) |
| 5.7 | Cambiar contraseña con datos válidos | "✓ Contraseña cambiada"; cerrar sesión y volver a entrar **solo** funciona con la clave nueva |

## 6. Seguridad (probar con Swagger o curl)

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 6.1 | `GET /api/silos` sin token | 401 |
| 6.2 | `GET /api/admin/usuarios` con usuario Productor | 403 |
| 6.3 | `GET /api/admin/usuarios` con `admin@siloguard.com` | 200 con listado |
| 6.4 | Token vencido o inventado | 401 y la app redirige al Login |

## 7. Manejo de errores

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 7.1 | Apagar el backend y crear un silo | "No se pudo conectar al servidor…" (mensaje claro, no genérico) |
| 7.2 | Cambiar la cadena de conexión de la DB y llamar un endpoint | 500 con `{message}` seguro, sin stack trace (demostración pedida por la rúbrica 2.4) |

---

## Fuera de alcance (mock declarado, no probar como funcionalidad real)

- **Mis lanzas** (`perfil/lanzas.tsx`) — datos mock, sin entidad IoT en el backend.
- **Notificaciones** (`perfil/notificaciones.tsx`) — los toggles no persisten.
- **Configurar umbrales** — placeholder.
- **Google/Apple login** — botones decorativos ("Próximamente").
- **"Olvidé mi contraseña"** (reset por email desde el login) — trabajo futuro documentado;
  el cambio de contraseña desde Perfil sí está implementado (`PUT /api/perfil/password`).
