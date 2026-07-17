SiloGuard button — the solid-green `primary` is the app's signature full-width CTA; `secondary` (outlined), `ghost` (text), and `danger` (red) round out the set.

```jsx
<Button fullWidth onClick={save}>Guardar y continuar</Button>
<Button variant="secondary" leadingIcon={<Icon name="plus-circle" size={18} />}>Agregar silo</Button>
<Button variant="ghost" size="sm">Ahora no</Button>
```

Props: `variant` (primary·secondary·ghost·danger), `size` (sm·md·lg, default lg=48px), `fullWidth`, `disabled`, `leadingIcon`/`trailingIcon`. Hover darkens the fill; press scales to 0.985.
