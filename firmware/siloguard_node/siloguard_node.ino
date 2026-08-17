// SiloGuard — nodo sensor ESP32
// Lee CO2 (MH-Z19C), temperatura (DS18B20) y humedad+temp ambiente (DHT22),
// y postea una lectura a POST /api/silos/{SILO_ID}/lecturas cada READING_INTERVAL_MS.

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

// ---------------------------------------------------------------------------
// CONFIGURACION — completar antes de flashear
// ---------------------------------------------------------------------------
const char* WIFI_SSID = "TU_RED_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD_WIFI";

const char* API_BASE_URL = "https://siloguard-app.onrender.com/api";
const char* API_EMAIL = "TU_EMAIL@ejemplo.com";
const char* API_PASSWORD = "TuPassword123";

// ID del silo ya creado en la app/Swagger (GET /api/silos para ver los tuyos).
const int SILO_ID = 1;

// Cada cuanto postea una lectura. 5 min por defecto — el free tier de Render
// duerme tras inactividad, no hace falta floodearlo para una demo.
const unsigned long READING_INTERVAL_MS = 5UL * 60UL * 1000UL;

// ---------------------------------------------------------------------------
// PINES — ver firmware/README.md para el wiring completo
// ---------------------------------------------------------------------------
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define ONEWIRE_PIN 5          // DS18B20 (requiere pull-up 4.7k-10k a 3.3V)
#define MHZ19_RX_PIN 16        // ESP32 RX2 <- TX del MH-Z19C
#define MHZ19_TX_PIN 17        // ESP32 TX2 -> RX del MH-Z19C

OneWire oneWire(ONEWIRE_PIN);
DallasTemperature ds18b20(&oneWire);
DHT dht(DHT_PIN, DHT_TYPE);
HardwareSerial mhz19Serial(2);

String jwtToken = "";

void setup() {
  Serial.begin(115200);
  ds18b20.begin();
  dht.begin();
  mhz19Serial.begin(9600, SERIAL_8N1, MHZ19_RX_PIN, MHZ19_TX_PIN);

  connectWiFi();
  login();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();
  if (jwtToken.isEmpty()) login();

  float temp = readTemp();
  float hum = readHum();
  int co2 = readCo2();

  if (isnan(temp) || isnan(hum) || co2 < 0) {
    Serial.println("Lectura de sensor invalida, se salta este ciclo.");
  } else {
    postReading(temp, hum, co2);
  }

  delay(READING_INTERVAL_MS);
}

void connectWiFi() {
  Serial.printf("Conectando a WiFi \"%s\"...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\nWiFi conectado, IP: %s\n", WiFi.localIP().toString().c_str());
}

// El DS18B20 mide adentro del grano (sonda IP67); el DHT22 mide humedad
// ambiente/del aire del silo. Se manda como "Temp" la del DS18B20 por ser la
// mas representativa del grano — ver README para justificar el criterio.
float readTemp() {
  ds18b20.requestTemperatures();
  float t = ds18b20.getTempCByIndex(0);
  return (t == DEVICE_DISCONNECTED_C) ? NAN : t;
}

float readHum() {
  return dht.readHumidity();
}

// Protocolo UART del MH-Z19C: comando de 9 bytes, respuesta de 9 bytes.
// CO2 (ppm) = byte[2] * 256 + byte[3]. Se implementa a mano para no depender
// de una libreria de terceros ademas de las de temperatura/humedad.
int readCo2() {
  const byte cmd[9] = {0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79};
  while (mhz19Serial.available()) mhz19Serial.read(); // limpia el buffer

  mhz19Serial.write(cmd, 9);

  byte response[9];
  unsigned long start = millis();
  int idx = 0;
  while (idx < 9 && millis() - start < 1000) {
    if (mhz19Serial.available()) response[idx++] = mhz19Serial.read();
  }

  if (idx < 9 || response[0] != 0xFF || response[1] != 0x86) return -1;
  return response[2] * 256 + response[3];
}

void login() {
  HTTPClient http;
  http.begin(String(API_BASE_URL) + "/auth/login");
  http.addHeader("Content-Type", "application/json");

  JsonDocument body;
  body["email"] = API_EMAIL;
  body["password"] = API_PASSWORD;
  String payload;
  serializeJson(body, payload);

  int status = http.POST(payload);
  if (status == 200) {
    JsonDocument res;
    deserializeJson(res, http.getString());
    jwtToken = res["token"].as<String>();
    Serial.println("Login OK.");
  } else {
    Serial.printf("Login fallo (HTTP %d): %s\n", status, http.getString().c_str());
    jwtToken = "";
  }
  http.end();
}

void postReading(float temp, float hum, int co2) {
  HTTPClient http;
  http.begin(String(API_BASE_URL) + "/silos/" + String(SILO_ID) + "/lecturas");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + jwtToken);

  JsonDocument body;
  body["temp"] = temp;
  body["hum"] = hum;
  body["co2"] = co2;
  String payload;
  serializeJson(body, payload);

  int status = http.POST(payload);
  Serial.printf("POST lectura: temp=%.1f hum=%.1f co2=%d -> HTTP %d\n", temp, hum, co2, status);

  // Token vencido: reintenta una vez con login nuevo.
  if (status == 401) {
    login();
    if (!jwtToken.isEmpty()) {
      http.end();
      http.begin(String(API_BASE_URL) + "/silos/" + String(SILO_ID) + "/lecturas");
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Authorization", "Bearer " + jwtToken);
      status = http.POST(payload);
      Serial.printf("Reintento -> HTTP %d\n", status);
    }
  } else if (status != 200 && status != 201) {
    Serial.println(http.getString());
  }

  http.end();
}
