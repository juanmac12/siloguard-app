SiloGuard labelled form field — stacked label + control with green focus ring and red error state; matches the app's login/registro/configurar-silo forms.

```jsx
<Input label="Email" placeholder="tu@email.com" type="email" />
<Input label="Contraseña" placeholder="••••••••" type="password" error="Mínimo 8 caracteres" />
<Input label="Tipo de grano" as="select" placeholder="Elegí un grano" options={['Soja','Maíz','Trigo','Girasol']} />
```

Props: `label`, `placeholder`, `hint`, `error`, `as` (input·select), `options`, `leadingIcon`, `trailingIcon`, `disabled` + native input attrs. Focus = green border + tint ring; error = red border + message.

Password visibility toggle pattern:
```jsx
<Input label="Contraseña" type={show ? 'text' : 'password'} trailingIcon={
  <button type="button" onClick={() => setShow(s => !s)} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', cursor: 'pointer', color: 'inherit' }}>
    <Icon name={show ? 'eye-off' : 'eye'} size={18} />
  </button>
} />
```
