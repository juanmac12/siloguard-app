Status pill + dot encoding grain-health / alert state — the colour language (verde OK · amarillo advertencia · rojo crítica · gris resuelta) that runs through the whole app.

```jsx
<StatusBadge tone="critical" />            {/* → "CRÍTICA" with red dot */}
<StatusBadge tone="ok">Saludable</StatusBadge>
<StatusDot tone="warn" glow />             {/* the silo-row health dot */}
```

`StatusBadge` props: `tone` (ok·warn·critical·resolved·info), `children` (label override), `dot`. `StatusDot` props: `tone`, `size`, `glow`.
