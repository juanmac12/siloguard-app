# SiloGuard — Definición de Producto v2

> Documento de referencia para desarrollo · Basado en MVP + refinamiento de funcionalidades, pantallas y flujos

---

## Decisiones de base

| Parámetro | Decisión | Notas |
|---|---|---|
| Roles de usuario | Solo productor (MVP) | Futuro: rol técnico/agrónomo, administrador de establecimiento |
| Acción de aireación | Recomendación manual (sin control IoT remoto) | La app indica qué hacer; el productor actúa en el campo |
| Cantidad de silos | Variable — se soportan N silos por establecimiento | Mínimo 1 silo vinculado para acceder al Dashboard |
| Pasaporte de Calidad | **Incluido en MVP** | Pantallas activas con funcionalidad completa |
| Sin conexión | Muestra último dato conocido + timestamp + aviso visual | Diferencia entre sin red del celular y lanza sin respuesta |
| Niveles de alerta | Crítica / Advertencia | Cada nivel con estilo visual y prioridad diferenciada |
| Autenticación | Email + contraseña · Google login · Apple login | Sesión persistente con token refresh |
| Tutorial onboarding | Obligatorio en primer ingreso (no se puede saltear) | Accesible después desde Configuración para repetirlo |
| Plataforma | iOS + Android (React Native o Flutter) | Dark-first, diseño unificado |
| Idioma | Español rioplatense (voseo) | "Clavá la lanza", "Registrate", "Tu silo" |
| Navegación principal | Tab bar inferior con 4 secciones | Dashboard · Alertas · Calidad · Perfil |
| Notificaciones | Push obligatorias para alertas; resumen semanal opt-in | Permiso solicitado en onboarding con explicación previa |
| Pronóstico meteorológico | Integrado en detalle del silo | Datos de API externa (ej: OpenWeatherMap) |
| Contacto con técnico | Chat o llamada desde pantalla de alerta | Disponible solo cuando hay alerta activa (MVP) |

---

## Funcionalidades

### 1 · Autenticación y sesión
- Login con email/contraseña, Google y Apple
- Registro de cuenta con datos del productor y su establecimiento
- Verificación de email post-registro (código o link)
- Recuperación de contraseña por email
- Sesión persistente (no requiere login en cada apertura)
- Cierre de sesión desde perfil

### 2 · Onboarding
- Solicitud de permisos de notificaciones push (pantalla dedicada con explicación de valor)
- Vinculación de lanza IoT: escaneo QR + configuración WiFi (pantalla 1) → asignación de nombre al silo (pantalla 2)
- Tutorial walkthrough obligatorio (3–4 pasos) explicando las secciones principales
- Tutorial re-accesible desde Configuración

### 3 · Monitoreo de silos
- Dashboard multi-silo: lista de todos los silos con estado resumido (verde / amarillo / rojo)
- Score general del silo (1–100) calculado por IA en base a los tres sensores
- Lectura en tiempo real de CO₂, temperatura y humedad por silo
- Historial gráfico (líneas) de las últimas 48–72 hs, con selector de variable
- Pronóstico meteorológico integrado: clima de los próximos 3 días cruzado con riesgo interno
- Estado offline: banner visible con fecha/hora del último dato conocido

### 4 · Sistema de alertas
- Notificación push inmediata al detectar anomalía (Crítica / Advertencia)
- Deep link desde la notificación directo al detalle de esa alerta
- Descripción en lenguaje simple: qué pasa · qué zona · horas estimadas · qué hacer
- Acción recomendada contextual (encender aireación / inspección presencial / contactar técnico)
- Contacto directo con técnico/agrónomo desde la pantalla de alerta
- Confirmación de resolución con nota opcional
- Lista de alertas filtrable: Todas / Críticas / Advertencias / Resueltas
- Historial de alertas de la temporada

### 5 · Gestión de silos
- Agregar nuevo silo (vincula una nueva lanza)
- Editar nombre de un silo existente
- Eliminar silo con confirmación y advertencia de pérdida de historial

### 6 · Configuración y perfil
- Configuración de umbrales personalizados por silo (CO₂, temperatura, humedad)
- Silencio de notificaciones nocturnas (rango horario configurable)
- Preferencias de resumen semanal (activar/desactivar)
- Perfil del usuario: nombre, datos del establecimiento, email
- Repetir tutorial de onboarding

### 7 · Pasaporte de Calidad
- Lista de lotes de la temporada con estado, score promedio y días monitoreados
- Detalle del lote: score histórico, gráfico de evolución, código QR verificable
- Compartir pasaporte con bancos, acopios o compradores

### 8 · Resumen semanal
- Notificación push programada (lunes) con resumen del estado de la semana anterior
- Pantalla con promedios de valores, tendencia por silo y estado general del grano

### 9 · Estados especiales
- Sin conexión del celular: aviso global, último dato conocido con timestamp
- Lanza sin respuesta: aviso específico por silo, sugerencias de resolución (verificar WiFi, revisar lanza)

---

## Pantallas — 28 en total

---

### Bloque 1 — Autenticación (6 pantallas)

---

#### Pantalla 1 · Splash Screen

**Descripción:** Pantalla inicial que se muestra mientras la app se inicializa. Verifica si hay sesión activa para decidir el destino (Dashboard o Welcome).

**Elementos de UI:**
- Logo SiloGuard centrado (anillo-sensor + wordmark)
- Animación de carga sutil (spinner o pulso del logo)
- Fondo oscuro (`#0A0A0A`)

**Estados:**
- *Cargando:* logo con animación de pulso
- *Sesión activa encontrada:* transición automática a Dashboard [11]
- *Sin sesión:* transición a Welcome [2]
- *Error de inicialización:* pantalla de error con botón "Reintentar"

**Acciones:** Ninguna del usuario — es automática.

---

#### Pantalla 2 · Welcome

**Descripción:** Pantalla de bienvenida con la propuesta de valor de SiloGuard. Primer punto de contacto para usuarios no autenticados.

**Elementos de UI:**
- Logo SiloGuard
- Headline: "Monitoreo inteligente de tus granos"
- Subhead: "Notificación con 48 hs de anticipación a pérdidas"
- Ilustración o gráfico simple del producto (lanza + silo)
- Botón primario: "Registrarme"
- Botón secundario/ghost: "Iniciar sesión"

**Estados:**
- *Default:* pantalla estática con los dos CTAs

**Acciones:**
- Tap "Registrarme" → Registro [4]
- Tap "Iniciar sesión" → Login [3]

---

#### Pantalla 3 · Login

**Descripción:** Formulario de ingreso para usuarios con cuenta existente.

**Elementos de UI:**
- Header con botón "← Volver" a Welcome [2]
- Título: "Iniciar sesión"
- Campo email (label "EMAIL", placeholder "tu@email.com")
- Campo contraseña (label "CONTRASEÑA", con toggle de visibilidad)
- Link "¿Olvidaste tu contraseña?"
- Botón primario: "Ingresar" (disabled hasta que ambos campos tengan contenido)
- Separador "o ingresá con"
- Botón Google login
- Botón Apple login

**Estados:**
- *Default:* campos vacíos, botón "Ingresar" disabled
- *Campos completos:* botón "Ingresar" enabled
- *Cargando:* botón con spinner, campos disabled
- *Error de credenciales:* mensaje inline "Email o contraseña incorrectos" en rojo, campos con borde rojo
- *Error de red:* toast "Sin conexión. Verificá tu internet e intentá de nuevo."
- *Cuenta no verificada:* redirige a Verificación de email [5]

**Acciones:**
- Completar campos → habilita botón
- Tap "Ingresar" → valida credenciales → Dashboard [11]
- Tap "¿Olvidaste tu contraseña?" → Recuperar contraseña [6]
- Tap Google/Apple → flujo OAuth → Dashboard [11]
- Tap "← Volver" → Welcome [2]

---

#### Pantalla 4 · Registro

**Descripción:** Formulario de creación de cuenta. Recopila los datos mínimos del productor y su establecimiento.

**Elementos de UI:**
- Header con botón "← Volver" a Welcome [2]
- Título: "Creá tu cuenta"
- Campo nombre completo (label "NOMBRE COMPLETO")
- Campo nombre del establecimiento (label "ESTABLECIMIENTO")
- Campo email (label "EMAIL")
- Campo contraseña (label "CONTRASEÑA", requisitos visibles: mín. 8 caracteres, 1 mayúscula, 1 número)
- Campo confirmar contraseña (label "CONFIRMAR CONTRASEÑA")
- Checkbox "Acepto los términos y condiciones" con link
- Botón primario: "Crear cuenta"
- Link inferior: "¿Ya tenés cuenta? Iniciá sesión"

**Estados:**
- *Default:* campos vacíos, botón disabled
- *Validación en tiempo real:* indicadores de requisito de contraseña (check verde / gris)
- *Contraseñas no coinciden:* mensaje de error inline
- *Email ya registrado:* mensaje "Este email ya está registrado. ¿Querés iniciar sesión?"
- *Cargando:* botón con spinner
- *Error de red:* toast con mensaje de error

**Acciones:**
- Completar todos los campos + checkbox → habilita botón
- Tap "Crear cuenta" → crea usuario → Verificación de email [5]
- Tap "Iniciá sesión" → Login [3]

---

#### Pantalla 5 · Verificación de email

**Descripción:** Pantalla de espera post-registro que indica que se envió un email de verificación.

**Elementos de UI:**
- Icono de email/sobre (88px, estilo check-circle con glow verde)
- Título: "Verificá tu email"
- Texto: "Te enviamos un enlace de verificación a [email]. Revisá tu bandeja de entrada."
- Botón secundario: "Reenviar email"
- Texto muted: "¿No lo encontrás? Revisá tu carpeta de spam."
- Link: "Cambiar email"
- Contador de cooldown para reenvío (60 segundos)

**Estados:**
- *Esperando verificación:* estado default
- *Email reenviado:* toast de confirmación "Email reenviado correctamente"
- *Cooldown activo:* botón "Reenviar" disabled con contador regresivo
- *Email verificado:* transición automática (vía deep link o polling) a Solicitud de permisos [7]
- *Error al reenviar:* toast de error

**Acciones:**
- Tap "Reenviar email" → reenvía y muestra cooldown
- Tap "Cambiar email" → vuelve a Registro [4] con datos precargados
- Verificación completada (deep link) → Solicitud de permisos [7]

---

#### Pantalla 6 · Recuperar contraseña

**Descripción:** Permite al usuario solicitar un link de reset de contraseña.

**Elementos de UI:**
- Header con botón "← Volver" a Login [3]
- Título: "Recuperá tu contraseña"
- Texto: "Ingresá el email con el que te registraste y te enviamos un enlace para crear una nueva contraseña."
- Campo email (label "EMAIL")
- Botón primario: "Enviar enlace"

**Estados:**
- *Default:* campo vacío, botón disabled
- *Campo completo:* botón enabled
- *Cargando:* botón con spinner
- *Email enviado:* cambia a vista de confirmación con icono de check, texto "Revisá tu bandeja de entrada" y botón "Volver a iniciar sesión"
- *Email no encontrado:* mensaje inline "No encontramos una cuenta con ese email"
- *Error de red:* toast de error

**Acciones:**
- Completar email → habilita botón
- Tap "Enviar enlace" → envía email → vista de confirmación
- Tap "Volver a iniciar sesión" → Login [3]

---

### Bloque 2 — Onboarding post-registro (4 pantallas)

---

#### Pantalla 7 · Solicitud de permisos

**Descripción:** Explica al productor por qué son necesarias las notificaciones push antes de lanzar el diálogo nativo del sistema operativo.

**Elementos de UI:**
- Icono de campana (88px, estilo badge con glow verde)
- Título: "Activá las notificaciones"
- Texto: "SiloGuard te avisa con al menos 48 hs de anticipación cuando detecta un problema en tu grano. Sin notificaciones, podrías perderte una alerta crítica."
- Botón primario: "Activar notificaciones"
- Link muted: "Ahora no" (solo si se permite saltearlo)

**Estados:**
- *Default:* explicación + CTA
- *Permiso concedido:* transición a Vincular Lanza [8]
- *Permiso denegado:* mensaje suave "Podés activarlas después desde Configuración" + transición a Vincular Lanza [8]
- *Permiso ya otorgado (reinstalación):* skip automático

**Acciones:**
- Tap "Activar notificaciones" → diálogo nativo del OS → Vincular Lanza [8]
- Tap "Ahora no" → Vincular Lanza [8] (registra que no activó)

---

#### Pantalla 8 · Vincular Lanza IoT — Escaneo y conexión

**Descripción:** Primer paso de la vinculación del dispositivo: escaneo del código QR de la lanza y configuración de la red WiFi.

**Elementos de UI:**
- Header: "Vincular lanza" con indicador de progreso (paso 1 de 2)
- Sub-paso A — Escaneo QR:
  - Visor de cámara con marco de escaneo
  - Texto: "Apuntá la cámara al código QR de tu lanza"
  - Animación de línea de escaneo
  - Link: "¿No tenés el código QR?" → instrucciones de dónde encontrarlo
- Sub-paso B — Conexión WiFi (aparece tras escaneo exitoso):
  - Icono de WiFi
  - Texto: "Conectá tu lanza a la red WiFi"
  - Selector de red WiFi disponible (lista)
  - Campo contraseña de la red
  - Botón primario: "Conectar"
  - Indicador de estado de conexión (conectando / conectada / error)

**Estados:**
- *Esperando escaneo:* cámara activa con visor
- *QR detectado:* feedback visual (vibración + check verde) → transición a WiFi
- *QR inválido:* mensaje "Este código no corresponde a una lanza SiloGuard. Intentá de nuevo."
- *Permiso de cámara denegado:* instrucciones para habilitarlo desde Ajustes del teléfono
- *Buscando redes WiFi:* spinner en la lista
- *Red seleccionada, conectando:* spinner en botón "Conectar"
- *Conexión WiFi exitosa:* check verde + transición automática a Asignación [9]
- *Error de conexión WiFi:* mensaje "No se pudo conectar. Verificá la contraseña o acercá el celular al router." + botón "Reintentar"
- *Lanza no encontrada en la red:* mensaje "La lanza no responde. Verificá que esté encendida y cerca del router."

**Acciones:**
- Apuntar cámara al QR → escaneo automático
- Seleccionar red WiFi → ingresar contraseña → tap "Conectar"
- Tap "Reintentar" → repite intento de conexión
- Tap "← Volver" → vuelve a paso anterior o Solicitud de permisos [7]

---

#### Pantalla 9 · Vincular Lanza IoT — Asignación de silo

**Descripción:** Segundo paso: el productor asigna un nombre identificatorio al silo donde clavó la lanza.

**Elementos de UI:**
- Header: "Vincular lanza" con indicador de progreso (paso 2 de 2)
- Icono de check-circle verde (88px) con texto "Lanza conectada correctamente"
- Campo de texto: "NOMBRE DEL SILO" (placeholder "Ej: Silo Norte, Bolsa 3")
- Texto muted: "Podés cambiar el nombre en cualquier momento."
- Selector de tipo de almacenamiento: Silo fijo / Silobolsa (segmented control)
- Campo opcional: tonelaje estimado (label "TONELAJE ESTIMADO", suffix "tn")
- Campo opcional: tipo de grano (label "TIPO DE GRANO", select: Soja / Maíz / Trigo / Girasol / Otro)
- Botón primario: "Guardar y continuar"

**Estados:**
- *Default:* campo nombre vacío, botón disabled
- *Nombre ingresado:* botón enabled
- *Cargando:* botón con spinner
- *Error al guardar:* toast de error + botón habilitado para reintentar
- *Éxito:* transición a Tutorial [10]

**Acciones:**
- Ingresar nombre del silo (obligatorio)
- Seleccionar tipo de almacenamiento (default: Silo fijo)
- Opcionalmente completar tonelaje y tipo de grano
- Tap "Guardar y continuar" → guarda silo → Tutorial [10]

---

#### Pantalla 10 · Tutorial walkthrough

**Descripción:** Overlay obligatorio de 3–4 pasos que introduce las secciones principales de la app. No se puede cerrar hasta completarlo.

**Elementos de UI:**
- Overlay semi-transparente sobre el Dashboard
- Tarjeta de tutorial con:
  - Ilustración o highlight de la sección
  - Título del paso (ej: "Tu Dashboard", "Alertas inteligentes", "Historial de sensores")
  - Descripción breve (1–2 líneas)
  - Indicador de progreso (dots: ● ● ○ ○)
  - Botón "Siguiente" / en el último paso: "¡Empezar!"
- Sin botón de cerrar ni skip

**Estados:**
- *Paso 1:* explica Dashboard y estado de silos
- *Paso 2:* explica sistema de alertas y anticipación de 48 hs
- *Paso 3:* explica historial de sensores y seguimiento post-acción
- *Paso 4 (último):* explica Pasaporte de Calidad + botón "¡Empezar!"
- *Completado:* se marca en el perfil del usuario, no vuelve a aparecer

**Acciones:**
- Tap "Siguiente" → avanza al siguiente paso
- Tap "¡Empezar!" (último paso) → cierra overlay → Dashboard [11] interactivo

---

### Bloque 3 — Core: silos y monitoreo (3 pantallas)

---

#### Pantalla 11 · Dashboard / Lista de silos

**Descripción:** Vista principal post-login. Muestra todos los silos del establecimiento con su estado resumido. Es la pantalla que el productor abre todos los días.

**Elementos de UI:**
- Status bar del sistema (44px)
- Header: "Mis silos" + nombre del establecimiento como eyebrow
- Banner de resumen semanal (si hay resumen disponible, tap abre Resumen semanal [26])
- Lista de silo cards, cada una con:
  - Nombre del silo
  - Indicador de estado (dot verde / amarillo / rojo + label: "Normal" / "Atención" / "Crítico")
  - Score general (1–100) con indicador circular
  - Valores resumidos: CO₂ (ppm), temperatura (°C), humedad (%)
  - Última actualización (timestamp)
  - Chevron derecho para navegar al detalle
- Botón flotante "+" para agregar nuevo silo
- Tab bar inferior: Dashboard (activo) · Alertas · Calidad · Perfil

**Estados:**
- *Con silos — todo OK:* lista con cards en verde
- *Con silos — alerta activa:* card(s) en amarillo/rojo con badge de alerta
- *Sin silos:* empty state "Todavía no tenés silos vinculados" + CTA "Vincular lanza"
- *Sin conexión:* banner superior "Sin conexión — Último dato: [fecha hora]" + datos cacheados
- *Cargando:* skeleton cards (3 placeholders)
- *Error de carga:* empty state de error + botón "Reintentar"

**Acciones:**
- Tap en silo card → Detalle del silo [12]
- Tap "+" → Agregar silo [17]
- Tap banner resumen → Resumen semanal [26]
- Pull-to-refresh → recarga datos
- Tap en tab bar → navega entre secciones

---

#### Pantalla 12 · Detalle del silo

**Descripción:** Vista completa de un silo individual con score, valores actuales, pronóstico meteorológico y acceso al historial.

**Elementos de UI:**
- Header: nombre del silo + botón "← Volver" a Dashboard [11] + botón "⋯" (menú)
- Score general prominente (1–100) con anillo circular de progreso coloreado por estado
- Tres tiles de sensor (componente `SensorStat`):
  - CO₂: valor actual (ppm), tendencia (↑↓→), rango normal
  - Temperatura: valor actual (°C), tendencia, rango normal
  - Humedad: valor actual (%), tendencia, rango normal
- Sección "Pronóstico" (mini card):
  - Clima de los próximos 3 días (ícono + temperatura exterior)
  - Indicador de riesgo cruzado: "Riesgo bajo/medio/alto por condiciones externas"
- Botón: "Ver historial completo" → Historial de sensores [13]
- Sección "Alertas recientes" (últimas 2–3 alertas del silo, si las hay)
- Banner offline (cuando aplica): "Sin conexión — Último dato: [fecha hora]"
- Menú "⋯": Editar silo / Configurar umbrales / Eliminar silo

**Estados:**
- *Normal (verde):* score alto, todos los sensores en rango, sin alertas
- *Advertencia (amarillo):* score medio, al menos un sensor cerca del límite
- *Crítico (rojo):* score bajo, al menos un sensor fuera de rango, alertas activas
- *Sin conexión:* banner offline, datos de la última lectura, timestamp visible
- *Lanza sin respuesta:* banner específico "La lanza no responde desde [hora]" con link a pantalla de error [28]
- *Cargando:* skeleton del score y tiles

**Acciones:**
- Tap "Ver historial completo" → Historial de sensores [13]
- Tap en alerta reciente → Detalle de alerta [15]
- Tap "⋯" → menú contextual (Editar / Umbrales / Eliminar)
- Tap "Editar silo" → Editar/Eliminar silo [18]
- Tap "Configurar umbrales" → Configuración de umbrales [21]
- Tap "Eliminar silo" → modal de confirmación
- Pull-to-refresh → recarga datos del silo
- Tap "← Volver" → Dashboard [11]

---

#### Pantalla 13 · Historial de sensores

**Descripción:** Gráfico de líneas que muestra la evolución de los sensores en las últimas 48–72 horas. Permite al productor verificar tendencias y confirmar que una acción correctiva funcionó.

**Elementos de UI:**
- Header: "Historial" + nombre del silo + botón "← Volver"
- Tabs selector de variable: CO₂ / Temperatura / Humedad (componente `Tabs`, estilo pill)
- Gráfico de líneas con:
  - Eje X: tiempo (últimas 48–72 hs)
  - Eje Y: valor de la variable seleccionada
  - Línea de umbral (punteada, roja) indicando el límite configurado
  - Zona de riesgo sombreada (por encima del umbral)
  - Marcadores de alertas en el timeline (triángulos rojos/amarillos)
  - Tooltip al tocar un punto: valor exacto + fecha/hora
- Selector de rango temporal: "24 hs" / "48 hs" / "72 hs" / "7 días"
- Valores estadísticos: mínimo / máximo / promedio del rango seleccionado
- Leyenda: "— Valor actual  ┈ Umbral de alerta"

**Estados:**
- *Con datos:* gráfico completo con línea de tendencia
- *Datos parciales:* gráfico con gaps (zonas sin datos por desconexión, indicadas con línea punteada)
- *Sin datos:* empty state "Todavía no hay suficientes datos para este período"
- *Cargando:* skeleton del gráfico

**Acciones:**
- Tap en tab (CO₂ / Temperatura / Humedad) → cambia variable del gráfico
- Tap en selector de rango → cambia período temporal
- Tap/drag en gráfico → muestra tooltip con valor exacto
- Pinch-to-zoom horizontal → ajusta rango visible
- Tap en marcador de alerta → Detalle de alerta [15]
- Tap "← Volver" → Detalle del silo [12]

---

### Bloque 4 — Alertas (4 pantallas)

---

#### Pantalla 14 · Lista de alertas

**Descripción:** Listado cronológico de todas las alertas de la temporada, filtrable por estado. Accesible desde el tab "Alertas" de la navegación inferior.

**Elementos de UI:**
- Header: "Alertas"
- Filtros horizontales (chips scrolleables): Todas / Críticas / Advertencias / Resueltas
- Lista de alert cards (componente `AlertCard`), cada una con:
  - Indicador de nivel (dot rojo Crítica / amarillo Advertencia / verde Resuelta)
  - Nombre del silo afectado
  - Descripción breve (1 línea)
  - Fecha y hora
  - Estado: "Activa" / "Resuelta"
  - Chevron derecho
- Tab bar inferior: Dashboard · Alertas (activo) · Calidad · Perfil

**Estados:**
- *Con alertas:* lista ordenada por fecha (más reciente arriba)
- *Sin alertas:* empty state "Todo en orden. No hay alertas activas." con icono de check-circle
- *Filtro sin resultados:* "No hay alertas [críticas/de advertencia/resueltas] en esta temporada."
- *Sin conexión:* muestra alertas cacheadas + banner offline
- *Cargando:* skeleton cards (3 placeholders)

**Acciones:**
- Tap en filtro → filtra lista
- Tap en alert card → Detalle de alerta [15]
- Pull-to-refresh → recarga alertas

---

#### Pantalla 15 · Detalle de alerta

**Descripción:** Pantalla completa con toda la información de una alerta específica. Escrita en lenguaje simple para que el productor entienda qué pasa y qué hacer.

**Elementos de UI:**
- Header: "Alerta" + badge de nivel (Crítica / Advertencia) + botón "← Volver"
- Status badge prominente (componente `StatusBadge`)
- Sección "¿Qué está pasando?":
  - Descripción en lenguaje simple (ej: "Se detectó un aumento anormal de CO₂ en tu silo, lo que indica el inicio de un proceso de fermentación.")
- Sección "¿Dónde?":
  - Nombre del silo + zona afectada (si aplica)
- Sección "¿Cuánto tiempo tenés?":
  - Horas estimadas antes de pérdida irreversible (número grande + contexto)
  - Ej: "~36 hs — Tenés tiempo de actuar, pero no demores."
- Sección "¿Qué hacer?":
  - Acción recomendada principal (ej: "Encendé la aireación del silo durante al menos 4 horas.")
  - Acciones secundarias si aplica (ej: "Si no mejora en 12 hs, realizá inspección presencial.")
- Botón primario: "Marcar como resuelta" (si la alerta está activa)
- Botón secundario: "Contactar técnico" → Contacto con técnico [16]
- Link: "Ver historial de sensores" → Historial [13]
- Si la alerta ya fue resuelta: sección con nota de resolución y fecha

**Estados:**
- *Alerta activa — Crítica:* badge rojo, botones de acción visibles
- *Alerta activa — Advertencia:* badge amarillo, botones de acción visibles
- *Alerta resuelta:* badge verde, sin botones de acción, muestra nota de resolución
- *Sin conexión:* datos cacheados, acciones deshabilitadas con mensaje

**Acciones:**
- Tap "Marcar como resuelta" → Confirmación de resolución [16]
- Tap "Contactar técnico" → Contacto con técnico [25]
- Tap "Ver historial de sensores" → Historial [13]
- Tap "← Volver" → Lista de alertas [14]

---

#### Pantalla 16 · Confirmación de resolución

**Descripción:** Modal o bottom sheet donde el productor registra que actuó sobre la alerta. Permite agregar una nota opcional de lo que hizo.

**Elementos de UI:**
- Bottom sheet o modal con:
  - Título: "¿Resolviste la alerta?"
  - Resumen: nombre del silo + tipo de alerta
  - Campo de texto multilínea (label "¿QUÉ ACCIÓN TOMASTE?", placeholder "Ej: Encendí la aireación por 6 horas", opcional)
  - Texto muted: "Esta nota queda registrada en el historial."
  - Botón primario: "Confirmar resolución"
  - Botón ghost: "Cancelar"

**Estados:**
- *Default:* campo vacío, botón habilitado (la nota es opcional)
- *Con nota:* campo con texto ingresado
- *Cargando:* botón con spinner
- *Éxito:* toast "Alerta marcada como resuelta ✓" + vuelve a Lista de alertas [14]
- *Error:* toast de error + botón habilitado para reintentar

**Acciones:**
- Opcionalmente escribir nota
- Tap "Confirmar resolución" → marca resuelta → toast de éxito → vuelve a pantalla anterior
- Tap "Cancelar" → cierra modal, vuelve a Detalle de alerta [15]

---

### Bloque 5 — Gestión de silos (2 pantallas)

---

#### Pantalla 17 · Agregar silo

**Descripción:** Flujo para vincular una nueva lanza al establecimiento. Reutiliza los mismos pasos de las pantallas 8 y 9 pero accesible desde el Dashboard.

**Elementos de UI:**
- Mismo flujo que pantallas [8] y [9] (Escaneo QR + WiFi → Asignación de nombre)
- Header: "Agregar silo" (en lugar de "Vincular lanza")
- Botón "← Volver" regresa al Dashboard [11] en lugar de al onboarding

**Estados:**
- Mismos estados que pantallas [8] y [9]

**Acciones:**
- Mismas acciones que pantallas [8] y [9]
- Al completar → Dashboard [11] con el nuevo silo en la lista

---

#### Pantalla 18 · Editar / Eliminar silo

**Descripción:** Permite al productor modificar los datos de un silo existente o eliminarlo.

**Elementos de UI:**
- Header: "Editar silo" + botón "← Volver"
- Campo nombre del silo (precargado, editable)
- Selector tipo de almacenamiento (precargado)
- Campo tonelaje estimado (precargado, editable)
- Campo tipo de grano (precargado, editable)
- Botón primario: "Guardar cambios"
- Separador
- Zona de peligro: botón danger "Eliminar silo"

**Estados:**
- *Default:* campos precargados con datos actuales
- *Editado:* botón "Guardar cambios" enabled (solo si hay cambios)
- *Guardando:* botón con spinner
- *Guardado exitoso:* toast "Cambios guardados" + vuelve a Detalle [12]
- *Modal de eliminación:* "¿Estás seguro? Se eliminará todo el historial de sensores y alertas de este silo. Esta acción no se puede deshacer." + botón danger "Eliminar" + botón ghost "Cancelar"
- *Eliminando:* spinner en modal
- *Eliminado:* toast "Silo eliminado" + vuelve a Dashboard [11]
- *Error:* toast de error

**Acciones:**
- Editar campos → tap "Guardar cambios"
- Tap "Eliminar silo" → modal de confirmación → tap "Eliminar" → Dashboard [11]
- Tap "Cancelar" en modal → cierra modal
- Tap "← Volver" → Detalle del silo [12]

---

### Bloque 6 — Configuración y perfil (4 pantallas)

---

#### Pantalla 19 · Mi perfil

**Descripción:** Información del productor y su establecimiento. Punto de acceso a configuraciones y cierre de sesión.

**Elementos de UI:**
- Header: "Mi perfil"
- Avatar con inicial del nombre (circle, fondo `green-tint`)
- Nombre del productor (editable inline o link a edición)
- Email vinculado (solo lectura, con badge "Verificado")
- Nombre del establecimiento (editable)
- Separador
- Lista de opciones:
  - "Configuración de umbrales" → [21]
  - "Preferencias de notificaciones" → [22]
  - "Repetir tutorial" → activa Tutorial [10]
  - "Términos y condiciones" → webview
  - "Versión de la app" (texto muted)
- Botón danger al final: "Cerrar sesión"
- Tab bar inferior: Dashboard · Alertas · Calidad · Perfil (activo)

**Estados:**
- *Default:* datos del usuario cargados
- *Editando nombre/establecimiento:* campo activo con botón "Guardar"
- *Cargando:* skeleton de datos
- *Cierre de sesión:* modal "¿Cerrar sesión?" + "Cerrar sesión" / "Cancelar"

**Acciones:**
- Tap en campo editable → edita dato → tap "Guardar"
- Tap en opción de lista → navega a pantalla correspondiente
- Tap "Cerrar sesión" → modal de confirmación → Welcome [2]

---

#### Pantalla 20 · Editar perfil

**Descripción:** Formulario de edición de datos personales y del establecimiento.

**Elementos de UI:**
- Header: "Editar perfil" + botón "← Volver"
- Campo nombre completo (precargado)
- Campo nombre del establecimiento (precargado)
- Campo email (solo lectura, con nota "Para cambiar tu email, contactá a soporte")
- Botón primario: "Guardar cambios"

**Estados:**
- *Default:* campos precargados, botón disabled
- *Editado:* botón enabled
- *Guardando:* botón con spinner
- *Éxito:* toast "Perfil actualizado" + vuelve a Mi perfil [19]
- *Error:* toast de error

**Acciones:**
- Editar campos → tap "Guardar cambios" → Mi perfil [19]
- Tap "← Volver" → Mi perfil [19]

---

#### Pantalla 21 · Configuración de umbrales

**Descripción:** Personalización de los límites que disparan alertas para cada silo. Cada silo puede tener umbrales diferentes.

**Elementos de UI:**
- Header: "Umbrales de alerta" + botón "← Volver"
- Selector de silo (dropdown o tabs si son pocos silos)
- Sección CO₂:
  - Label "CO₂ MÁXIMO (PPM)"
  - Slider con valor numérico editable
  - Rango: 300–5000 ppm
  - Valor recomendado indicado (ej: marca en el slider)
- Sección Temperatura:
  - Label "TEMPERATURA MÁXIMA (°C)"
  - Slider con valor numérico editable
  - Rango: 15–60 °C
- Sección Humedad:
  - Label "HUMEDAD MÁXIMA (%)"
  - Slider con valor numérico editable
  - Rango: 10–100%
- Botón: "Restaurar valores recomendados" (ghost)
- Botón primario: "Guardar"

**Estados:**
- *Default:* valores actuales del silo seleccionado
- *Editado:* botón "Guardar" enabled, valores modificados resaltados
- *Valores fuera de rango recomendado:* warning inline "Este valor está por encima/debajo de lo recomendado para [tipo de grano]"
- *Guardando:* botón con spinner
- *Éxito:* toast "Umbrales actualizados para [nombre del silo]"
- *Error:* toast de error

**Acciones:**
- Seleccionar silo → carga sus umbrales actuales
- Ajustar sliders o editar valores manualmente
- Tap "Restaurar valores recomendados" → resetea a defaults
- Tap "Guardar" → guarda umbrales → toast de éxito
- Tap "← Volver" → pantalla anterior (Perfil [19] o Detalle del silo [12])

---

#### Pantalla 22 · Configuración general / Notificaciones

**Descripción:** Preferencias de notificaciones y configuración general de la app.

**Elementos de UI:**
- Header: "Notificaciones" + botón "← Volver"
- Sección "Alertas":
  - Toggle "Alertas críticas" (siempre on, no desactivable — label "Requerido")
  - Toggle "Advertencias"
- Sección "Resumen semanal":
  - Toggle "Recibir resumen semanal" (default: activado)
  - Texto muted: "Todos los lunes a las 8:00 AM"
- Sección "Silencio nocturno":
  - Toggle "Silenciar notificaciones de noche"
  - Si activado: selector de rango horario (hora inicio – hora fin)
  - Texto muted: "Las alertas críticas se envían siempre, incluso en horario de silencio."
- Separador
- Sección "Permisos del sistema":
  - Estado actual de permisos de notificaciones del OS
  - Si denegado: botón "Abrir ajustes del sistema"

**Estados:**
- *Default:* toggles con valores actuales
- *Silencio nocturno activado:* selector de rango visible
- *Permisos denegados en OS:* banner de advertencia con link a ajustes

**Acciones:**
- Toggle on/off → guarda automáticamente (sin botón "Guardar")
- Ajustar rango horario → guarda automáticamente
- Tap "Abrir ajustes del sistema" → abre settings del OS
- Tap "← Volver" → Mi perfil [19]

---

### Bloque 7 — Pasaporte de Calidad (2 pantallas)

---

#### Pantalla 23 · Lista de lotes

**Descripción:** Todos los lotes almacenados de la temporada con su estado de calidad. Accesible desde el tab "Calidad" de la navegación inferior.

**Elementos de UI:**
- Header: "Pasaporte de Calidad"
- Lista de lote cards, cada una con:
  - Nombre del lote / silo
  - Tipo de grano
  - Score promedio de calidad con indicador visual
  - Días monitoreados
  - Estado: "En monitoreo" / "Finalizado"
  - Chevron derecho
- Tab bar inferior: Dashboard · Alertas · Calidad (activo) · Perfil

**Estados:**
- *Con lotes:* lista ordenada por estado (activos primero) y luego por fecha
- *Sin lotes:* empty state "Todavía no tenés lotes registrados. Los lotes se crean automáticamente al vincular un silo."
- *Sin conexión:* datos cacheados + banner offline
- *Cargando:* skeleton cards

**Acciones:**
- Tap en lote card → Detalle del lote [24]
- Pull-to-refresh → recarga datos

---

#### Pantalla 24 · Detalle del lote / Pasaporte

**Descripción:** Certificado digital del lote con score histórico, evolución y código QR verificable para compartir.

**Elementos de UI:**
- Header: "Pasaporte" + nombre del lote + botón "← Volver"
- Card principal "Certificado de Calidad":
  - Logo SiloGuard
  - Score histórico prominente (grande, con color de estado)
  - Nombre del lote y tipo de grano
  - Período de monitoreo: "DD/MM/AAAA – DD/MM/AAAA"
  - Días bajo monitoreo continuo
  - Cantidad de alertas resueltas durante el período
- Gráfico de evolución: línea temporal del score a lo largo de la temporada
- Código QR verificable (generado, escaneable por terceros)
- Botón primario: "Compartir pasaporte"
- Texto muted: "Este código QR permite a compradores y bancos verificar la calidad del lote."

**Estados:**
- *Lote en monitoreo:* datos en vivo, score actualizado, QR activo
- *Lote finalizado:* datos históricos fijos, QR activo
- *Sin conexión:* datos cacheados, QR puede no ser verificable (aviso)
- *Cargando:* skeleton

**Acciones:**
- Tap "Compartir pasaporte" → share sheet del OS (link o imagen del certificado)
- Tap en QR → amplía el código QR para facilitar escaneo
- Tap "← Volver" → Lista de lotes [23]

---

### Bloque 8 — Funcionalidades adicionales (2 pantallas)

---

#### Pantalla 25 · Contacto con técnico

**Descripción:** Pantalla de contacto directo con un técnico o agrónomo de SiloGuard. Accesible desde el detalle de una alerta activa.

**Elementos de UI:**
- Header: "Contactar técnico" + botón "← Volver"
- Card de contexto: resumen de la alerta desde la que se accedió (silo, tipo de alerta, valores actuales)
- Opciones de contacto:
  - Botón "Llamar ahora" (ícono teléfono + número)
  - Botón "Enviar mensaje" (abre chat o WhatsApp)
- Horario de disponibilidad: "Lunes a sábados, 7:00 a 20:00"
- Fuera de horario: mensaje "Fuera de horario de atención. Dejá tu consulta y te respondemos a primera hora."
- Campo de mensaje (si es fuera de horario): textarea + botón "Enviar consulta"

**Estados:**
- *Dentro de horario:* botones de llamada y mensaje activos
- *Fuera de horario:* botones deshabilitados, formulario de consulta visible
- *Mensaje enviado:* confirmación "Tu consulta fue enviada. Te contactamos pronto."
- *Sin conexión:* aviso "Necesitás conexión para contactar al técnico" + sugerencia de llamar directamente

**Acciones:**
- Tap "Llamar ahora" → abre dialer del teléfono
- Tap "Enviar mensaje" → abre chat/WhatsApp con contexto precargado
- Escribir consulta + tap "Enviar" → envía mensaje → confirmación
- Tap "← Volver" → Detalle de alerta [15]

---

#### Pantalla 26 · Resumen semanal

**Descripción:** Vista del resumen de la semana anterior, accesible desde la notificación push del lunes o desde el banner del Dashboard.

**Elementos de UI:**
- Header: "Resumen semanal" + botón "← Volver" o "✕ Cerrar"
- Período: "Semana del [fecha] al [fecha]"
- Card resumen general:
  - Estado general: "Todos tus silos estuvieron en buen estado" o "Hubo [N] alertas esta semana"
  - Icono de estado (check verde o warning amarillo)
- Lista de silos con resumen individual:
  - Nombre del silo
  - Score promedio de la semana
  - Tendencia (↑ mejorando / → estable / ↓ empeorando)
  - Promedios: CO₂, temperatura, humedad
  - Cantidad de alertas en la semana (si hubo)
- Sección "Próxima semana":
  - Pronóstico climático resumido
  - Nivel de riesgo estimado

**Estados:**
- *Semana sin alertas:* tono positivo, iconografía verde
- *Semana con alertas:* resalta silos que tuvieron alertas, tono informativo
- *Sin datos suficientes:* "No hay suficientes datos para generar el resumen de esta semana"
- *Sin conexión:* datos cacheados si el resumen ya fue descargado

**Acciones:**
- Scroll vertical para ver todos los silos
- Tap en silo → Detalle del silo [12]
- Tap "← Volver" / "✕ Cerrar" → Dashboard [11]

---

### Bloque 9 — Estados especiales (2 pantallas)

---

#### Pantalla 27 · Sin conexión (celular)

**Descripción:** Estado global que se muestra cuando el celular del productor no tiene conectividad a internet. No es una pantalla separada sino un estado superpuesto sobre la pantalla activa.

**Elementos de UI:**
- Banner superior persistente (sobre cualquier pantalla):
  - Ícono wifi-off
  - Texto: "Sin conexión a internet"
  - Subtexto: "Último dato recibido: [fecha hora]"
  - Fondo `surface` con borde `warning`
- Los datos en pantalla se muestran con estilo muted/opacado
- Acciones que requieren red: botones disabled con tooltip "Requiere conexión"
- Al recuperar conexión: banner desaparece + toast "Conexión restablecida" + recarga automática de datos

**Estados:**
- *Sin conexión reciente (< 1 hora):* banner amarillo suave, datos razonablemente frescos
- *Sin conexión prolongada (> 1 hora):* banner con énfasis, texto "Los datos pueden estar desactualizados"
- *Conexión restablecida:* toast verde + recarga

**Acciones:**
- Pull-to-refresh → intenta reconectar
- Las pantallas siguen navegables con datos cacheados
- Acciones de escritura (marcar resuelta, editar silo) quedan en cola y se envían al reconectar

---

#### Pantalla 28 · Error de dispositivo (lanza)

**Descripción:** Estado específico por silo que informa que la lanza no responde o no transmite datos. Se muestra como un banner o sección dentro del Detalle del silo.

**Elementos de UI:**
- Banner dentro del Detalle del silo [12]:
  - Ícono cloud-off o wifi-off
  - Título: "La lanza no responde"
  - Subtexto: "Última señal recibida: [fecha hora]"
  - Fondo `surface` con borde `danger`
- Sección expandible "¿Qué puedo hacer?":
  - Paso 1: "Verificá que la lanza esté encendida y el LED verde parpadee."
  - Paso 2: "Asegurate de que el router WiFi del silo esté funcionando."
  - Paso 3: "Acercate al silo y verificá que la lanza esté correctamente clavada."
  - Paso 4: "Si el problema persiste, contactá a soporte técnico."
- Botón secundario: "Contactar soporte" → Contacto con técnico [25]
- Timestamp de última lectura con formato relativo: "Hace 2 horas", "Hace 1 día"

**Estados:**
- *Desconexión reciente (< 30 min):* banner amarillo, puede ser transitorio
- *Desconexión prolongada (> 30 min):* banner rojo, requiere atención
- *Lanza reconectada:* banner desaparece + toast "Lanza reconectada — datos actualizados"

**Acciones:**
- Tap "Contactar soporte" → Contacto con técnico [25]
- Tap en sección expandible → muestra/oculta pasos de diagnóstico
- Pull-to-refresh → reintenta conexión con la lanza

---

## Resumen de pantallas

| Bloque | Pantallas | Cantidad |
|---|---|---|
| 1 · Autenticación | 1 · 2 · 3 · 4 · 5 · 6 | 6 |
| 2 · Onboarding | 7 · 8 · 9 · 10 | 4 |
| 3 · Silos y monitoreo | 11 · 12 · 13 | 3 |
| 4 · Alertas | 14 · 15 · 16 | 3 |
| 5 · Gestión de silos | 17 · 18 | 2 |
| 6 · Configuración y perfil | 19 · 20 · 21 · 22 | 4 |
| 7 · Pasaporte de Calidad | 23 · 24 | 2 |
| 8 · Funcionalidades adicionales | 25 · 26 | 2 |
| 9 · Estados especiales | 27 · 28 | 2 |
| **Total** | | **28** |

---

## Flows

---

### Flow 1 — Usuario nuevo: primer uso completo

```
Descarga la app
    → Splash Screen [1]
    → Welcome [2]
    → Tap "Registrarme"
    → Registro [4]
        ├── Completa campos → tap "Crear cuenta"
        │   → Verificación de email [5]
        │       ├── Verifica email (deep link) ✓
        │       │   → Solicitud de permisos push [7]
        │       │       ├── Acepta permisos ✓
        │       │       └── Rechaza permisos → continúa igual, registra que no activó
        │       │   → Vincular Lanza — Escaneo y WiFi [8]
        │       │       ├── QR escaneado + WiFi conectada ✓
        │       │       │   → Vincular Lanza — Asignación de silo [9]
        │       │       │       → Asigna nombre → tap "Guardar y continuar"
        │       │       │       → Tutorial walkthrough [10]
        │       │       │           → Completa los 4 pasos
        │       │       │           → Dashboard [11] ← primera acción: revisa el estado del silo
        │       │       ├── QR inválido → mensaje de error → reintenta escaneo
        │       │       └── WiFi falla → mensaje de error + "Reintentar"
        │       │           └── Si persiste → pasos de diagnóstico
        │       ├── No verifica → queda en pantalla de espera
        │       │   → Tap "Reenviar email" (cooldown 60s)
        │       │   → Tap "Cambiar email" → vuelve a Registro [4]
        │       └── Error al reenviar → toast de error
        ├── Email ya registrado → mensaje + link "¿Querés iniciar sesión?"
        └── Error de red → toast de error
```

---

### Flow 2 — Usuario recurrente: ingreso diario

```
Abre la app
    → Splash Screen [1]
        ├── Sesión activa → Dashboard [11] (skip login)
        └── Sesión expirada:
            → Login [3]
                ├── Credenciales correctas → Dashboard [11]
                ├── Credenciales incorrectas → error inline "Email o contraseña incorrectos"
                │   → Reintenta o tap "¿Olvidaste tu contraseña?" → Flow 3
                ├── Google/Apple login → OAuth → Dashboard [11]
                └── Error de red → toast "Sin conexión"

Dashboard [11]
    → Revisa indicadores de color de cada silo
        ├── Todos verdes → cierra la app ✓
        ├── Alguno amarillo/rojo:
        │   → Tap en silo → Detalle del silo [12]
        │       → Revisa score y valores de sensores
        │       → Tap "Ver historial" → Historial de sensores [13]
        │           → Verifica tendencia
        │       → Si hay alerta activa → tap en alerta → Detalle de alerta [15]
        └── Banner de resumen semanal visible → tap → Resumen semanal [26]
```

---

### Flow 3 — Recuperar contraseña

```
Login [3]
    → Tap "¿Olvidaste tu contraseña?"
    → Recuperar contraseña [6]
        ├── Ingresa email → tap "Enviar enlace"
        │   ├── Email encontrado → vista de confirmación "Revisá tu bandeja"
        │   │   → Usuario sigue link externo → setea nueva contraseña
        │   │   → Login [3] → ingresa con nueva contraseña → Dashboard [11]
        │   ├── Email no encontrado → error inline "No encontramos una cuenta con ese email"
        │   │   → Corrige email y reintenta
        │   │   → O tap "← Volver" → Login [3] → tap en Welcome [2] → Registro [4]
        │   └── Error de red → toast de error
        └── Tap "← Volver" → Login [3]
```

---

### Flow 4 — Responder una alerta (task flow crítico)

```
Recibe notificación push (Crítica o Advertencia)
    → Toca la notificación
    → Detalle de alerta [15] (deep link directo)
        → Lee: causa · zona · horas estimadas · acción recomendada

        ¿Necesita verificar los valores antes de actuar?
        ├── Sí → tap "Ver historial" → Historial de sensores [13]
        │       → Revisa gráfico y tendencia
        │       → Tap "← Volver" → Detalle de alerta [15]
        └── No → continúa

        ¿Necesita ayuda profesional?
        ├── Sí → tap "Contactar técnico" → Contacto con técnico [25]
        │       ├── Dentro de horario → llama o envía mensaje
        │       └── Fuera de horario → deja consulta escrita
        │       → Tap "← Volver" → Detalle de alerta [15]
        └── No → continúa

    → Ejecuta la acción recomendada en el campo (manualmente)

    → Tap "Marcar como resuelta" → Confirmación de resolución [16]
        ├── Escribe nota opcional → tap "Confirmar resolución"
        │   ├── Éxito → toast "Alerta resuelta ✓" → Lista de alertas [14]
        │   └── Error → toast de error → reintenta
        └── Tap "Cancelar" → vuelve a Detalle de alerta [15]

    → Después: Historial de sensores [13] ← verifica que los valores bajan
    → Alerta resuelta ✓

    ── Bifurcaciones de error ──
    ├── Sin conexión al abrir notificación → datos cacheados, acciones disabled
    │   → Recupera conexión → acciones enabled → flujo normal
    └── Alerta ya resuelta (otro dispositivo) → muestra como resuelta con nota
```

---

### Flow 5 — Revisión rápida del estado (task flow diario)

```
Abre la app
    → Dashboard [11]
        → Ve indicadores de color de cada silo

        ¿Algún silo en amarillo o rojo?
        ├── No → todo verde → cierra la app ✓
        └── Sí → tap en silo afectado → Detalle del silo [12]
                    → Revisa score y valores actuales
                    
                    ¿Valores en tendencia de mejora?
                    ├── Sí → tap "Ver historial" → Historial [13]
                    │       → Confirma tendencia positiva → vuelve → cierra la app ✓
                    └── No → revisa si hay alerta activa
                            ├── Hay alerta → tap en alerta → Lista de alertas [14]
                            │       → Detalle de alerta [15] → Flow 4
                            └── No hay alerta pero valores preocupantes
                                    → tap "Ver historial" → Historial [13]
                                    → Monitorea manualmente → cierra la app

        ── Bifurcaciones de estado ──
        ├── Sin conexión → banner offline, datos cacheados
        │   → Pull-to-refresh → intenta reconectar
        ├── Lanza sin respuesta (en un silo) → banner en Detalle [12]
        │   → Sigue pasos de diagnóstico [28]
        │   → Si no resuelve → Contactar soporte [25]
        └── Dashboard vacío (sin silos) → empty state → tap "Vincular lanza" → Agregar silo [17]
```

---

### Flow 6 — Agregar un nuevo silo

```
Dashboard [11]
    → Tap botón "+"
    → Agregar silo [17]
        → Paso 1: Escaneo QR + WiFi [mismo flujo que pantalla 8]
            ├── QR escaneado ✓ → configuración WiFi
            │   ├── WiFi conectada ✓ → Paso 2
            │   ├── WiFi falla → "Reintentar" o pasos de diagnóstico
            │   └── Red no encontrada → ingreso manual de SSID
            ├── QR inválido → mensaje error → reintenta
            ├── Cámara sin permiso → instrucciones para habilitar
            └── Tap "← Volver" → Dashboard [11] (cancela flujo)
        → Paso 2: Asignación de nombre [mismo flujo que pantalla 9]
            → Ingresa nombre + datos opcionales
            → Tap "Guardar y continuar"
                ├── Éxito → Dashboard [11] ← silo nuevo aparece en la lista
                └── Error → toast de error → reintenta
```

---

### Flow 7 — Configurar umbrales de alerta

```
    ── Acceso desde Detalle del silo ──
    Detalle del silo [12] → menú "⋯" → "Configurar umbrales"
        → Configuración de umbrales [21] (con silo preseleccionado)

    ── Acceso desde Perfil ──
    Mi perfil [19] → "Configuración de umbrales"
        → Configuración de umbrales [21] (sin silo preseleccionado → debe elegir)

    En la pantalla [21]:
        → Selecciona silo (si no está preseleccionado)
        → Ajusta sliders de CO₂, temperatura, humedad
            ├── Valor dentro de rango recomendado → sin advertencia
            └── Valor fuera de rango → warning "Este valor está por encima/debajo de lo recomendado"
        → Tap "Guardar"
            ├── Éxito → toast "Umbrales actualizados para [silo]" → vuelve a pantalla anterior
            └── Error → toast de error → reintenta
        → O tap "Restaurar valores recomendados" → resetea sliders → debe guardar

    ── Bifurcación ──
    └── Sin conexión → puede ajustar localmente pero no guardar en servidor
        → Los cambios se encolan y envían al reconectar
```

---

### Flow 8 — Pasaporte de Calidad

```
Dashboard [11]
    → Tap "Calidad" en tab bar
    → Lista de lotes [23]
        ├── Con lotes → lista visible
        │   → Tap en lote → Detalle del lote / Pasaporte [24]
        │       → Revisa score histórico, evolución, días monitoreados
        │       → Tap "Compartir pasaporte"
        │           → Share sheet del OS (link / imagen / PDF)
        │               ├── Compartido ✓
        │               └── Cancelado → vuelve a Detalle [24]
        │       → Tap en QR → amplía para escaneo fácil
        │       → Tap "← Volver" → Lista de lotes [23]
        ├── Sin lotes → empty state con explicación
        └── Sin conexión → datos cacheados, QR puede no verificarse (aviso)
```

---

### Flow 9 — Resumen semanal

```
    ── Acceso desde notificación push ──
    Recibe notificación push (lunes 8:00 AM)
        → Toca la notificación
        → Resumen semanal [26] (deep link)

    ── Acceso desde Dashboard ──
    Dashboard [11]
        → Tap en banner "Resumen de la semana"
        → Resumen semanal [26]

    En la pantalla [26]:
        → Revisa estado general (todos OK / hubo alertas)
        → Scroll por resumen de cada silo
            → Tap en silo → Detalle del silo [12]
        → Revisa pronóstico de la próxima semana
        → Tap "← Volver" / "✕ Cerrar" → Dashboard [11]

    ── Bifurcación ──
    └── Sin datos suficientes → mensaje "No hay suficientes datos para esta semana"
```

---

### Flow 10 — Gestión de silo existente (editar / eliminar)

```
Detalle del silo [12]
    → Tap menú "⋯"
    → "Editar silo"
        → Editar / Eliminar silo [18]
            ├── Edita nombre / tipo / tonelaje / grano
            │   → Tap "Guardar cambios"
            │       ├── Éxito → toast "Cambios guardados" → Detalle del silo [12]
            │       └── Error → toast de error → reintenta
            ├── Tap "Eliminar silo"
            │   → Modal de confirmación: "Se eliminará todo el historial..."
            │       ├── Tap "Eliminar" → elimina
            │       │   ├── Éxito → toast "Silo eliminado" → Dashboard [11]
            │       │   └── Error → toast de error
            │       └── Tap "Cancelar" → cierra modal
            └── Tap "← Volver" → Detalle del silo [12] (descarta cambios)
```

---

### Flow 11 — Modo offline y reconexión

```
    ── Pérdida de conexión del celular ──
    Cualquier pantalla activa
        → Aparece banner superior [27]: "Sin conexión a internet — Último dato: [hora]"
        → Datos en pantalla pasan a estilo opacado
        → Acciones de escritura → botones disabled con tooltip "Requiere conexión"
        → Pull-to-refresh → intenta reconectar
            ├── Reconexión exitosa → banner desaparece → toast "Conexión restablecida"
            │   → Acciones encoladas se envían automáticamente
            │   → Datos se actualizan
            └── Sin reconexión → sigue mostrando datos cacheados

    ── Lanza sin respuesta ──
    Detalle del silo [12]
        → Banner [28]: "La lanza no responde — Última señal: [hora]"
        → Tap "¿Qué puedo hacer?" → expande pasos de diagnóstico
            → Paso 1: verificar lanza encendida
            → Paso 2: verificar router WiFi
            → Paso 3: verificar lanza clavada
            → Paso 4: contactar soporte
        → Tap "Contactar soporte" → Contacto con técnico [25]
        → Si la lanza reconecta → banner desaparece → toast "Lanza reconectada"
```

---

## Mapa de navegación principal

```
Tab bar inferior (visible en todas las pantallas core):

┌─────────────┬──────────────┬──────────────┬──────────────┐
│  Dashboard  │   Alertas    │   Calidad    │    Perfil    │
│    [11]     │    [14]      │    [23]      │    [19]      │
└─────────────┴──────────────┴──────────────┴──────────────┘

Dashboard [11]
  ├── Detalle del silo [12]
  │     ├── Historial de sensores [13]
  │     ├── Editar / Eliminar silo [18]
  │     └── Configuración de umbrales [21]
  ├── Agregar silo [17]
  └── Resumen semanal [26]

Alertas [14]
  └── Detalle de alerta [15]
        ├── Confirmación de resolución [16]
        ├── Contacto con técnico [25]
        └── Historial de sensores [13]

Calidad [23]
  └── Detalle del lote / Pasaporte [24]

Perfil [19]
  ├── Editar perfil [20]
  ├── Configuración de umbrales [21]
  ├── Configuración general / Notificaciones [22]
  └── Tutorial walkthrough [10]
```

---

*Documento generado para el equipo de desarrollo de SiloGuard.*
*28 pantallas · 11 flows · Actualizado: Junio 2026*
