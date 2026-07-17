Sensor reading tile for the three grain-health variables (CO₂, temperatura, humedad) — used on the silo detail screen, usually three across.

```jsx
<SensorStat kind="co2" value="612" tone="warn" trend="+12% en 6 h" />
<SensorStat kind="temp" value="24.8" tone="ok" />
<SensorStat kind="humidity" value="13.5" tone="ok" />
```

Props: `kind` (co2·temp·humidity — sets icon/label/unit), `value`, `label`/`unit` overrides, `tone` (ok·warn·critical), `trend`.
