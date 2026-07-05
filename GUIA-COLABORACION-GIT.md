# Cómo vamos a subir esto a GitHub entre los dos

La consigna del TPI dice explícitamente: *"Código alojado en GitHub, donde se evaluará la participación individual de cada estudiante en el desarrollo del proyecto"*. Eso significa que **no alcanza con que el código funcione y esté en GitHub** — el profesor va a mirar el historial de commits para ver qué hizo cada uno. Si todos los commits quedan a nombre de una sola persona, la otra persona no tiene cómo demostrar su aporte, aunque haya ayudado a pensar el proyecto.

Por eso vamos a hacer esto bien desde acá.

---

## Estado actual del repo

Ya existen 3 commits locales (todavía **no están en GitHub**, están solo en esta compu):

```
refactor: mover la app de la raíz a src/ (app/, assets/, config, constants)
feat(backend): API .NET 10 + EF Core + PostgreSQL para el TP integrador
feat(frontend): reconectar la app a la API real, reemplazar Firebase Auth
```

Son la base funcional del proyecto: backend completo y la app conectada a la API real en vez de datos simulados.

---

## Paso 1 — Configurá tu identidad de git

Antes de tocar nada, en tu compu:

```bash
git config --global user.name "Tu Nombre Apellido"
git config --global user.email "tu-email@ca.frre.utn.edu.ar"
```

Así cada commit que hagas queda a tu nombre, no al mío.

## Paso 2 — Creamos el repo remoto y subimos la base

Esto lo hacemos juntos (por videollamada o en persona), no por separado:

```bash
# desde la carpeta SiloGuard/
git remote add origin <URL del repo de GitHub>
git push -u origin main
```

## Paso 3 — De acá en adelante, cada uno hace sus propios commits

Flujo normal para cualquiera de los dos:

```bash
git pull                      # traer lo último antes de empezar a tocar algo
# ... hacés tus cambios ...
git add <archivos que cambiaste>
git commit -m "mensaje claro de qué cambiaste y por qué"
git push
```

**Reglas simples para no pisarnos:**
- Avisar por el grupo qué archivo/pantalla vas a tocar antes de empezar, así no editamos lo mismo los dos a la vez.
- Hacer `git pull` siempre antes de empezar a trabajar.
- Commits chicos y frecuentes (no un commit gigante al final) — se ve mejor la participación real y es más fácil resolver conflictos si aparecen.

---

## Qué podés aportar vos (para que tu commit sea trabajo real, no cosmético)

Elegí una o dos de estas — son cosas genuinas que faltan o se pueden mejorar, no relleno:

- **Colección de Postman** de los endpoints del backend (`backend/README.md` tiene la lista completa) — sirve como evidencia extra para la Parte 6.3 de la rúbrica.
- **Preferencias de notificaciones** (`src/app/perfil/notificaciones.tsx`): hoy no persisten, se resetean al cerrar la app. Se podría agregar un endpoint en el backend + conectarlo.
- **Configuración de umbrales por silo**: está mencionado en el diseño pero nunca se implementó (ni pantalla real ni endpoint). Es una feature completa chica, de punta a punta.
- Revisar y pulir alguna pantalla específica (por ejemplo Pasaporte de Calidad, que hoy es un placeholder).
- Escribir o mejorar la documentación (`backend/README.md`, o un README para la carpeta `src/`).
- Preparar el material de la presentación final (slides, guión de la demo) — también es aporte al proyecto y a vos te va a servir para poder explicarlo bien el día de la defensa.

Cualquiera de estas la podés hacer de punta a punta y commitearla vos mismo — es importante que sea código/contenido que realmente escribiste y entendés, porque en la presentación final se evalúa que **todos los integrantes puedan explicar el funcionamiento de la app**, no solo la parte que hizo cada uno.
