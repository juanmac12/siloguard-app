# SiloGuard — Instrucciones para Claude Code

> Este archivo es la raíz real del repo (`git@github.com:juanmac12/siloguard-app.git`).
> Si estás viendo `backend/` y `src/` colgando directo de tu working directory, estás en el
> lugar correcto. Si en cambio ves una carpeta `SiloGuard/` como hijo del directorio abierto,
> el editor está apuntando un nivel más arriba (el repo padre, sin remote, que es un scaffold
> viejo de Expo) — reabrí el editor sobre esta carpeta antes de trabajar.

---

## Qué es este proyecto

SiloGuard es una app de monitoreo de silos de grano (TP Integrador de Programación III, TUP
2026): un productor ve el estado de sus silos (temperatura/humedad/CO₂), recibe alertas cuando
un sensor cruza un umbral, y certifica cada ciclo de almacenamiento con un "Pasaporte de
Calidad". Dos partes que conviven en este repo:

- **`src/`** — app móvil real, Expo Router + React Native. Consume la API por HTTP con JWT
  (`src/config/api.ts`, `src/services/*`). **No hay datos mockeados en el flujo principal**:
  silos, lecturas, alertas, lotes y perfil vienen todos del backend.
- **`backend/`** — API .NET 10 en 3 capas (`SiloGuard.Api` / `SiloGuard.Business` /
  `SiloGuard.Data`) + PostgreSQL vía EF Core.

Documentación de referencia (leerla antes de tocar algo grande):

| Archivo | Para qué sirve |
|---|---|
| `ARQUITECTURA.md` | Guía del Design System (tokens, componentes, íconos permitidos) y estado del backend. |
| `backend/README.md` | Arquitectura de las 3 capas, modelo de datos, instalación/ejecución del backend. |
| `docs/CHECKLIST-DEFENSA.md` | **La guía de defensa vigente** (llegó con la sincronización del 2026-08-17): 14 tablas, 30 endpoints, mapeo completo rúbrica→código, preguntas reales del profesor a otros grupos. |
| `docs/DEFENSA.md` | Guía de estudio anterior (recuperada de un `.html` suelto) — cubre un estado más viejo del backend (8 conceptos, sin Umbrales/Soporte/Preferencias). Preferir `CHECKLIST-DEFENSA.md`. |
| `docs/HISTORIAL-CLAUDE.md` | Contenido histórico (2026-07-03) de un `CLAUDE.md` anterior — notas de equipo desactualizadas, solo como referencia arqueológica. |
| `docs/PLAN-DE-PRUEBAS.md` / `docs/PRUEBAS-ENTREGA.md` | Checklists de pruebas funcionales end-to-end. |
| `BACKLOG.md` | **Desactualizado** — lista pantallas "por desarrollar" que ya están implementadas. No confiar en su estado. |
| `src/design-system/SiloGuard_definicion_producto.md` | Definición de producto: pantallas y flujos previstos (más de lo que exige la rúbrica del TP). |

---

## Reglas de trabajo

1. **No reintroduzcas Firebase como reemplazo del login propio.** La auth es híbrida a
   propósito: Firebase solo emite/verifica el email de registro; el login real y el JWT de
   sesión son 100% del backend (BCrypt + JWT firmado). Ver `AuthService.LoginAsync` +
   `FirebaseAuthService.IsEmailVerifiedAsync`.
2. **El acceso a datos vive solo en `SiloGuard.Data`.** `SiloGuard.Business` nunca debe
   importar `Microsoft.EntityFrameworkCore` ni ver el `DbContext` directamente — solo usa las
   interfaces de `SiloGuard.Data.Abstractions`.
3. **No inventes variables CSS ni nombres de íconos.** Antes de escribir `var(--algo)`,
   consultá `src/design-system/tokens/semantic.css`. Los íconos disponibles están en
   `src/components/Icon.tsx` (`IconName`) — no agregues una librería de íconos externa.
4. **`API_BASE_URL` en `src/config/api.ts` apunta al backend deployado en Render**
   (`https://siloguard-app.onrender.com/api`), no a una IP local. Si necesitás probar contra
   un backend corriendo en tu máquina, reemplazá el valor por la IP LAN de la compu — pero
   acordate de revertirlo antes de commitear, o vas a romper el deploy para cualquiera que
   clone el repo. El free tier de Render duerme tras inactividad: la primera request después
   de un rato puede tardar 30-60s.
5. **Antes de tocar un endpoint, mirá si tiene un `Validator` en `SiloGuard.Business/Validators/`.**
   El `ValidationFilter` corre automáticamente cualquier `IValidator<T>` registrado — no hace
   falta (ni conviene) validar a mano dentro del controller.
6. **Los commits van sin coautoría de IA**, autor `juanmac12` (ver historial de commits del
   repo para el estilo de mensajes).

---

## Cómo levantar el proyecto

**Backend:** deployado en Render (`https://siloguard-app.onrender.com`, Dockerfile en
`backend/`, Postgres gestionado). La app ya apunta ahí por default — para probarla en el
celular alcanza con levantar solo el frontend:

```bash
npx expo start -c
```

Swagger del deploy: `https://siloguard-app.onrender.com/swagger`. Usuario demo (sembrado por
`DbSeeder`, corre siempre al arrancar, es idempotente): `dev@siloguard.com` / `Demo1234` — 6
silos, ~1000 lecturas, 5 alertas, 2 lotes.

**Backend local** (solo si estás desarrollando algo del backend en sí):

```bash
cd backend
docker compose up -d db
ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"
```

Con esto corriendo, cambiá `API_BASE_URL` en `src/config/api.ts` a la IP LAN de tu máquina
(sin commitear ese cambio) para que la app le hable a tu backend local en vez del de Render.

---

## Rúbrica (100 pts, 6 partes)

Modelo de datos (25) · API REST y lógica de negocio (30) · UI e integración con la API (20) ·
Maestro-detalle (10) · Seguridad (10) · Documentación (5). El detalle ítem por ítem, mapeado a
clases y archivos reales del proyecto, está en `docs/DEFENSA.md`.
