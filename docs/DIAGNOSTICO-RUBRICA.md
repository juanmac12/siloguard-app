# SiloGuard — Diagnóstico contra la rúbrica del TP Integrador

> **⚡ SUPERADO (2026-07-15):** los gaps de este diagnóstico ya fueron cerrados —
> ABM de Umbrales (4.2), filtro de alertas en la API (3.4), 2ª N-N `LoteDestinatarios`
> (1.2), docs actualizados y suite de tests. Ver `docs/CHECKLIST-DEFENSA.md` para el
> estado final y la guía de demo. Se conserva este archivo como evidencia del proceso.

> Comparación del backend actual contra
> `Integrador-Rubrica-ParaAlumnos-Programacion3-TUP-2026-RESISTENCIA.xlsx`
> (rúbrica de 100 puntos, 6 partes). Análisis de código real (controllers, services,
> validators, middleware, seguridad) — no es una revisión superficial.
>
> **Alcance:** solo backend (.NET). Las Partes 3 y 6 se revisan de forma informativa
> porque son mayormente frontend/documentación.

---

## Resumen ejecutivo

El backend está **sólido en Partes 2 y 5** (API REST y seguridad), razonablemente bien en
**Parte 1**, y tiene un **hueco real en Parte 4** (maestro-detalle) que conviene cerrar.

---

## PARTE 1 — Modelo de datos (25 pts)

| Ítem | Pts | Estado | Detalle |
|---|---|---|---|
| 1.1 Dominio y tablas propias | 7 | ✅ | 8 tablas, todas de dominio propio (nada técnico de framework) |
| 1.2 Relaciones 1-N y N-N | 5 | ⚠️ **Parcial** | Varias 1-N (`Silos`→`SensorReadings`/`Alerts`/`Lotes`), pero **una sola tabla N-N** (`UserRoles`). La rúbrica pide "ejemplos" (plural) — con una sola intermedia es un poco justo. |
| 1.3 Hash + salt | 4 | ✅ | BCrypt, salt embebido en el hash (`BCryptPasswordHasher.cs`) |
| 1.4 Migraciones + seeders | 5 | ✅ | 2 migraciones, seeder con 6 silos + ~1000 lecturas (pensado explícitamente para el paginado) |
| 1.5 Bonus auditoría | 4 | ✅ | `AuditLog` automático vía `SaveChangesAsync` sobre `Silo`/`Alert`/`Lote` |

**Gap real:** falta una segunda relación N-N para que "ejemplos" no dependa de una sola tabla.

---

## PARTE 2 — API REST y lógica de negocio (30 pts)

| Ítem | Pts | Estado | Detalle |
|---|---|---|---|
| 2.1 Endpoints/métodos HTTP | 6 | ✅ | GET/POST/PUT/PATCH/DELETE reales, códigos 200/201/204/400/401/403/404/409/500 |
| 2.2 Validación + sanitización | 5 | ✅ | 7 validators FluentValidation (Login, Register, Perfil, CambiarPassword, ResolverAlerta, SiloCreate/Update) + `HtmlInputSanitizer` aplicado en **4 services** distintos, no solo uno |
| 2.3 Arquitectura 3 capas | 7 | ✅ | Api/Business/Data sin ciclos, verificado en el código (Business nunca importa EF Core) |
| 2.4 Manejo de errores | 5 | ✅ | `ExceptionHandlingMiddleware` global, nunca serializa stack trace, loguea server-side con `TraceId` |
| 2.5 Persistencia ORM/CRUD | 7 | ✅ | EF Core + Repository/UnitOfWork, CRUD completo en Silos |

**Parte 2 está completa.** No se encontraron gaps significativos.

---

## PARTE 3 — Frontend e integración (20 pts) *— solo diagnóstico*

| Ítem | Estado |
|---|---|
| 3.1 Consumo real de API | ✅ ya reconectado (`src/services/*`) |
| 3.4 Filtro por 2 parámetros resuelto en API | ✅ **el backend ya lo soporta**: `GET /api/alertas?status=&variant=` filtra por 2 params en `AlertasController.cs`. Falta confirmar que el frontend use ambos parámetros a la vez. |
| 3.5 Paginado real desde DB | ✅ `GET /api/silos/{id}/lecturas` pagina contra la base (`SilosController.cs`) |

Backend ya da soporte a estos ítems; si falta algo es solo del lado de la app (fuera de este alcance).

---

## PARTE 4 — Operaciones maestro–detalle (10 pts) ⚠️ **El gap más importante**

| Ítem | Pts | Estado | Detalle |
|---|---|---|---|
| 4.1 Listado → detalle vía API | 3 | ✅ | Silos, Alertas y Lotes tienen list+detail |
| 4.2 ABM cabecera+detalle (≥3) | 4 | ❌ **Falta** | Solo **`Silos` tiene ABM completo** (Alta/Baja/Modificación + detalle `SensorReading`). `Lotes` tiene Alta (Iniciar) + Modificación (Finalizar) pero **no Baja**. `Alertas` no tiene Alta manual (se generan solas) ni Baja, solo Modificación (Resolver). Hoy hay **1 ABM completo, no 3**. |
| 4.3 Transacciones con rollback | 3 | ✅ | Silo+lectura inicial (rollback demostrable) y Finalizar lote |

**Este es el ítem con mayor riesgo de perder puntos** (4 de 10 en esta parte).

---

## PARTE 5 — Seguridad (10 pts)

| Ítem | Pts | Estado | Detalle |
|---|---|---|---|
| 5.1 JWT | 3 | ✅ | `JwtTokenService`, emisión propia |
| 5.2 Roles y rutas protegidas | 4 | ✅ | **Todos** los controllers salvo `AuthController` (correcto, login/register deben ser públicos) tienen `[Authorize]`. Ownership check real: `SiloService.GetOwnedAsync` lanza `ForbiddenAppException` si el silo no es del usuario. `AdminController` usa `[Authorize(Roles="Admin")]`. |
| 5.3 OWASP XSS/SQLi | 3 | ✅ | Sanitización de HTML en inputs libres + EF Core parametrizado (cero uso de `FromSqlRaw`/`ExecuteSqlRaw` en todo el backend, sin superficie de SQLi) |

**Parte 5 está completa.**

---

## PARTE 6 — Documentación (5 pts) *— solo diagnóstico*

`backend/README.md` (158 líneas) + `ARQUITECTURA.md` + `docs/` ya cubren arquitectura,
instalación y checklist. Detalle menor: ambos documentos dicen **"7 tablas"** y no cuentan
`Lotes` — desactualizado desde la migración `AddLotes`. Cosmético, no bloqueante.

---

## Recomendación priorizada (solo backend, sin tocar frontend)

1. **Cerrar 4.2 (el gap más grande, 4 pts).** La forma más natural, alineada con
   `docs/MODELO-DE-DATOS.md`, es implementar el **ABM de `configuraciones_umbral`**
   (Create/Update/Delete de umbrales por silo — P21 "Configurar umbrales", que hoy es un
   placeholder pendiente). Esto da un 2do ABM completo con cabecera (`Silo`) + detalle
   (umbrales), y de paso destraba la pantalla `src/app/umbrales/` que ya está scaffoldeada
   en el repo. Para un 3er ABM, la opción más simple es agregar **Baja (delete/cancelar) a
   `Lotes`** cuando están en estado `monitoring` (no finalizados).

2. **Reforzar 1.2** agregando una segunda tabla N-N real. La más chica y justificable del
   plan es `lote_destinatarios` (compartir pasaporte con destinatarios) — de paso conecta
   con el ABM de arriba.

3. Actualizar la cifra de tablas en `ARQUITECTURA.md`/`README.md` (cosmético, Parte 6).

---

*Diagnóstico basado en lectura directa del código del backend (controllers, services,
validators, middleware, seguridad) al 2026-07-14.*
