SiloGuard Toggle — switch control for settings and notifications. Green on, dark surface off.

```jsx
<Toggle checked={notifs} onChange={setNotifs} label="Alertas por push" />
<Toggle checked size="sm" label="Modo silencioso" labelPosition="left" />
<Toggle checked disabled label="Monitoreo activo" />
```

Controlled: always pass `checked` + `onChange(bool)`. Props: `size` (sm 36×20 · md 48×28), `label`, `labelPosition` (right·left), `disabled`. Thumb slides with CSS transition; track animates from dark to green.
