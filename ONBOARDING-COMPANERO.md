# SiloGuard — Guía para sumarte al proyecto

Este documento es para que entiendas rápido en qué está el proyecto y cómo correrlo en tu compu. No hace falta que leas todo el código de una — con esto y los README del proyecto deberías poder orientarte.

---

## Qué es SiloGuard

App de monitoreo de silos de granos (CO₂, temperatura, humedad) para el TP Integrador de Programación III. Tiene dos partes que se conectan entre sí:

- **App móvil** (Expo / React Native) — lo que corre en el celular.
- **API backend** (.NET 10 + PostgreSQL) — donde vive la base de datos y toda la lógica.

---

## Estructura del repo

```
SiloGuard/
├── src/            → la app móvil (Expo Router). Todo el código de pantallas vive acá.
├── backend/        → la API .NET (3 capas: Api / Business / Data)
├── CLAUDE.md       → notas técnicas del proyecto (arquitectura, design system, estado del backend)
└── BACKLOG.md      → pendientes conocidos
```

Adentro de `backend/` hay otro `README.md` con el detalle completo: cómo instalar, todos los endpoints de la API, y una tabla de verificación contra la rúbrica del TPI.

---

## Cómo levantar todo en tu compu

### 1. Backend (API + base de datos)

Necesitás **Docker** y el **SDK de .NET 10** instalados.

```bash
cd SiloGuard/backend
cp .env.example .env
docker compose up -d db

# instalar la herramienta de migraciones (solo la primera vez)
dotnet tool install --global dotnet-ef
export PATH="$PATH:$HOME/.dotnet/tools"

dotnet ef database update --project src/SiloGuard.Data --startup-project src/SiloGuard.Api

ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SiloGuard.Api --urls "http://0.0.0.0:5210"
```

La primera vez que corre, crea automáticamente datos de prueba: 2 usuarios, 6 silos, ~1000 lecturas de sensores y 5 alertas.

**Usuario de prueba:** `dev@siloguard.com` / `Demo1234`

Para ver todos los endpoints y probarlos sin escribir código: `http://localhost:5210/swagger`

### 2. App móvil

Necesitás **Node.js** y la app **Expo Go** instalada en tu celular.

```bash
cd SiloGuard
npm install
npx expo start --go -c
```

Escaneá el QR con Expo Go. **Importante:** la app apunta a la IP de red local de la compu que corre el backend (`src/config/api.ts`, constante `API_BASE_URL`). Si vos corrés el backend en tu propia compu, tenés que cambiar esa IP por la tuya (`hostname -I` en Linux/Mac te la muestra) — y tu celular tiene que estar en la misma red WiFi que tu compu.

---

## Cómo entrar a la base de datos

```bash
docker exec -it siloguard-db psql -U siloguard -d siloguard
```

Comandos útiles adentro: `\dt` (listar tablas), `\d "Silos"` (ver columnas), `SELECT * FROM "Users";`.

O con una herramienta gráfica (DBeaver, TablePlus, pgAdmin): host `localhost`, puerto `5432`, base `siloguard`, usuario `siloguard`, password en `backend/.env`.

---

## En qué está el proyecto ahora mismo

Todo lo técnico de la rúbrica está implementado y probado (modelo de datos, API REST en 3 capas, JWT + roles, transacciones con rollback, seguridad OWASP, paginado real, documentación). El detalle punto por punto está en `CHECKLIST-INTEGRADOR-PROG3.md` (en la raíz del repo, un nivel arriba de `SiloGuard/`).

Lo que falta y **es trabajo de equipo, no solo código**:
- Subir esto a GitHub con participación real de los dos.
- Preparar la presentación final (los dos tenemos que poder explicar cómo funciona y por qué se tomó cada decisión).

Mirá `GUIA-COLABORACION-GIT.md` (al lado de este archivo) para la parte de commits.
