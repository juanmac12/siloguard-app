NAVBAR — the app's bottom tab bar (Dashboard / Alertas / Pasaporte / Perfil). Active tab is green; tabs accept a count badge.

```jsx
<NavBar active="alertas" onChange={setTab}
  tabs={[
    { id:'dashboard', label:'Dashboard', icon:'home' },
    { id:'alertas',   label:'Alertas',   icon:'bell', badge:2 },
    { id:'pasaporte', label:'Pasaporte', icon:'clipboard' },
    { id:'perfil',    label:'Perfil',    icon:'user' },
  ]} />
```

Props: `active`, `tabs` (defaults to the four standard tabs), `onChange`. Pin it to the bottom of a phone frame (`position:absolute; left/right/bottom:0`).
