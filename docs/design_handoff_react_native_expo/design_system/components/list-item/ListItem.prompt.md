LIST ITEM — Default / Selected / Resolved. The Dashboard silo row (and any tappable list row): leading health dot, title + subtitle, trailing score.

```jsx
<ListItem title="Silo Norte" subtitle="Soja · 380 tn · hace 5 min" tone="ok" value={92} valueUnit="/100" onClick={open} />
<ListItem state="selected" title="Silo Sur" subtitle="Maíz · 210 tn" tone="warn" value={67} valueUnit="/100" onClick={open} />
<ListItem state="resolved" title="Silo Oeste" subtitle="Temporada cerrada" value="—" />
```

Props: `state` (default·selected·resolved), `tone` (dot colour), `title`, `subtitle`, `value`/`valueUnit` or `trailing`, `leading`, `showChevron`, `onClick`.
