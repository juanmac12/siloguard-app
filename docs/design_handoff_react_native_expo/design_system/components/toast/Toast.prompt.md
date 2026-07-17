SiloGuard Toast — transient notification tiles. Wrap root with `ToastProvider`; call `useToast().addToast({…})` from anywhere.

```jsx
// Root
<ToastProvider><App /></ToastProvider>

// Anywhere inside
const { addToast } = useToast();
addToast({ tone: 'critical', title: 'Temperatura crítica', message: 'Silo Norte · 42°C', duration: 6000 });
addToast({ tone: 'ok',       title: 'Guardado',            message: 'Configuración actualizada.' });
```

Tones: `ok` · `warn` · `critical` · `info`. `duration` defaults to 4 s (0 = persistent). Click anywhere on the tile to dismiss. Max 3 visible (FIFO eviction).

`Toast` is also exported standalone for design specs and static embeds — no provider needed.
