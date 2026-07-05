# SiloGuard MVP

## 1. El Problema

**Situación concreta:** En Argentina se almacenan cerca de 100 millones de toneladas de granos por año. Los productores del Litoral (Santa Fe, Entre Ríos, Chaco, Corrientes) guardan su cosecha en silos o silobolsas durante meses sin ningún sistema que les informe qué ocurre dentro. La humedad relativa de la región supera el 80% durante los meses de mayor calor (noviembre a marzo), creando condiciones ideales para que hongos e insectos activen procesos de fermentación que degradan el grano desde adentro.

**Fricción identificable:** El deterioro del grano es invisible en sus primeras etapas. Cuando el productor lo detecta de forma manual —abriendo el silo o notando cambios externos— ya perdió entre el 20% y el 40% del lote. No existe hoy una solución accesible para el productor PyME que detecte esa degradación antes de que sea irreversible.

Este desfasaje entre el momento en que el problema empieza y el momento en que el productor lo descubre es la fricción que SiloGuard viene a eliminar.

### Datos que avalan la magnitud del problema

| Indicador | Valor |
|---|---|
| Grano almacenado por año en Argentina | ~100 millones de toneladas |
| Pérdida estimada por deterioro | 5% – 10% del total almacenado |
| Equivalente económico de esa pérdida | USD 2.000 – 4.000 millones anuales |
| Productores PyME en el Litoral sin solución | ~40.000 |
| Meses de mayor riesgo | Noviembre a Marzo |
| Humedad relativa ambiente en el Litoral (verano) | > 80% sostenida |
| Tiempo desde inicio de fermentación hasta pérdida irreversible | 48 – 72 horas |

---

## 2. El Usuario

**Nombre y edad:** Carlos, 48 años.

**Contexto:** Productor agropecuario PyME en Rafaela, Santa Fe. Trabaja 550 hectáreas de campo propio y arrendado. Almacena entre 200 y 400 toneladas de soja en un silo metálico propio entre noviembre y marzo, con el objetivo de vender cuando el precio de mercado sea más favorable. También guarda entre 80 y 120 toneladas de maíz en silobolsa. No tiene empleados técnicos permanentes ni equipamiento especializado de monitoreo. Contrata servicios de maquinaria para la cosecha y trabaja con un ingeniero agrónomo externo que lo visita una vez cada dos semanas durante la campaña.

**Rutina:** Revisa el campo una o dos veces por semana. Consulta el pronóstico del tiempo en el celular todos los días. Usa WhatsApp como herramienta principal de comunicación. Maneja aplicaciones móviles simples pero no tiene formación técnica en informática.

**Frustraciones actuales:**

- No tiene forma de saber qué pasa dentro del silo sin inspeccionarlo físicamente, y hacerlo implica tiempo y esfuerzo.
- Cuando detecta olor o cambio de color en el grano, ya es tarde para actuar.
- En la temporada 2024–2025 perdió alrededor de 15 toneladas de soja que descubrió fermentadas al momento de preparar el lote para la venta. Eso representó aproximadamente USD 5.200 de pérdida directa.
- Desconfía de soluciones tecnológicas que requieran instalar antenas, contratar técnicos especializados o depender de soporte técnico remoto.
- Ha visto publicidades de sistemas de monitoreo pero los percibe como caros, complicados o pensados para productores más grandes.

---

## 3. La Solución

**SiloGuard** permite a productores agropecuarios PyME del Litoral recibir una alerta en el celular al menos 48 horas antes de que el grano empiece a deteriorarse, sin tener que abrir el silo ni depender de inspecciones que llegan siempre demasiado tarde.

---

## 4. ¿Por qué es mínimo?

El MVP tiene que responder una sola pregunta: **¿el productor actúa sobre una alerta temprana con suficiente anticipación para salvar el grano?** Todo lo que no sirva para probar esa hipótesis queda fuera del MVP.

### Funcionalidades incluidas en el MVP

| # | Funcionalidad | Justificación |
|---|---|---|
| 1 | **Pantalla principal — Estado del Silo:** muestra el score general del silo (1–100), los valores actuales de CO₂, temperatura y humedad, y un indicador visual de estado (verde / amarillo / rojo). | Es la pantalla que el productor abre todos los días. Construye el hábito de consulta y genera confianza progresiva en el sistema antes de que llegue la primera alerta real. |
| 2 | **Pantalla de Alerta — Detalle y Acción Recomendada:** cuando la IA detecta un patrón de fermentación, el productor recibe una notificación push con descripción en lenguaje simple de qué está pasando, qué zona del silo está en riesgo, cuántas horas estimadas quedan antes de pérdida irreversible y una acción concreta recomendada. | Es el núcleo de la hipótesis. Si el productor no entiende la alerta o no sabe qué hacer con ella, no actúa. |
| 3 | **Pantalla de Historial — Evolución de Sensores:** gráfico de línea que muestra la evolución de CO₂, temperatura y humedad durante las últimas 48–72 horas. El productor puede ver si los valores están subiendo, estables o bajando después de haber tomado una acción. | Si el productor encendió la aireación, necesita ver que los valores mejoran para confirmar que su acción funcionó. Sin esta pantalla, actúa a ciegas y no desarrolla confianza en el sistema. |

### Funcionalidades fuera del MVP (por ahora)

- **Pantalla de Onboarding y vinculación del dispositivo:** flujo de registro del productor y configuración de la lanza IoT desde la app (escaneo QR, conexión WiFi, nombre del silo).
- **Pantalla de gestión multi-silo:** vista con listado de todos los silos del establecimiento, cada uno con su estado resumido, para productores con más de un punto de almacenamiento.
- **Pantalla de configuración de alertas:** permite al productor personalizar los umbrales que disparan una alerta (por ejemplo, subir el límite de CO₂ o silenciar notificaciones nocturnas).
- **Pantalla de Pasaporte de Calidad:** vista del certificado digital del lote con score histórico, días monitoreados y código QR verificable para compartir con bancos o compradores.
- **Pantalla de historial de alertas de la temporada:** listado cronológico de todas las alertas recibidas durante la campaña, con estado de resolución y grano estimado salvado en cada episodio.
- **Resumen semanal automático por notificación push:** notificación programada cada lunes con un resumen del estado del silo durante la semana anterior (promedio de valores, tendencia, grano en buen estado).
- **Pantalla de pronóstico integrado:** vista que combina los datos del silo con el pronóstico meteorológico de los próximos 3 días para anticipar si las condiciones externas van a aumentar el riesgo interno.
- **Contacto directo con técnico desde la app:** botón o chat dentro de la pantalla de alerta que conecta al productor con un agrónomo o técnico de SiloGuard en tiempo real.

---

## 5. ¿Cómo sabés que funciona?

**Métrica de éxito:** El 70% de los productores piloto que reciben una alerta de fermentación potencial ejecutan al menos una acción de intervención —encender la aireación, contactar un técnico o realizar una inspección física— dentro de las 12 horas posteriores a la notificación, sin que nadie del equipo los instruya para hacerlo.

**Por qué esta métrica:** Esta métrica es un comportamiento observable y registrable, no una opinión. No mide si al productor "le gustó" el sistema ni si lo recomendaría. Mide si cambió su conducta porque confió en la información que recibió. Esa confianza traducida en acción es el único resultado que tiene valor económico real.
