SiloGuard Tabs — navigation bar with a sliding indicator. `underline` for primary section rows; `pill` for secondary filter/segmented rows.

```jsx
// Primary navigation
<Tabs
  items={[
    { id: 'activas',   label: 'Activas',   count: 4 },
    { id: 'resueltas', label: 'Resueltas', count: 12 },
    { id: 'historial', label: 'Historial' },
  ]}
  activeId={tab}
  onChange={setTab}
/>

// Filter row
<Tabs
  items={[{id:'todos',label:'Todos'},{id:'critico',label:'Crítico'},{id:'ok',label:'OK'}]}
  activeId={filter}
  onChange={setFilter}
  variant="pill"
/>
```

`items`: `{ id, label, icon?, count? }[]`. Props: `variant` (underline · pill), `fullWidth`. Indicator slides with CSS transform; scrollable on overflow.
