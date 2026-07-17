/* SiloGuard — Pantalla 21: Configuración de umbrales de alerta
   Exports: UmbralesScreen */

const _UDS = window.SiloGuardDesignSystem_633342;
const { Button: UBtn, Icon: UIco, BottomSheet: USheet } = _UDS;

/* ══════════════════════════════════════════════════════════════
   Recommended thresholds by grain type
   ══════════════════════════════════════════════════════════════ */
const RECOM = {
  Soja:    { co2:{w:500,  c:800}, temp:{w:25.0, c:30.0}, hum:{w:14.0, c:16.0} },
  Maíz:    { co2:{w:500,  c:800}, temp:{w:28.0, c:35.0}, hum:{w:14.5, c:16.0} },
  Trigo:   { co2:{w:450,  c:700}, temp:{w:22.0, c:28.0}, hum:{w:13.0, c:15.0} },
  Girasol: { co2:{w:500,  c:800}, temp:{w:25.0, c:32.0}, hum:{w:10.0, c:12.0} },
  default: { co2:{w:500,  c:800}, temp:{w:25.0, c:35.0}, hum:{w:14.0, c:16.0} },
};

/* ══════════════════════════════════════════════════════════════
   Metric definitions
   ══════════════════════════════════════════════════════════════ */
const METRICS = [
  { key:'co2',  icon:'wind',        label:'CO₂',         unit:'ppm', min:300,  max:5000, step:50,  dec:0 },
  { key:'temp', icon:'thermometer', label:'Temperatura', unit:'°C',  min:15,   max:60,   step:0.5, dec:1 },
  { key:'hum',  icon:'droplet',     label:'Humedad',     unit:'%',   min:10,   max:100,  step:0.5, dec:1 },
];

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */
const _uc   = (v,lo,hi) => Math.max(lo, Math.min(hi, v));
const _us   = (v,s)     => Math.round(v/s)*s;
const _uf   = (v,d)     => d===0 ? String(Math.round(v)) : Number(v).toFixed(d);
const _rcol = (r,w,c)   =>
  r==null ? null : r >= c ? '#EF4444' : r >= w ? '#F59E0B' : '#22C55E';

/* ══════════════════════════════════════════════════════════════
   LocalStorage persistence
   ══════════════════════════════════════════════════════════════ */
const LS_KEY = 'sg_thresholds_v1';

function _initDb(silos) {
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch(_) {}
  const db = {};
  silos.forEach(s => {
    const r = RECOM[s.grain] || RECOM.default;
    db[s.id] = stored[s.id] || {
      co2:  { warn: r.co2.w,  crit: r.co2.c  },
      temp: { warn: r.temp.w, crit: r.temp.c },
      hum:  { warn: r.hum.w,  crit: r.hum.c  },
    };
  });
  return db;
}
function _saveDb(db) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(db)); } catch(_) {}
}

/* ══════════════════════════════════════════════════════════════
   UBackHeader
   ══════════════════════════════════════════════════════════════ */
function UBackHeader({ title, onBack }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:4,padding:'10px 16px 10px 8px',
      background:'var(--surface-app)',borderBottom:'1px solid var(--border-default)',flexShrink:0}}>
      <button onClick={onBack}
        style={{display:'flex',alignItems:'center',justifyContent:'center',
          width:40,height:40,background:'transparent',border:'none',
          borderRadius:'var(--radius-md)',color:'var(--action-primary)',cursor:'pointer',flexShrink:0}}>
        <UIco name="chevron-left" size={24}/>
      </button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-sans)',fontSize:17,fontWeight:600,
          color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          {title}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ThresholdTrack
   Read-only visualization: colored zones + warn/crit tick marks
   with value labels + live reading dot.  No drag handles.
   ══════════════════════════════════════════════════════════════ */
function ThresholdTrack({ min, max, dec, unit, warn, crit, reading }) {
  const toPct = v => ((_uc(v, min, max) - min) / (max - min)) * 100;

  const wp = toPct(warn);
  const cp = toPct(crit);
  const rp = reading != null ? toPct(reading) : null;
  const rc = _rcol(reading, warn, crit);

  /* Push warn/crit labels apart if they are too close (< 16 % gap) */
  const GAP = 16;
  const labelWp = _uc(wp, 2, cp - GAP);
  const labelCp = _uc(cp, wp + GAP, 97);

  /* Clamp reading label so it doesn't overflow track edges */
  const labelRp = rp != null ? _uc(rp, 4, 92) : null;

  const warnTxt = `${_uf(warn, dec)} ${unit}`;
  const critTxt = `${_uf(crit, dec)} ${unit}`;
  const readTxt = reading != null ? `${_uf(reading, dec)} ${unit}` : null;

  /* Shared label style */
  const LS = { fontFamily:'var(--font-sans)', fontWeight:700, fontSize:10,
               whiteSpace:'nowrap', position:'absolute', transform:'translateX(-50%)' };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:0,userSelect:'none'}}>

      {/* ── Row 1: warn + crit labels above track ── */}
      <div style={{position:'relative',height:20}}>
        {/* Warn label */}
        <span style={{...LS, left:`${labelWp}%`, bottom:2, color:'#F59E0B'}}>
          {warnTxt}
        </span>
        {/* Crit label */}
        <span style={{...LS, left:`${labelCp}%`, bottom:2, color:'#EF4444'}}>
          {critTxt}
        </span>
      </div>

      {/* ── Row 2: the track bar ── */}
      <div style={{position:'relative',height:10,borderRadius:5,zIndex:0}}>
        {/* base */}
        <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,.09)',borderRadius:5}}/>

        {/* Zone colors */}
        <div style={{position:'absolute',left:0,width:`${wp}%`,height:'100%',
          background:'#22C55E',opacity:.3,borderRadius:'5px 0 0 5px'}}/>
        <div style={{position:'absolute',left:`${wp}%`,width:`${cp-wp}%`,height:'100%',
          background:'#F59E0B',opacity:.5}}/>
        <div style={{position:'absolute',left:`${cp}%`,right:0,height:'100%',
          background:'#EF4444',opacity:.45,borderRadius:'0 5px 5px 0'}}/>

        {/* Warn tick — protrudes 5px above + below */}
        <div style={{position:'absolute',left:`${wp}%`,top:-5,bottom:-5,width:2.5,
          background:'#F59E0B',transform:'translateX(-50%)',borderRadius:2,zIndex:2}}/>

        {/* Crit tick */}
        <div style={{position:'absolute',left:`${cp}%`,top:-5,bottom:-5,width:2.5,
          background:'#EF4444',transform:'translateX(-50%)',borderRadius:2,zIndex:2}}/>

        {/* Reading dot — slightly larger, glowing */}
        {rp != null && (
          <div style={{
            position:'absolute',left:`${rp}%`,top:'50%',
            transform:'translate(-50%,-50%)',
            width:14,height:14,borderRadius:'50%',
            background:rc,border:'2.5px solid #0A0A0A',
            boxShadow:`0 0 10px ${rc}bb`,zIndex:4,
          }}/>
        )}

        {/* Unit — faint text inside track, right-aligned */}
        <span style={{
          position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',
          fontFamily:'var(--font-sans)',fontSize:8,fontWeight:700,letterSpacing:'.03em',
          color:'rgba(255,255,255,.2)',pointerEvents:'none',
        }}>{unit}</span>
      </div>

      {/* ── Row 3: reading value label below track ── */}
      <div style={{position:'relative',height:20}}>
        {readTxt && (
          <span style={{...LS, left:`${labelRp}%`, top:3,
            color:rc, display:'flex', alignItems:'center', gap:3}}>
            <span style={{fontSize:8,lineHeight:1}}>●</span>
            {readTxt}
          </span>
        )}
      </div>

      {/* ── Legend ── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginTop:2}}>
        {[
          { dot:'#22C55E', col:'rgba(34,197,94,.65)',  label:'Normal'      },
          { dot:'#F59E0B', col:'rgba(245,158,11,.85)', label:'Advertencia' },
          { dot:'#EF4444', col:'rgba(239,68,68,.85)',  label:'Crítica'     },
        ].map(({dot,col,label}) => (
          <div key={label} style={{display:'flex',alignItems:'center',gap:4}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:dot,flexShrink:0}}/>
            <span style={{fontFamily:'var(--font-sans)',fontSize:9,fontWeight:600,
              letterSpacing:'.05em',color:col,whiteSpace:'nowrap'}}>
              {label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ThresholdInput — tap to edit a numeric threshold value
   ══════════════════════════════════════════════════════════════ */
function ThresholdInput({ label, value, unit, color, min, max, step, dec, onChange }) {
  const [editing, setEditing] = React.useState(false);
  const [raw,     setRaw]     = React.useState('');
  const inputRef = React.useRef(null);

  const disp = _uf(value, dec);

  const startEdit = () => {
    setRaw(disp);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const commit = () => {
    const n = parseFloat(raw);
    if (!isNaN(n)) onChange(_uc(_us(n, step), min, max));
    setEditing(false);
  };

  const LBL = { fontFamily:'var(--font-sans)',fontSize:10,fontWeight:600,
    letterSpacing:'.06em',textTransform:'uppercase',color:'var(--text-muted)',
    display:'block',marginBottom:5 };
  const BOX = { width:68,padding:'7px 8px',background:'var(--surface-input)',
    borderRadius:'var(--radius-md)',fontFamily:'var(--font-sans)',
    fontSize:17,fontWeight:700,color,textAlign:'center' };

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column'}}>
      <span style={LBL}>{label}</span>
      <div style={{display:'flex',alignItems:'center',gap:7}}>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={raw}
            onChange={e => setRaw(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if(e.key==='Enter') commit(); if(e.key==='Escape') setEditing(false); }}
            style={{...BOX, border:`1.5px solid ${color}`, outline:'none', appearance:'textfield'}}
          />
        ) : (
          <button onClick={startEdit}
            style={{...BOX, border:'1.5px solid var(--border-default)', cursor:'pointer',
              transition:'border-color .15s'}}>
            {disp}
          </button>
        )}
        <span style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)'}}>{unit}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MetricCard — one card per sensor
   ══════════════════════════════════════════════════════════════ */
function MetricCard({ metric, thresholds, reading, recM, grain, onThresholdChange, onResetMetric }) {
  const { key, icon, label, unit, min, max, step, dec } = metric;
  const { warn, crit } = thresholds;

  /* Reading chip */
  const rc    = _rcol(reading, warn, crit);
  const rcBg  = rc==='#EF4444'?'rgba(239,68,68,.1)' : rc==='#F59E0B'?'rgba(245,158,11,.1)' : 'rgba(34,197,94,.1)';
  const rcBd  = rc==='#EF4444'?'rgba(239,68,68,.28)': rc==='#F59E0B'?'rgba(245,158,11,.28)': 'rgba(34,197,94,.28)';

  /* Out-of-range checks */
  const warnLow  = warn < recM.w * 0.75;
  const critHigh = crit > recM.c * 1.5;

  return (
    <div style={{background:'var(--surface-card)',border:'1px solid var(--border-default)',
      borderRadius:'var(--radius-lg)',padding:16,display:'flex',flexDirection:'column',gap:14}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <UIco name={icon} size={20} color="var(--text-secondary)"/>
        <span style={{flex:1,fontFamily:'var(--font-sans)',fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>
          {label}
        </span>
        {reading != null && (
          <div style={{display:'flex',alignItems:'center',gap:5,flexShrink:0,
            background:rcBg,border:`1px solid ${rcBd}`,borderRadius:20,padding:'3px 10px'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:rc,flexShrink:0}}/>
            <span style={{fontFamily:'var(--font-sans)',fontSize:12,fontWeight:600,color:rc}}>
              {_uf(reading, dec)} {unit}
            </span>
          </div>
        )}
      </div>

      {/* Track — read-only visualization with 3 markers */}
      <ThresholdTrack
        min={min} max={max} dec={dec} unit={unit}
        warn={warn} crit={crit} reading={reading}
      />

      {/* Inputs */}
      <div style={{display:'flex',alignItems:'flex-end',gap:0}}>
        <ThresholdInput
          label="Advertencia" value={warn} unit={unit} color="#F59E0B"
          min={min} max={max} step={step} dec={dec}
          onChange={v => onThresholdChange(key, { warn: _uc(v, min, crit - step), crit })}
        />
        <div style={{width:1,background:'var(--border-default)',alignSelf:'stretch',
          margin:'0 12px 0 10px',flexShrink:0}}/>
        <ThresholdInput
          label="Crítica" value={crit} unit={unit} color="#EF4444"
          min={min} max={max} step={step} dec={dec}
          onChange={v => onThresholdChange(key, { warn, crit: _uc(v, warn + step, max) })}
        />
      </div>

      {/* Inline warnings */}
      {warnLow && (
        <div style={{display:'flex',gap:7,padding:'8px 10px',
          background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.22)',borderRadius:8}}>
          <span style={{flexShrink:0,marginTop:1}}><UIco name="alert-triangle" size={13} color="#F59E0B"/></span>
          <span style={{fontFamily:'var(--font-sans)',fontSize:11,color:'#F59E0B',lineHeight:1.55}}>
            El umbral de advertencia es bajo para {grain}. Pueden generarse alertas prematuras.
          </span>
        </div>
      )}
      {critHigh && (
        <div style={{display:'flex',gap:7,padding:'8px 10px',
          background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.22)',borderRadius:8}}>
          <span style={{flexShrink:0,marginTop:1}}><UIco name="alert-triangle" size={13} color="#F59E0B"/></span>
          <span style={{fontFamily:'var(--font-sans)',fontSize:11,color:'#F59E0B',lineHeight:1.55}}>
            El umbral crítico está muy por encima del recomendado. Puede demorar la detección de problemas.
          </span>
        </div>
      )}

      {/* Per-metric reset */}
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:-6}}>
        <button onClick={() => onResetMetric(key)}
          style={{background:'none',border:'none',display:'flex',alignItems:'center',
            gap:5,cursor:'pointer',padding:'2px 0'}}>
          <UIco name="refresh-cw" size={11} color="var(--text-muted)"/>
          <span style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)'}}>
            Restaurar recomendado
          </span>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   GrainFilterChips — filtro por tipo de grano
   ══════════════════════════════════════════════════════════════ */
function GrainFilterChips({ silos, activeGrain, onChange }) {
  const grains = [...new Set(silos.map(s => s.grain))].sort();

  const chipStyle = (active) => ({
    display:'flex',alignItems:'center',justifyContent:'center',
    padding:'5px 12px',flexShrink:0,
    background: active ? 'rgba(34,197,94,.12)' : 'var(--surface-input)',
    border: `1px solid ${active ? 'rgba(34,197,94,.4)' : 'var(--border-default)'}`,
    borderRadius:20,
    fontFamily:'var(--font-sans)',fontSize:12,fontWeight:active?600:400,
    color: active ? '#22C55E' : 'var(--text-muted)',
    cursor:'pointer',transition:'all .15s',
  });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:7,paddingBottom:12,
      borderBottom:'1px solid var(--border-default)'}}>
      <span style={{fontFamily:'var(--font-sans)',fontSize:10,fontWeight:600,
        letterSpacing:'.06em',textTransform:'uppercase',color:'var(--text-muted)'}}>
        TIPO DE GRANO
      </span>
      <div style={{display:'flex',gap:6,overflowX:'auto',scrollbarWidth:'none',paddingBottom:2}}>
        <button onClick={() => onChange(null)} style={chipStyle(activeGrain===null)}>
          Todos
        </button>
        {grains.map(g => (
          <button key={g} onClick={() => onChange(g)} style={chipStyle(activeGrain===g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   UmbralesScreen — Pantalla 21
   ══════════════════════════════════════════════════════════════ */
function UmbralesScreen({ silos, preselectedSilo, onBack }) {

  /* ── DB ── */
  const [db, setDb] = React.useState(() => _initDb(silos));

  /* ── Grain filter ── */
  const [grainFilter, setGrainFilter] = React.useState(
    preselectedSilo?.grain || null
  );

  const filteredSilos = grainFilter
    ? silos.filter(s => s.grain === grainFilter)
    : silos;

  /* ── Selected silo ── */
  const [selectedId, setSelectedId] = React.useState(
    preselectedSilo?.id || silos[0]?.id || null
  );
  const selectedSilo = silos.find(s => s.id === selectedId) || filteredSilos[0] || silos[0];
  const rec = RECOM[selectedSilo?.grain] || RECOM.default;

  /* ── Pending thresholds ── */
  const [pending, setPending] = React.useState(
    () => JSON.parse(JSON.stringify(db[selectedId] || {}))
  );

  /* Switch grain filter → auto-select first matching silo */
  const onGrainFilter = (grain) => {
    setGrainFilter(grain);
    const first = grain ? silos.find(s => s.grain === grain) : silos[0];
    if (first) {
      setSelectedId(first.id);
      setPending(JSON.parse(JSON.stringify(db[first.id])));
    }
  };

  /* Switch silo → reset pending to saved values */
  const selectSilo = silo => {
    setSelectedId(silo.id);
    setPending(JSON.parse(JSON.stringify(db[silo.id])));
  };

  const updateMetric = (key, vals) => setPending(p => ({ ...p, [key]: vals }));

  const resetMetric = key => {
    const r = rec[key];
    setPending(p => ({ ...p, [key]: { warn: r.w, crit: r.c } }));
  };

  const restoreAll = () => setPending({
    co2:  { warn: rec.co2.w,  crit: rec.co2.c  },
    temp: { warn: rec.temp.w, crit: rec.temp.c },
    hum:  { warn: rec.hum.w,  crit: rec.hum.c  },
  });

  const hasChanges = !!selectedSilo &&
    JSON.stringify(pending) !== JSON.stringify(db[selectedSilo.id]);

  /* ── Save ── */
  const [saving, setSaving] = React.useState(false);
  const [saveOk, setSaveOk] = React.useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      const newDb = { ...db, [selectedSilo.id]: JSON.parse(JSON.stringify(pending)) };
      setDb(newDb);
      _saveDb(newDb);
      setSaving(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2400);
    }, 500);
  };

  /* ── Apply to other silos of same grain ── */
  const [showApply,  setShowApply]  = React.useState(false);
  const [applyTo,    setApplyTo]    = React.useState([]);
  const [applyOk,    setApplyOk]    = React.useState(false);
  const [applyCount, setApplyCount] = React.useState(0);

  const otherSame = silos.filter(s => s.id !== selectedId && s.grain === selectedSilo?.grain);

  const openApply = () => {
    setApplyTo(otherSame.map(s => s.id));
    setShowApply(true);
  };

  const toggleApply = id =>
    setApplyTo(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const doApply = () => {
    const newDb = { ...db };
    applyTo.forEach(id => { newDb[id] = JSON.parse(JSON.stringify(pending)); });
    setDb(newDb);
    _saveDb(newDb);
    const n = applyTo.length;
    setShowApply(false);
    setApplyCount(n);
    setApplyOk(true);
    setTimeout(() => setApplyOk(false), 2600);
  };

  /* ── Guard ── */
  if (!selectedSilo || !pending || !pending.co2) return null;

  const readings = { co2: selectedSilo.co2, temp: selectedSilo.temp, hum: selectedSilo.hum };
  const btnText  = saving ? 'Guardando…' : (saveOk && !hasChanges) ? '✓ Guardado' : 'Guardar';

  /* Silo count info for filter context */
  const filteredCount = filteredSilos.length;

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--surface-app)'}}>

      {/* ── Header ── */}
      <UBackHeader title="Umbrales de alerta" onBack={onBack}/>

      {/* ── Filters + silo selector ── */}
      <div style={{padding:'12px 16px 0',flexShrink:0,display:'flex',flexDirection:'column',gap:10}}>

        {/* Grain filter chips */}
        <GrainFilterChips
          silos={silos}
          activeGrain={grainFilter}
          onChange={onGrainFilter}
        />

        {/* Silo chips (filtered) */}
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontFamily:'var(--font-sans)',fontSize:10,fontWeight:600,
              letterSpacing:'.06em',textTransform:'uppercase',color:'var(--text-muted)'}}>
              SILO
            </span>
            {grainFilter && (
              <span style={{fontFamily:'var(--font-sans)',fontSize:11,color:'var(--text-muted)'}}>
                — {filteredCount} {filteredCount===1?'silo':'silos'} de {grainFilter}
              </span>
            )}
          </div>
          <div style={{display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',
            paddingBottom:4,WebkitOverflowScrolling:'touch'}}>
            {filteredSilos.map(s => {
              const dotCol = s.status==='critical'?'#EF4444':s.status==='warn'?'#F59E0B':'#22C55E';
              const active = s.id === selectedId;
              return (
                <button key={s.id} onClick={() => selectSilo(s)}
                  style={{
                    display:'flex',alignItems:'center',gap:7,flexShrink:0,
                    padding:'7px 13px',
                    background: active?'rgba(34,197,94,.12)':'var(--surface-card)',
                    border:`1px solid ${active?'rgba(34,197,94,.4)':'var(--border-default)'}`,
                    borderRadius:20,cursor:'pointer',transition:'all .15s',
                    fontFamily:'var(--font-sans)',fontSize:13,
                    fontWeight:active?600:400,
                    color:active?'#22C55E':'var(--text-secondary)',
                  }}>
                  <div style={{width:7,height:7,borderRadius:'50%',background:dotCol,flexShrink:0}}/>
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Silo meta + inline save feedback */}
        <div style={{display:'flex',alignItems:'center',gap:6,paddingBottom:10,
          borderBottom:'1px solid var(--border-default)'}}>
          <span style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)'}}>
            {selectedSilo.grain} · {selectedSilo.tons} tn · {selectedSilo.storage}
          </span>
          {saveOk && !hasChanges && (
            <span style={{display:'flex',alignItems:'center',gap:4,marginLeft:'auto',
              fontFamily:'var(--font-sans)',fontSize:12,fontWeight:500,color:'#22C55E'}}>
              <UIco name="check-circle" size={13} color="#22C55E"/>Guardado
            </span>
          )}
          {applyOk && (
            <span style={{display:'flex',alignItems:'center',gap:4,marginLeft:'auto',
              fontFamily:'var(--font-sans)',fontSize:12,fontWeight:500,color:'#22C55E'}}>
              <UIco name="check-circle" size={13} color="#22C55E"/>
              Aplicado a {applyCount} silo{applyCount!==1?'s':''}
            </span>
          )}
        </div>
      </div>

      {/* ── Scrollable metric cards ── */}
      <div style={{flex:1,overflowY:'auto',padding:'14px 16px 24px',
        display:'flex',flexDirection:'column',gap:12}}>

        {METRICS.map(m => (
          <MetricCard
            key={m.key}
            metric={m}
            thresholds={pending[m.key]}
            reading={readings[m.key]}
            recM={rec[m.key]}
            grain={selectedSilo.grain}
            onThresholdChange={updateMetric}
            onResetMetric={resetMetric}
          />
        ))}

        {/* ── Secondary actions ── */}
        <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
          <UBtn variant="ghost"
            style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}
            onClick={restoreAll}>
            <UIco name="refresh-cw" size={14}/>
            Restaurar todos los valores recomendados
          </UBtn>

          {otherSame.length > 0 && (
            <button onClick={openApply}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                padding:'12px 16px',
                background:'rgba(34,197,94,.06)',border:'1px solid rgba(34,197,94,.2)',
                borderRadius:'var(--radius-md)',cursor:'pointer',transition:'background .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(34,197,94,.1)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(34,197,94,.06)'}>
              <UIco name="copy" size={15} color="#22C55E"/>
              <span style={{fontFamily:'var(--font-sans)',fontSize:14,fontWeight:500,color:'#22C55E'}}>
                Aplicar a otros silos de {selectedSilo.grain} ({otherSame.length})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div style={{padding:'12px 16px',borderTop:'1px solid var(--border-default)',
        background:'var(--surface-app)',flexShrink:0}}>
        <UBtn variant="primary" style={{width:'100%'}}
          onClick={save} disabled={saving || !hasChanges}>
          {btnText}
        </UBtn>
      </div>

      {/* ══ BottomSheet — Aplicar a otros silos ══ */}
      <USheet open={showApply} onClose={()=>setShowApply(false)} title="Aplicar a otros silos"
        actions={[
          <UBtn key="ok" variant="primary" style={{width:'100%'}}
            onClick={doApply} disabled={applyTo.length===0}>
            Aplicar a {applyTo.length} silo{applyTo.length!==1?'s':''}
          </UBtn>,
          <UBtn key="cancel" variant="ghost" style={{width:'100%'}} onClick={()=>setShowApply(false)}>
            Cancelar
          </UBtn>,
        ]}>
        <p style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)',
          lineHeight:1.55,margin:'0 0 14px'}}>
          Copiá los umbrales de{' '}
          <strong style={{color:'var(--text-primary)'}}>{selectedSilo.name}</strong>{' '}
          a estos silos de <strong style={{color:'var(--text-primary)'}}>{selectedSilo.grain}</strong>:
        </p>
        {otherSame.map((s, i) => {
          const checked = applyTo.includes(s.id);
          const dotCol  = s.status==='critical'?'#EF4444':s.status==='warn'?'#F59E0B':'#22C55E';
          return (
            <div key={s.id} onClick={()=>toggleApply(s.id)}
              style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',cursor:'pointer',
                borderBottom:i<otherSame.length-1?'1px solid var(--border-default)':'none'}}>
              <div style={{width:20,height:20,borderRadius:6,flexShrink:0,
                border:`2px solid ${checked?'#22C55E':'var(--border-default)'}`,
                background:checked?'#22C55E':'transparent',
                display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s'}}>
                {checked && <UIco name="check" size={11} color="#000"/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:'var(--font-sans)',fontSize:14,fontWeight:500,
                  color:'var(--text-primary)'}}>{s.name}</div>
                <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)',marginTop:2}}>
                  {s.grain} · {s.tons} tn
                </div>
              </div>
              <div style={{width:8,height:8,borderRadius:'50%',background:dotCol,flexShrink:0}}/>
            </div>
          );
        })}
      </USheet>
    </div>
  );
}

/* ── export ── */
Object.assign(window, { UmbralesScreen });
