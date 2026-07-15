SiloGuard Checkbox — square selection control. Green fill + white check when checked; hairline outline when unchecked.

```jsx
<Checkbox checked={agreed} onChange={setAgreed} label={<>Acepto los <a href="#" style={{ color: 'var(--text-link)' }}>Términos y condiciones</a></>} />
<Checkbox checked disabled label="Recibir novedades" />
```

Controlled: always pass `checked` + `onChange(bool)`. `label` accepts a plain string or JSX (so it can embed a link, as in the T&C pattern on the Registro screen). Props: `disabled`, `id`, `style` + native input attrs.
