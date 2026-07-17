SiloGuard Modal + BottomSheet. `Modal` centres on screen; `BottomSheet` slides up from the bottom (mobile-first). Both animate in/out; ESC and backdrop close by default.

```jsx
// Confirmation dialog
<Modal
  open={open} onClose={() => setOpen(false)}
  title="Eliminar silo"
  actions={[
    <Button key="cancel" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>,
    <Button key="confirm" variant="danger" size="sm">Sí, eliminar</Button>,
  ]}
>
  <p>¿Estás seguro? Esta acción no se puede deshacer.</p>
</Modal>

// Mobile action sheet
<BottomSheet open={open} onClose={() => setOpen(false)} title="Acciones del silo"
  actions={[
    <Button key="archive" variant="secondary" fullWidth>Archivar</Button>,
    <Button key="delete"  variant="danger"    fullWidth>Eliminar</Button>,
    <Button key="cancel"  variant="ghost"     fullWidth onClick={() => setOpen(false)}>Cancelar</Button>,
  ]}
>
  Seleccioná una acción para Silo Norte.
</BottomSheet>
```

Props: `open`, `onClose`, `title`, `children`, `actions[]`, `preventClose`. `Modal` also takes `size` (sm · md · lg).
