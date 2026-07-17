SiloGuard EmptyState — centred fallback panel for empty lists, offline states, server errors, and "all clear" confirmations.

```jsx
<EmptyState variant="offline" action={<Button size="sm" onClick={retry}>Reintentar</Button>} />
<EmptyState variant="no-alerts" title="Sin alertas activas" />
<EmptyState variant="error" body="Revisá tu conexión al servidor." />
```

Variants: `empty` · `offline` · `error` · `no-alerts`. Each has a built-in icon, title, and body — all overrideable. `action` accepts any node (typically a `<Button size="sm">`). `size` (sm · md · lg) scales the icon container.
