# SiloGuard — Definición de Producto (implementación real)

> Documento derivado del estado **efectivamente implementado** en el prototipo App Screens (`screens/App Screens.html` + módulos `.jsx`) y los templates `templates/auth/` y `templates/onboarding/`. Reemplaza a `SiloGuard_definicion_producto.md` v2 para el alcance del MVP construido.
>
> **No incluye** la pantalla de Resumen semanal (descartada).

---

## Decisiones de base

| Parámetro | Decisión |
|---|---|
| Roles de usuario | Solo productor (MVP) |
| Acción de aireación | Recomendación manual (sin control IoT remoto) |
| Cantidad de silos | Variable — N silos por establecimiento (mínimo 1 vinculado para acceder al Dashboard) |
| Pasaporte de Calidad | **Incluido**, con ciclo manual Iniciar / Finalizar lote |
| Sin conexión | Muestra último dato conocido + timestamp + aviso visual; diferencia entre celular sin red y lanza sin respuesta |
| Niveles de alerta | Crítica / Advertencia / Resuelta |
| Autenticación | Email + contraseña · Google · Apple (SSO como placeholder de UI) |
| Tutorial onboarding | Obligatorio en primer ingreso, re-accesible desde Perfil |
| Plataforma | iOS + Android (dark-first, diseño unificado) |
| Idioma | Español rioplatense (voseo) |
| Navegación principal | Tab bar inferior con 4 secciones: Dashboard · Alertas · Calidad · Perfil |
| Notificaciones | Push obligatorias para alertas críticas; toggle para advertencias y silencio nocturno |
| Pronóstico meteorológico | Integrado en el detalle del silo (3 días + riesgo cruzado) |
| Contacto con técnico | Llamada o mensaje desde la pantalla de alerta |

---

## Funcionalidades

### 1 · Autenticación y sesión
- Login con email/contraseña; botones de Google y Apple presentes.
- Registro **en dos pasos**: (1) datos personales (nombre, email, teléfono, contraseña con validación en vivo — mín. 8 caracteres, 1 mayúscula, 1 número); (2) datos del establecimiento (nombre, localidad/provincia, aceptación de T&C).
- Verificación de email post-registro con cooldown de reenvío (60 s) y opción de cambiar email o contactar soporte.
- Recuperación de contraseña por email con vista de confirmación.
- Sesión persistente.

### 2 · Onboarding
- Solicitud de permisos push con explicación previa; permite "Ahora no" con aviso de reversibilidad desde Configuración.
- Vinculación de lanza IoT en dos sub-pasos (paso 1 de 2): (a) escaneo QR con estados idle/scanning/ok/invalid, permiso de cámara denegado, y **ingreso manual del código**; (b) selección de red WiFi (con detección de contraseña incorrecta y "lanza no responde") y **ingreso manual de SSID**.
- Asignación del silo (paso 2 de 2): nombre + tipo (Silo fijo / Silobolsa) + tonelaje opcional + tipo de grano (Soja/Maíz/Trigo/Girasol/Otro con custom).
- Tutorial walkthrough de 4 pasos (Dashboard · Alertas · Historial · Pasaporte) con spotlight sobre elementos del dashboard mock.

### 3 · Monitoreo de silos
- Dashboard multi-silo con 3 chips resumen (Silos · Alertas activas · Estado global) y lista de silos donde cada tarjeta muestra tono de estado, nombre, grano/tonelaje/última actualización y **la lectura más crítica** con su unidad.
- Banner clickeable de "alertas activas" cuando hay ≥ 1.
- Detalle del silo con StatusBadge, 3 tiles de sensor (Temp / Humedad / CO₂), pestañas **Información** (datos del grano + pronóstico 3 días + gráfico 7 días de temperatura) y **Alertas** del silo. Menú "⋯" con Editar · Umbrales · Iniciar/Finalizar lote · Eliminar.
- Historial de sensores: tabs CO₂/Temperatura/Humedad, selector de rango 24 h / 48 h / 72 h / 7 días, línea de umbral, min / máx / promedio, marcadores de alertas en el timeline.
- Pronóstico meteorológico integrado (3 días + nivel de riesgo cruzado).

### 4 · Sistema de alertas
- Lista de alertas filtrable en 4 solapas con contadores: Todas · Críticas · Advertencias · Resueltas.
- Detalle de alerta con badge de nivel, tile "Lectura registrada vs Umbral", secciones "¿Qué está pasando?", "¿Dónde?", "¿Cuánto tiempo tenés?" y "¿Qué hacer?", acceso al historial de sensores del silo y botón para contactar técnico.
- Marcar como resuelta abre un bottom sheet con acciones predefinidas (Aireación · Inspección · Técnico · Otro) y nota opcional; feedback vía toast.

### 5 · Gestión de silos
- Agregar silo desde el FAB "+" del Dashboard, con el mismo flujo QR + WiFi + Asignación de datos.
- Campo adicional "Fecha de acopio" al crear/editar.
- Editar silo: nombre, tipo de almacenamiento, tonelaje, tipo de grano.
- Zona de peligro con eliminación confirmada por bottom sheet ("Esta acción no se puede deshacer") + toast.

### 6 · Configuración y perfil
- Perfil del productor con nombre, email verificado, nombre del establecimiento, accesos a Umbrales, Notificaciones, Dispositivos, Repetir tutorial, T&C, cierre de sesión.
- Editar perfil (nombre + establecimiento; email de solo lectura con nota de contactar soporte).
- Configuración de umbrales por silo (sliders para CO₂ máx, Temperatura máx, Humedad máx; restaurar valores recomendados; warning inline al salirse del rango recomendado).
- Notificaciones: alertas críticas siempre activas; toggle de advertencias; silencio nocturno con rango horario configurable; estado de permisos del sistema con link a ajustes.
- **Dispositivos:** lista de lanzas vinculadas al establecimiento con su estado (agregado respecto de la v2).

### 7 · Pasaporte de Calidad
- Lista de lotes de la temporada con estado (En monitoreo / Finalizado), score promedio y días monitoreados.
- Detalle del lote / pasaporte: score histórico, gráfico de evolución, período de monitoreo, código QR verificable, botón compartir.
- Ciclo manual **Iniciar lote** / **Finalizar lote** desde el menú "⋯" del detalle del silo (bottom sheets), con emisión del certificado al finalizar.

### 8 · Funcionalidad de contacto
- Pantalla de contacto con técnico accesible desde el detalle de una alerta: llamada directa, envío de mensaje (con contexto de la alerta), horario de atención, formulario de consulta fuera de horario, aviso "necesitás conexión" si offline.

### 9 · Estados especiales
- **Sin conexión (celular):** banner superior sobre Dashboard/Detalle con "reciente" (< 1 h) vs "prolongado" (> 1 h), datos cacheados con timestamp relativo, acciones de escritura deshabilitadas con hint, FAB "+" deshabilitado; toast al recuperar conexión.
- **Lanza sin respuesta:** banner específico dentro del Detalle del silo con instrucciones de diagnóstico y acceso a contacto con soporte; sensores en tono muted; menú "⋯" restringe Iniciar/Finalizar lote.

---

## Pantallas — 26 en total

Numeración conservada respecto de la v2 para que las referencias cruzadas sigan siendo válidas; la pantalla 26 (Resumen semanal) fue eliminada.

### Bloque 1 — Autenticación (6 pantallas)
- **[1] Splash** — logo + spinner + pulse; transición automática a Welcome.
- **[2] Welcome** — carrusel de 3 slides (Monitoreo · Alertas · Pasaporte) con dots + CTAs "Registrarme" / "Iniciar sesión".
- **[3] Login** — email + contraseña (con toggle de visibilidad), link "¿Olvidaste tu contraseña?", separador "o continuá con" + Google/Apple, link a Registro. Estados: default, loading, error de credenciales, éxito.
- **[4] Registro (2 pasos)** — Paso 1 (nombre, email, teléfono, contraseña con reglas en vivo). Paso 2 (establecimiento, localidad, T&C). Manejo de "email ya registrado".
- **[5] Verificación de email** — icono, texto con email, botón "Reenviar email" con cooldown 60 s, links "Cambiar email" y "¿Problemas? Contactanos".
- **[6] Recuperar contraseña** — formulario + vista de confirmación con CTA "Volver a iniciar sesión".

### Bloque 2 — Onboarding post-registro (4 pantallas)
- **[7] Solicitud de permisos push** — icono campana con glow, CTA "Activar notificaciones", link "Ahora no".
- **[8] Vincular lanza — QR** — cámara con marco, estados idle/scanning/ok/invalid, permiso denegado, ingreso manual del código.
- **[8b] Vincular lanza — WiFi** — lista de redes + contraseña, SSID manual, errores de contraseña / lanza no responde.
- **[9] Asignación de silo** — nombre + tipo de almacenamiento + tonelaje + tipo de grano.
- **[10] Tutorial walkthrough** — overlay obligatorio de 4 pasos (Dashboard · Alertas · Historial · Pasaporte) con spotlight y card contextual; termina en "¡Empezar!".

### Bloque 3 — Silos y monitoreo (3 pantallas)
- **[11] Dashboard** — establecimiento como eyebrow, título "Mis silos", 3 chips-resumen, banner de alertas activas, lista de silos (ListItem) con la lectura crítica, FAB "+". Deshabilita acciones al perder conexión.
- **[12] Detalle del silo** — header con StatusBadge y menú "⋯"; LoteStatusCard; 3 tiles sensor; tabs Información / Alertas; pronóstico 3 días; sparkline 7 días.
- **[13] Historial de sensores** — tabs CO₂/Temp/Humedad, selector de rango, línea de umbral, estadísticos, marcadores de alerta.

### Bloque 4 — Alertas (3 pantallas)
- **[14] Lista de alertas** — 4 solapas con contadores, tarjetas AlertCard, empty states por solapa.
- **[15] Detalle de alerta** — badge, "Lectura vs Umbral", secciones qué/dónde/cuánto/qué hacer, historial y contacto técnico, "Marcar como resuelta" (deshabilitado offline con hint).
- **[16] Confirmación de resolución** — bottom sheet con 4 acciones predefinidas + nota opcional.

### Bloque 5 — Gestión de silos (2 pantallas)
- **[17] Agregar silo** — mismo flujo QR + WiFi + Asignación con "Fecha de acopio" adicional; deshabilitado si el celular está offline.
- **[18] Editar / Eliminar silo** — precarga de datos, botón "Guardar cambios" habilitado sólo con diferencias, zona de peligro con confirmación en bottom sheet.

### Bloque 6 — Configuración y perfil (4 pantallas · +1 extra)
- **[19] Mi perfil** — avatar, datos, lista de accesos (Umbrales · Notificaciones · Dispositivos · Repetir tutorial · T&C · versión), cierre de sesión.
- **[20] Editar perfil** — nombre + establecimiento; email de solo lectura.
- **[21] Configuración de umbrales** — selector de silo, 3 sliders con valores recomendados y warnings.
- **[22] Notificaciones** — toggles de críticas (requerido) / advertencias / silencio nocturno con rango horario; estado de permisos del sistema.
- **[Extra] Dispositivos** — lista de lanzas vinculadas y su estado (agregado sobre la v2).

### Bloque 7 — Pasaporte de Calidad (2 pantallas)
- **[23] Lista de lotes** — tarjetas con estado (En monitoreo / Finalizado), score, días.
- **[24] Detalle del lote** — certificado con QR, gráfico de evolución, período, compartir.

### Bloque 8 — Funcionalidades adicionales (1 pantalla)
- **[25] Contacto con técnico** — card de contexto (alerta), llamada, mensaje, formulario fuera de horario, aviso sin conexión.
- **[26] ~~Resumen semanal~~** — **eliminada**.

### Bloque 9 — Estados especiales (2 pantallas / estados)
- **[27] Sin conexión (celular)** — banner global; reciente vs prolongado; acciones deshabilitadas; toast al reconectar.
- **[28] Lanza sin respuesta** — banner por silo con pasos de diagnóstico y link a soporte.

**Total: 26 pantallas + 1 pantalla extra (Dispositivos) = 27 vistas implementadas.**

---

## Flows

### Flow 1 — Usuario nuevo (primer uso)
Splash → Welcome (carrusel) → Registro paso 1 → Registro paso 2 → Verificación de email → Permisos push → Vincular lanza (QR) → Vincular lanza (WiFi) → Asignación de silo → Tutorial (4 pasos) → Dashboard.

### Flow 2 — Usuario recurrente
Splash → (sesión activa) → Dashboard. Si expiró: Login → Dashboard.

### Flow 3 — Recuperar contraseña
Login → Recuperar contraseña → vista de confirmación → Login.

### Flow 4 — Responder una alerta
Lista de alertas o notificación → Detalle de alerta → (opcional) Historial de sensores o Contacto con técnico → Marcar como resuelta (bottom sheet) → toast → Lista de alertas.

### Flow 5 — Revisión rápida diaria
Dashboard → si algo en amarillo/rojo → Detalle del silo → Historial y/o Lista de alertas. Con banners de estados especiales si aplican.

### Flow 6 — Agregar un nuevo silo
Dashboard → FAB "+" → Agregar silo (QR → WiFi → Asignación con fecha de acopio) → Dashboard con el nuevo silo.

### Flow 7 — Configurar umbrales
Perfil → Umbrales (elegir silo) **o** Detalle del silo → menú ⋯ → Umbrales (silo preseleccionado) → ajustar sliders → Guardar → toast.

### Flow 8 — Pasaporte de Calidad
- **Iniciar lote:** Detalle del silo → menú ⋯ → Iniciar lote (bottom sheet) → toast + estado del silo actualizado.
- **Consultar / compartir:** Tab Calidad → Lista de lotes → Detalle del lote → Compartir.
- **Finalizar lote:** Detalle del silo → menú ⋯ → Finalizar lote (confirm) → certificado emitido → Detalle del pasaporte.

### Flow 9 — Editar / eliminar silo
Detalle del silo → menú ⋯ → Editar silo → cambios → Guardar (toast) **o** botón "Eliminar silo" → confirmación → Dashboard sin el silo (toast).

### Flow 10 — Estados especiales
- **Celular sin conexión:** banner global en Dashboard/Detalle, datos cacheados, FAB y acciones de escritura deshabilitadas; toast al reconectar.
- **Lanza sin respuesta:** banner en Detalle del silo con pasos de diagnóstico → tap "Contactar soporte" → Contacto con técnico.

---

## Resumen de pantallas

| Bloque | Pantallas | Cantidad |
|---|---|---|
| 1 · Autenticación | 1 · 2 · 3 · 4 · 5 · 6 | 6 |
| 2 · Onboarding | 7 · 8 · 8b · 9 · 10 | 4 (+1 sub-paso) |
| 3 · Silos y monitoreo | 11 · 12 · 13 | 3 |
| 4 · Alertas | 14 · 15 · 16 | 3 |
| 5 · Gestión de silos | 17 · 18 | 2 |
| 6 · Configuración y perfil | 19 · 20 · 21 · 22 · Dispositivos | 4 (+1 extra) |
| 7 · Pasaporte de Calidad | 23 · 24 | 2 |
| 8 · Funcionalidades adicionales | 25 | 1 |
| 9 · Estados especiales | 27 · 28 | 2 |
| **Total** | | **26 pantallas + 1 extra** |
