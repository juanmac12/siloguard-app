# Hardware — SiloGuard

> Inventario de componentes físicos disponibles para armar el prototipo de sensores que
> alimenta la app (silos/lecturas/alertas). Este documento es el punto de partida de la parte
> de hardware del TP, complementario a `backend/` y `src/` (que ya están terminados y
> verificados — ver `CLAUDE.md`).

## Inventario disponible (2026-08-17)

| Componente | Cantidad | Uso previsto en SiloGuard |
|---|---|---|
| Sensor CO₂ NDIR MH-Z19C (infrarrojo) | 1 | Sensor de CO₂ del silo — mapea a `SensorReadings` tipo CO₂ |
| Sensor de temperatura DS18B20 (2m, IP67, sonda) | 1 | Temperatura — apto para meter dentro del grano (sonda sellada) |
| Módulo DHT22 (humedad relativa + temperatura) | 1 | Humedad — mapea a `SensorReadings` tipo humedad |
| NodeMCU ESP-32S (38 pines, WiFi + Bluetooth) | 1 | Microcontrolador principal — lee sensores y postea a la API vía HTTP/WiFi |
| Batería recargable Li-ion XTAR 18650 3.7V 2600mAh (20A) | 1 | Alimentación portátil del nodo sensor |
| Cargador/protección TP4056 (Micro USB 5V 1A) | 1 (x5 en el pack) | Carga y protección de la 18650 |
| Kit HEMMEL TEK-002 (protoboard, jumpers, LEDs, buzzer, LCD 1602, RTC, relay, servo SG90, RFID, etc.) | 1 kit completo | Componentes auxiliares — ver detalle abajo |

### Detalle del kit HEMMEL TEK-002 (componentes auxiliares)

Protoboard 830 puntos · 65 jumpers protoboard · 10 dupont M-H · 15 LEDs (rojo/verde/amarillo) ·
30 resistencias (220/10K/1K) · potenciómetro 10K · buzzer activo · buzzer pasivo · 74HC595N
(shift register) · receptor + control remoto infrarrojo · LM35DZ (sensor temp. analógico) ·
sensor de llama · 5 switches con tope · display 1 dígito · display 4 dígitos · matrix 8x8 ·
motor paso a paso 5V + driver ULN2003 · LCD 1602 · joystick PS2 · DHT11 (humedad/temp,
alternativo al DHT22) · sensor de nivel de agua · módulo RFID + llavero + tarjeta · módulo de
sonido · relay 1 canal · teclado matricial 16 botones · módulo RGB · conector batería 9V ·
servo SG90 · módulo RTC · sensor de inclinación · 3 fotoresistencias.

Componentes con encaje directo en el proyecto además de los sensores principales: **LCD 1602**
(display local de estado del silo), **buzzer** (alarma sonora local ante umbral crítico,
espejando las alertas de la app), **relay 1 canal** (podría simular actuador, ej. ventilación
del silo), **RTC** (timestamp de lecturas si el nodo no tiene NTP disponible). El resto queda
como excedente del kit, sin uso previsto.

## Mapeo a la API existente

El backend ya expone lo necesario para que el nodo ESP32 postee lecturas reales — no hace
falta tocar el modelo de datos:

- `SensorReadings` (`backend/src/SiloGuard.Data/Entities/`) admite lecturas de CO₂,
  temperatura y humedad por silo.
- Los endpoints de creación de lecturas están documentados en Swagger
  (`https://siloguard-app.onrender.com/swagger`) — revisar `docs/CHECKLIST-DEFENSA.md` sección
  2.1 para la lista completa de endpoints.
- El nodo va a necesitar autenticarse (JWT) o, si se define un flujo de dispositivo aparte,
  eso es una decisión de diseño pendiente (ver sección siguiente).

## Pendiente de definir (antes de cablear)

- [ ] Cómo se autentica el ESP32 contra la API (¿JWT de un usuario técnico fijo? ¿un endpoint
      de ingesta sin auth pensado para dispositivos?).
- [ ] Frecuencia de muestreo y de POST a la API (evitar floodear el free tier de Render).
- [ ] Wiring definitivo: pines del ESP32 para MH-Z19C (UART), DS18B20 (OneWire), DHT22
      (digital) — pendiente de diagramar.
- [ ] Si se arma un caso/gabinete o queda todo en protoboard para la demo.

**Estado del proyecto en general:** la parte de software (`backend/` + `src/`) está terminada,
buildeada, testeada (12/12 tests) y deployada en Render — verificado el 2026-08-17. A partir
de acá el trabajo es exclusivamente de hardware/firmware.
