# Firmware — nodo sensor ESP32

Lee CO₂, temperatura y humedad, y postea cada lectura a la API real de SiloGuard
(`POST /api/silos/{id}/lecturas`, agregado en el backend específicamente para esto —
ver `docs/HARDWARE.md`). Código en [`siloguard_node/siloguard_node.ino`](siloguard_node/siloguard_node.ino).

## 1. Instalar Arduino IDE + soporte ESP32

1. [Arduino IDE](https://www.arduino.cc/en/software) (2.x).
2. `Archivo → Preferencias → URLs adicionales de gestor de placas`, agregar:
   `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
3. `Herramientas → Placa → Gestor de placas`, buscar "esp32" (Espressif Systems) e instalar.
4. `Herramientas → Placa`, elegir **"ESP32 Dev Module"** (el NodeMCU ESP-32S del kit HEMMEL
   funciona con esta placa genérica).

## 2. Instalar librerías

`Herramientas → Gestionar bibliotecas`, instalar:

- **ArduinoJson** (Benoit Blanchon)
- **DHT sensor library** (Adafruit) — instala también su dependencia `Adafruit Unified Sensor`
- **OneWire** (Paul Stoffregen)
- **DallasTemperature** (Miles Burton)

`WiFi.h` y `HTTPClient.h` ya vienen con el soporte de placas ESP32, no hace falta instalarlas.

## 3. Configurar el sketch

Abrir `siloguard_node/siloguard_node.ino` y completar arriba de todo:

```cpp
const char* WIFI_SSID = "...";
const char* WIFI_PASSWORD = "...";
const char* API_EMAIL = "...";      // tu usuario de SiloGuard (o el demo: dev@siloguard.com)
const char* API_PASSWORD = "...";
const int SILO_ID = 1;              // el silo real donde van a ir las lecturas
```

Para encontrar el `SILO_ID`: `GET /api/silos` en Swagger (`https://siloguard-app.onrender.com/swagger`)
con tu token, o mirar la URL del detalle del silo en la app.

## 4. Wiring (todavía no armado — guía para cuando lo conectes)

El ESP32 trabaja a **3.3V lógicos**. Los tres sensores del listado (`docs/HARDWARE.md`) se
alimentan a 5V pero sus líneas de datos son compatibles con 3.3V, excepto el TX del MH-Z19C
que conviene bajar con un divisor resistivo (ver nota abajo).

| Sensor | Pin del sensor | Va a pin del ESP32 | Notas |
|---|---|---|---|
| **DHT22** | VCC | 3.3V o 5V | |
| | GND | GND | |
| | DATA | **GPIO 4** | Pull-up ~10kΩ entre DATA y VCC si el módulo no lo trae integrado |
| **DS18B20** | VCC (rojo) | 3.3V | |
| | GND (negro) | GND | |
| | DATA (amarillo) | **GPIO 5** | Pull-up 4.7kΩ entre DATA y VCC — el kit trae 10kΩ, sirve igual para esta distancia de cable |
| **MH-Z19C** | Vin | **5V** (no 3.3V — el sensor lo necesita para el NDIR) | Usar el pin `VIN`/`5V` del ESP32, no `3V3` |
| | GND | GND | |
| | TX | **GPIO 16** (RX2) | Ver nota de divisor resistivo abajo |
| | RX | **GPIO 17** (TX2) | El ESP32 en 3.3V es suficiente para que el MH-Z19C lo lea como "1" |

**Nota sobre el TX del MH-Z19C → GPIO16:** el sensor manda a nivel 5V y el pin del ESP32
tolera hasta 3.3V. Con el pack de resistencias del kit HEMMEL (220Ω/10K/1K), armar un divisor
simple: resistencia de 1K en serie desde el TX del sensor hasta GPIO16, y otra de 2K
(dos de 1K en serie) desde GPIO16 a GND. En la práctica muchos proyectos con el MH-Z19 conectan
TX directo sin divisor y funciona, pero el divisor es la forma correcta de no arriesgar el pin.

Todos los `GND` (ESP32 + los 3 sensores) tienen que estar unidos en la misma protoboard.

## 5. Flashear y verificar

1. Conectar el ESP32 por USB-C, elegir el puerto correcto en `Herramientas → Puerto`.
2. Subir el sketch (`→` en la barra de Arduino IDE).
3. Abrir el **Monitor Serie** a 115200 baudios — debería mostrar la conexión WiFi, el login, y
   cada POST con su código HTTP (`201` = OK).
4. Confirmar en la app (o en Swagger `GET /api/silos/{id}/lecturas`) que la lectura llegó.

## Decisiones de diseño

- **Intervalo de 5 minutos** entre lecturas (`READING_INTERVAL_MS`): el free tier de Render
  duerme tras inactividad — no tiene sentido floodearlo, y para una demo/TP no hace falta más
  frecuencia. Ajustable en el sketch.
- **DS18B20 como `temp` de la lectura, DHT22 solo como `hum`**: el DS18B20 es una sonda IP67
  pensada para meterse dentro del grano, mucho más representativa de la temperatura real del
  silo que un sensor ambiente. El DHT22 igual mide temperatura pero se descarta a favor del
  DS18B20 para el campo `temp` que espera la API.
- **Protocolo del MH-Z19C implementado a mano** (sin librería de terceros extra): el comando
  UART de 9 bytes es simple y evita sumar una dependencia más al proyecto.
