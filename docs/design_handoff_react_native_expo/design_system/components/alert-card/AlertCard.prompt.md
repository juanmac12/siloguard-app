CARD ALERT ITEM — Crítica / Aviso / Resuelta. The alert row for the Lista de alertas and the deep-linked notification; severity drives the accent, icon badge and pill.

```jsx
<AlertCard
  variant="critical"
  title="Fermentación detectada"
  silo="Silo Norte · zona inferior"
  time="hace 12 min"
  description="El CO₂ subió 38% en 6 horas. Indica actividad de fermentación en la base del silo."
  estimate="~36 h antes de pérdida"
  action="Encender aireación"
  onClick={() => openAlert(id)}
/>
<AlertCard variant="resolved" title="Calentamiento controlado" silo="Silo Sur" time="ayer"
  resolutionNote="Aireación encendida 4 h · valores normalizados" />
```

Props: `variant` (critical·warning·resolved), `title`, `silo`, `time`, `description`, `estimate`, `action`, `resolutionNote`, `onClick`.
