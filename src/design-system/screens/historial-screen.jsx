/* SiloGuard — Historial de Sensores v2
   Diseño: Tres paneles apilados (Idea B)
   Exports: HistorialScreen */

const _HS = (() => {

const DS = window.SiloGuardDesignSystem_633342;
const { Icon, Tabs } = DS;

const IB = {display:'flex',alignItems:'center',justifyContent:'center',width:40,height:40,
            background:'transparent',border:'none',borderRadius:'var(--radius-md)',
            color:'var(--text-primary)',cursor:'pointer',flexShrink:0};

/* ── Umbrales de alerta ── */
const TH = {
  temp:{ warn:28,  critical:35  },
  hum: { warn:16,  critical:20  },
  co2: { warn:600, critical:800 },
};

/* ── Config visual por variable ── */
const VCFG = {
  temp:{ label:'Temperatura', icon:'thermometer', unit:'°C'  },
  hum: { label:'Humedad',     icon:'droplet',     unit:'%'   },
  co2: { label:'CO₂',        icon:'wind',        unit:'ppm' },
};

/* ── Colores semáforo ── */
const THX = { ok:'#22C55E', warn:'#F59E0B', critical:'#EF4444' };

/* ─────────────────────────────────────────────────────────────────────────
   Generación de datos de ejemplo (determinista por silo)
   ───────────────────────────────────────────────────────────────────────── */
function rng(seed){
  let s=((seed%2147483647)+2147483647)%2147483647||1;
  return ()=>{s=s*16807%2147483647;return(s-1)/2147483646;};
}

function genData(silo){
  const r=rng(silo.id*7919+42), N=169;
  function curve(end,range,shape,noise,daily){
    const start=end-range, arr=[];
    for(let i=0;i<N;i++){
      const t=i/(N-1);
      let b;
      if(shape==='exp')      b=start+range*Math.pow(t,2.2);
      else if(shape==='sig') b=start+range/(1+Math.exp(-10*(t-0.45)));
      else                   b=start+range*t;
      arr.push(+(b+(r()-0.5)*2*noise+daily*Math.sin(i/24*Math.PI*2-0.9)).toFixed(1));
    }
    arr[N-1]=end;
    return arr;
  }
  const c=silo.status==='critical', w=silo.status==='warn';
  return {
    temp: curve(silo.temp, c?16:w?5:2,    c?'exp':'linear',  c?0.6:0.3, c?0.8:1.2),
    hum:  curve(silo.hum,  c?3:w?3:1,     'linear',          0.4,       0.3),
    co2:  curve(silo.co2,  c?400:w?120:40, c?'sig':'linear',  c?15:8,    5),
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────────── */
function getTone(silo,v){
  const val = v==='temp'?silo.temp:v==='hum'?silo.hum:silo.co2;
  return val>=TH[v].critical?'critical':val>=TH[v].warn?'warn':'ok';
}
function getVal(silo,v){ return v==='temp'?silo.temp:v==='hum'?silo.hum:silo.co2; }

function niceScale(mn,mx){
  if(mx-mn<0.01){mn-=1;mx+=1;}
  const range=mx-mn, rough=range/4;
  const mag=Math.pow(10,Math.floor(Math.log10(rough))), r=rough/mag;
  const step=r<=1?mag:r<=2?2*mag:r<=5?5*mag:10*mag;
  return{ min:Math.floor(mn/step)*step, max:Math.ceil(mx/step)*step };
}

/* Mensaje de estado en lenguaje llano */
function statusMsg(tone, slice, th){
  const len=slice.length;
  const critIdx=slice.findIndex(v=>v>=th.critical);
  const warnIdx=slice.findIndex(v=>v>=th.warn);
  if(tone==='critical'&&critIdx>=0&&critIdx<len-1){
    const h=len-1-critIdx;
    return `Superó el límite hace ${h}h`;
  }
  if(tone==='warn'&&warnIdx>=0&&warnIdx<len-1){
    const h=len-1-warnIdx;
    return `En advertencia hace ${h}h`;
  }
  if(tone==='ok') return 'Dentro del rango seguro';
  return '';
}

/* Catmull-Rom → cubic bezier */
function smooth(pts){
  if(pts.length<3) return pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  let d='M'+pts[0][0].toFixed(1)+','+pts[0][1].toFixed(1);
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    d+=' C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+','+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)
        +' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+','+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)
        +' '+p2[0].toFixed(1)+','+p2[1].toFixed(1);
  }
  return d;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ZONE CHART
   Gráfico con bandas de color de fondo: verde (seguro) · amarillo (advertencia) · rojo (crítico)
   El usuario ve de un vistazo si la línea está en zona segura o de peligro.
   ═══════════════════════════════════════════════════════════════════════════ */
function ZoneChart({ slice, variable, timeRange }){
  const th  = TH[variable];
  const len = slice.length;

  /* layout SVG */
  const W=340, H=108, ml=32, mr=6, mt=6, mb=20;
  const pw=W-ml-mr, ph=H-mt-mb;

  /* escala Y — siempre incluye ambos umbrales para que las bandas sean visibles */
  const dataMn=Math.min(...slice), dataMx=Math.max(...slice);
  const scMin=Math.min(dataMn, th.warn*0.88);
  const scMax=Math.max(dataMx, th.critical*1.06);
  const sc=niceScale(scMin,scMax);
  const yr=sc.max-sc.min||1;

  const toX=i=>ml+(i/(len-1))*pw;
  const toY=v=>mt+(1-(v-sc.min)/yr)*ph;

  /* límites de banda en px */
  const yBottom = mt+ph;
  const yTop    = mt;
  const yWarn   = Math.min(yBottom, Math.max(yTop, toY(th.warn)));
  const yCrit   = Math.min(yBottom, Math.max(yTop, toY(th.critical)));

  /* paths */
  const pts  = slice.map((v,i)=>[toX(i),toY(v)]);
  const line = smooth(pts);
  const area = line+` L${pts[len-1][0].toFixed(1)},${yBottom} L${pts[0][0].toFixed(1)},${yBottom} Z`;

  /* color actual */
  const curVal = slice[len-1];
  const tn     = curVal>=th.critical?'critical':curVal>=th.warn?'warn':'ok';
  const hex    = THX[tn];

  /* línea vertical en el primer cruce */
  const critIdx = slice.findIndex(v=>v>=th.critical);
  const warnIdx = slice.findIndex(v=>v>=th.warn);
  const crossIdx= critIdx>=0?critIdx:warnIdx>=0?warnIdx:-1;

  /* etiquetas eje X */
  const steps=timeRange===24?[0,6,12,18,24]:timeRange===48?[0,12,24,36,48]:timeRange===72?[0,24,48,72]:[0,48,96,144,168];
  const xLabels=steps.map(h=>({
    x:toX(Math.round(h/timeRange*(len-1))),
    label:h===timeRange?'Ahora':`${timeRange-h}h`
  }));

  /* etiquetas eje Y: solo los umbrales */
  const yTickWarn = th.warn>=sc.min&&th.warn<=sc.max;
  const yTickCrit = th.critical>=sc.min&&th.critical<=sc.max;

  const gid='zg-'+variable;

  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={hex} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={hex} stopOpacity="0.02"/>
        </linearGradient>
      </defs>

      {/* ── BANDAS DE ZONA (fondo) ── */}
      {/* Zona segura: desde el umbral de advertencia hacia abajo */}
      <rect x={ml} y={yWarn}  width={pw} height={Math.max(0,yBottom-yWarn)} fill="#22C55E" opacity="0.08"/>
      {/* Zona advertencia: entre warn y critical */}
      <rect x={ml} y={yCrit}  width={pw} height={Math.max(0,yWarn-yCrit)}   fill="#F59E0B" opacity="0.10"/>
      {/* Zona crítica: sobre el umbral crítico */}
      <rect x={ml} y={yTop}   width={pw} height={Math.max(0,yCrit-yTop)}    fill="#EF4444" opacity="0.10"/>

      {/* ── LÍNEAS DE UMBRAL ── */}
      {yTickWarn&&<line x1={ml} x2={W-mr} y1={yWarn} y2={yWarn}
        stroke={THX.warn} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.55"/>}
      {yTickCrit&&<line x1={ml} x2={W-mr} y1={yCrit} y2={yCrit}
        stroke={THX.critical} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.65"/>}

      {/* ── LABELS DE UMBRAL (eje Y) ── */}
      {yTickWarn&&<text x={ml-4} y={yWarn+3.5} textAnchor="end"
        style={{fontSize:9,fontFamily:'var(--font-sans)',fill:THX.warn,opacity:0.85}}>
        {th.warn}
      </text>}
      {yTickCrit&&<text x={ml-4} y={yCrit+3.5} textAnchor="end"
        style={{fontSize:9,fontFamily:'var(--font-sans)',fill:THX.critical,opacity:0.9}}>
        {th.critical}
      </text>}

      {/* ── LÍNEA VERTICAL: momento del primer cruce ── */}
      {crossIdx>0&&crossIdx<len-1&&(
        <line x1={toX(crossIdx)} x2={toX(crossIdx)} y1={mt} y2={mt+ph}
          stroke={THX[tn]} strokeWidth="1" strokeDasharray="2 3" opacity="0.45"/>
      )}

      {/* ── ÁREA DE RELLENO bajo la curva ── */}
      <path d={area} fill={`url(#${gid})`}/>

      {/* ── LÍNEA PRINCIPAL ── */}
      <path d={line} fill="none" stroke={hex} strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── PUNTO ACTUAL ── */}
      <circle cx={pts[len-1][0]} cy={pts[len-1][1]} r="4.5"
        fill={hex} stroke="var(--surface-card)" strokeWidth="2"/>

      {/* ── ETIQUETAS EJE X ── */}
      {xLabels.map((xl,i)=>(
        <text key={i} x={xl.x} y={H-4}
          textAnchor={i===xLabels.length-1?'end':i===0?'start':'middle'}
          style={{fontSize:9,fontFamily:'var(--font-sans)',
            fill:xl.label==='Ahora'?hex:'var(--text-muted)',
            fontWeight:xl.label==='Ahora'?600:400}}>
          {xl.label}
        </text>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIABLE PANEL
   Tarjeta individual para cada sensor (Temp / Humedad / CO₂)
   ═══════════════════════════════════════════════════════════════════════════ */
function VariablePanel({ variable, silo, data, timeRange, panelRef }){
  const cfg   = VCFG[variable];
  const th    = TH[variable];
  const slice = data[variable].slice(168-timeRange);
  const cv    = getVal(silo,variable);
  const tn    = getTone(silo,variable);
  const hex   = THX[tn];
  const msg   = statusMsg(tn,slice,th);

  const mn    = Math.min(...slice).toFixed(1);
  const mx    = Math.max(...slice).toFixed(1);
  const avg   = (slice.reduce((a,b)=>a+b,0)/slice.length).toFixed(1);

  const toneLabel = tn==='critical'?'CRÍTICO':tn==='warn'?'ADVERTENCIA':'OK';

  return(
    <div ref={panelRef} style={{
      background:'var(--surface-card)',
      border:'1px solid var(--border-default)',
      borderTop:`3px solid ${hex}`,
      borderRadius:'var(--radius-lg)',
      overflow:'hidden',
    }}>

      {/* ── CABECERA: ícono + nombre + valor actual ── */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',padding:'14px 16px 10px'}}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {/* nombre + ícono */}
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <Icon name={cfg.icon} size={15} color="var(--text-secondary)"/>
            <span style={{fontFamily:'var(--font-sans)',fontSize:13,fontWeight:600,
                          color:'var(--text-secondary)',letterSpacing:'.02em'}}>
              {cfg.label}
            </span>
          </div>
          {/* semáforo + mensaje en lenguaje llano */}
          <div style={{display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
            <div style={{
              width:7,height:7,borderRadius:'50%',background:hex,flexShrink:0,
              boxShadow:tn!=='ok'?`0 0 6px 1px ${hex}55`:undefined,
            }}/>
            <span style={{fontFamily:'var(--font-sans)',fontSize:11,fontWeight:700,
                          color:hex,letterSpacing:'.05em'}}>
              {toneLabel}
            </span>
            {msg&&<span style={{fontFamily:'var(--font-sans)',fontSize:11,
                                color:'var(--text-muted)'}}>
              · {msg}
            </span>}
          </div>
        </div>

        {/* valor actual — grande y a la derecha */}
        <div style={{display:'flex',alignItems:'baseline',gap:3,flexShrink:0,marginLeft:12}}>
          <span style={{
            fontFamily:'var(--font-sans)',fontSize:30,fontWeight:700,
            color:'var(--text-primary)',letterSpacing:'-1px',lineHeight:1,
          }}>{cv}</span>
          <span style={{fontFamily:'var(--font-sans)',fontSize:13,
                        color:'var(--text-secondary)',fontWeight:500}}>
            {cfg.unit}
          </span>
        </div>
      </div>

      {/* ── GRÁFICO CON ZONAS ── */}
      <div style={{padding:'0 8px 4px'}}>
        <ZoneChart slice={slice} variable={variable} timeRange={timeRange}/>
      </div>

      {/* ── LEYENDA DE ZONAS ── */}
      <div style={{
        display:'flex',gap:12,padding:'8px 16px',
        borderTop:'1px solid var(--border-default)',
        background:'var(--surface-app)',
      }}>
        {[['#22C55E','Seguro'],['#F59E0B','Advertencia'],['#EF4444','Crítico']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:4}}>
            <div style={{width:8,height:8,borderRadius:2,background:c,opacity:0.7}}/>
            <span style={{fontFamily:'var(--font-sans)',fontSize:10,color:'var(--text-muted)'}}>{l}</span>
          </div>
        ))}
      </div>

      {/* ── STATS: Mín / Máx / Prom ── */}
      <div style={{
        display:'grid',gridTemplateColumns:'1fr 1fr 1fr',
        borderTop:'1px solid var(--border-default)',
      }}>
        {[['Mín',mn],['Máx',mx],['Prom',avg]].map(([label,val],i)=>(
          <div key={label} style={{
            padding:'10px 0',textAlign:'center',
            borderRight:i<2?'1px solid var(--border-default)':undefined,
          }}>
            <div style={{fontFamily:'var(--font-sans)',fontSize:10,color:'var(--text-muted)',
                          textTransform:'uppercase',letterSpacing:'.05em',marginBottom:3}}>
              {label}
            </div>
            <div style={{fontFamily:'var(--font-sans)',fontSize:14,fontWeight:700,
                          color:'var(--text-primary)',letterSpacing:'-0.3px'}}>
              {val}
              <span style={{fontSize:11,fontWeight:400,color:'var(--text-secondary)',marginLeft:1}}>
                {cfg.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BACK HEADER
   ═══════════════════════════════════════════════════════════════════════════ */
function BackHeader({title,onBack,subtitle,right}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:4,padding:'10px 16px 10px 8px',
                 background:'var(--surface-app)',borderBottom:'1px solid var(--border-default)',
                 flexShrink:0}}>
      <button onClick={onBack} style={{...IB,color:'var(--action-primary)'}}>
        <Icon name="chevron-left" size={24}/>
      </button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-sans)',fontSize:17,fontWeight:600,
                      color:'var(--text-primary)',overflow:'hidden',
                      textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          {title}
        </div>
        {subtitle&&<div style={{fontFamily:'var(--font-sans)',fontSize:12,
                                 color:'var(--text-secondary)',marginTop:1}}>
          {subtitle}
        </div>}
      </div>
      {right&&<div style={{flexShrink:0,marginLeft:8}}>{right}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HISTORIAL SCREEN — pantalla principal
   ═══════════════════════════════════════════════════════════════════════════ */
function HistorialScreen({ silo, nav, initialVariable }){
  const [timeRange,setTimeRange] = React.useState(48);
  const data = React.useMemo(()=>genData(silo),[silo.id]);

  /* refs para scroll automático al panel de la variable tocada */
  const panelRefs = {
    temp: React.useRef(null),
    hum:  React.useRef(null),
    co2:  React.useRef(null),
  };

  /* al montar, hacer scroll al panel de la variable con la que se entró */
  React.useEffect(()=>{
    if(initialVariable && panelRefs[initialVariable] && panelRefs[initialVariable].current){
      setTimeout(()=>{
        const el = panelRefs[initialVariable].current;
        if(el) el.scrollIntoView({block:'start'});
      }, 80);
    }
  },[initialVariable]);

  const dev = (window.SG.profile.devices||[]).find(d=>d.silo===silo.name);
  const lastSync = dev?dev.lastSync:'Hace 10 min';

  const timeItems=[{id:'24',label:'24h'},{id:'48',label:'48h'},{id:'72',label:'72h'},{id:'168',label:'7 días'}];

  return(
    <div data-screen-label="Historial de sensores"
         style={{flex:1,display:'flex',flexDirection:'column',
                 overflow:'hidden',background:'var(--surface-app)'}}>

      {/* HEADER */}
      <BackHeader
        title="Historial de sensores"
        subtitle={`${silo.name} · ${silo.grain}`}
        onBack={()=>nav('silo',{silo})}
        right={
          <span style={{fontFamily:'var(--font-sans)',fontSize:11,color:'var(--text-muted)',
                         display:'flex',alignItems:'center',gap:4}}>
            <Icon name="wifi" size={12}/>{lastSync}
          </span>
        }
      />

      {/* SELECTOR DE RANGO DE TIEMPO */}
      <div style={{padding:'10px 16px 10px',background:'var(--surface-app)',
                   borderBottom:'1px solid var(--border-default)',flexShrink:0}}>
        <Tabs variant="pill" items={timeItems}
              activeId={String(timeRange)}
              onChange={id=>setTimeRange(Number(id))}
              fullWidth={true}/>
      </div>

      {/* TRES PANELES APILADOS */}
      <div style={{flex:1,overflowY:'auto',padding:'14px 16px 28px',
                   display:'flex',flexDirection:'column',gap:14}}>

        {/* Instrucción de lectura — primera vez */}
        <div style={{display:'flex',alignItems:'flex-start',gap:8,padding:'10px 12px',
                     background:'var(--surface-card)',border:'1px solid var(--border-default)',
                     borderRadius:'var(--radius-md)'}}>
          <Icon name="info" size={14} color="var(--text-muted)"/>
          <span style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)',lineHeight:1.5}}>
            Las bandas de color muestran las <strong style={{color:'var(--text-secondary)',fontWeight:600}}>zonas segura, de advertencia y crítica</strong>. La línea blanca es el recorrido del sensor en el período elegido.
          </span>
        </div>

        {(['temp','hum','co2']).map(v=>(
          <VariablePanel
            key={v}
            variable={v}
            silo={silo}
            data={data}
            timeRange={timeRange}
            panelRef={panelRefs[v]}
          />
        ))}

      </div>
    </div>
  );
}

return { HistorialScreen };
})();

Object.assign(window, _HS);
