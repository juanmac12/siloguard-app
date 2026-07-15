/* SiloGuard — Pasaporte de Calidad
   Pantallas [23] Lista de lotes  ·  [24] Detalle / Certificado
   Exports: PasaporteListScreen · PasaporteDetailScreen · LOTES (mock) */

(function(){

const DS = window.SiloGuardDesignSystem_633342;
const { Icon, Button, StatusBadge, BottomSheet, Modal, EmptyState, Tabs } = DS;

const MESES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function todayStr(){ const d=new Date(); return `${String(d.getDate()).padStart(2,'0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`; }
function genLoteId(){ const y=new Date().getFullYear(); const hex=Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase().padStart(4,'0'); return `SG-${y}-${hex}`; }
function estimateScore(status){ return status==='critical'?52+Math.round(Math.random()*10):status==='warn'?68+Math.round(Math.random()*10):86+Math.round(Math.random()*10); }

/* ── shared tokens (mirrors App Screens.html) ── */
const LBL = {fontFamily:'var(--font-sans)',fontSize:11,fontWeight:600,letterSpacing:'.06em',
  textTransform:'uppercase',color:'var(--text-muted)',margin:'0 0 8px',display:'block'};
const IB = {display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,
  background:'transparent',border:'none',borderRadius:'var(--radius-md)',
  color:'var(--text-primary)',cursor:'pointer',flexShrink:0};
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

/* ── score → tono / etiqueta ── */
function scoreTone(s){ return s>=85?'ok':s>=65?'warn':'critical'; }
function toneColor(t){ return t==='ok'?'var(--status-ok)':t==='warn'?'var(--status-warn)':'var(--status-critical)'; }
function toneLabel(t){ return t==='ok'?'Óptimo':t==='warn'?'Regular':'Bajo'; }

/* ═════════ Mock data — lotes son independientes de los silos ═════════ */
const LOTES = [
  // -- lotes activos: cada uno pertenece a un silo real (siloId) --
  { id:'SG-2024-A1F3', siloId:1, name:'Lote Soja Norte 01',  grain:'Soja',    tons:180,
    start:'01 mar 2024', end:null, days:44,  status:'monitoring',
    score:92, alertsResolved:1, avg:{co2:412, temp:21.8, hum:13.4} },
  { id:'SG-2024-B7C2', siloId:2, name:'Lote Maíz Sur 03',    grain:'Maíz',    tons:240,
    start:'05 feb 2024', end:null, days:127, status:'monitoring',
    score:58, alertsResolved:3, avg:{co2:702, temp:29.1, hum:15.9} },
  { id:'SG-2024-D4E8', siloId:3, name:'Lote Trigo Este',     grain:'Trigo',   tons:95,
    start:'22 ene 2024', end:null, days:141, status:'monitoring',
    score:76, alertsResolved:2, avg:{co2:548, temp:26.4, hum:15.2} },
  { id:'SG-2024-F9A5', siloId:4, name:'Lote Soja Oeste',     grain:'Soja',    tons:210,
    start:'12 mar 2024', end:null, days:105, status:'monitoring',
    score:88, alertsResolved:0, avg:{co2:398, temp:22.0, hum:13.1} },
  { id:'SG-2024-C1B6', siloId:6, name:'Lote Maíz 06',        grain:'Maíz',    tons:155,
    start:'20 mar 2024', end:null, days:97,  status:'monitoring',
    score:83, alertsResolved:1, avg:{co2:428, temp:22.4, hum:13.7} },
  // -- certificados emitidos: silo 5 quedó sin lote activo a propósito --
  { id:'SG-2023-9B4C', siloId:5, name:'Lote Girasol 2023',   grain:'Girasol', tons:120,
    start:'08 nov 2023', end:'22 feb 2024', days:106, status:'finalized',
    score:81, alertsResolved:2, avg:{co2:462, temp:22.9, hum:14.3} },
  { id:'SG-2023-3E7D', siloId:2, name:'Lote Maíz Temporada', grain:'Maíz',    tons:265,
    start:'15 oct 2023', end:'30 ene 2024', days:107, status:'finalized',
    score:79, alertsResolved:4, avg:{co2:534, temp:24.6, hum:15.0} },
  { id:'SG-2023-7F2A', siloId:3, name:'Lote Trigo 2023',     grain:'Trigo',   tons:170,
    start:'02 sep 2023', end:'18 dic 2023', days:107, status:'finalized',
    score:87, alertsResolved:1, avg:{co2:471, temp:23.1, hum:14.2} },
];

/* ═════════════════════════════════════════════════════════════════════
   Iconos puntuales que no están en el set compartido (búsqueda / link),
   dibujados con la misma gramática visual: 24×24, trazo 2px, currentColor.
   ═════════════════════════════════════════════════════════════════════ */
function SearchGlyph({size=16,color='currentColor'}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>);
}
function ShareGlyph({size=16,color='currentColor'}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/>
  </svg>);
}
function LinkGlyph({size=16,color='currentColor'}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
    <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5"/>
    <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5"/>
  </svg>);
}

/* ═════════════════════════════════════════════════════════════════════
   Score ring — circular, reutilizado en card (chico) y certificado (grande)
   ═════════════════════════════════════════════════════════════════════ */
function ScoreRing({score, size=52, stroke=4, showLabel=false}){
  const tone=scoreTone(score), color=toneColor(tone);
  const r=(size-stroke)/2, C=2*Math.PI*r, off=C*(1-score/100);
  return(
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-default)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
          style={{transition:'stroke-dashoffset .5s ease'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',lineHeight:1,gap:2}}>
        <span style={{fontFamily:'var(--font-sans)',fontSize:size*0.32,fontWeight:700,
          color:'var(--text-primary)',letterSpacing:'-0.5px'}}>{score}</span>
        {showLabel&&<span style={{fontFamily:'var(--font-sans)',fontSize:size*0.09,fontWeight:600,
          color,textTransform:'uppercase',letterSpacing:'.04em'}}>{toneLabel(tone)}</span>}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Pseudo-QR determinístico — placeholder visual (no decodificable)
   ═════════════════════════════════════════════════════════════════════ */
function FakeQR({seed, size=72}){
  const N=21, cell=size/N;
  let h=0; for(let i=0;i<seed.length;i++) h=((h<<5)-h+seed.charCodeAt(i))|0;
  const rnd=(i)=>{const x=Math.sin((h+i)*9301+49297)*233280; return x-Math.floor(x);};
  const isFinder=(x,y)=>(x<7&&y<7)||(x>=N-7&&y<7)||(x<7&&y>=N-7);
  const modules=[];
  for(let y=0;y<N;y++) for(let x=0;x<N;x++){
    if(isFinder(x,y)) continue;
    if(rnd(y*N+x)>0.56) modules.push([x,y]);
  }
  const Finder=({cx,cy})=>(
    <g>
      <rect x={cx*cell} y={cy*cell} width={cell*7} height={cell*7} fill="#0A0A0A"/>
      <rect x={(cx+1)*cell} y={(cy+1)*cell} width={cell*5} height={cell*5} fill="#fff"/>
      <rect x={(cx+2)*cell} y={(cy+2)*cell} width={cell*3} height={cell*3} fill="#0A0A0A"/>
    </g>
  );
  return(
    <div style={{background:'#fff',borderRadius:8,padding:size*0.09,display:'inline-flex',flexShrink:0}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:'block'}}>
        {modules.map(([x,y],i)=><rect key={i} x={x*cell} y={y*cell} width={cell} height={cell} fill="#0A0A0A"/>)}
        <Finder cx={0} cy={0}/><Finder cx={N-7} cy={0}/><Finder cx={0} cy={N-7}/>
      </svg>
    </div>
  );
}

/* ── Chip (filtros) ── */
function Chip({active, onClick, children}){
  return(
    <button onClick={onClick} style={{
      padding:'7px 13px',
      background:active?'var(--green-tint)':'var(--surface-card)',
      border:`1px solid ${active?'var(--action-primary)':'var(--border-default)'}`,
      borderRadius:'var(--radius-full)',
      color:active?'var(--text-primary)':'var(--text-secondary)',
      fontFamily:'var(--font-sans)',fontSize:12.5,fontWeight:active?600:500,
      cursor:'pointer',whiteSpace:'nowrap',transition:'all .15s',flexShrink:0}}>
      {children}
    </button>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Lote card — pantalla 23
   ═════════════════════════════════════════════════════════════════════ */
function LoteCard({lote, silo, onClick}){
  const isMon=lote.status==='monitoring';
  return(
    <button onClick={onClick} style={{
      display:'flex',alignItems:'center',gap:14,
      width:'100%',padding:'14px',
      background:'var(--surface-card)',border:'1px solid var(--border-default)',
      borderRadius:'var(--radius-lg)',cursor:'pointer',textAlign:'left',transition:'all .15s'}}
      onMouseEnter={e=>{e.currentTarget.style.background='var(--surface-hover)';e.currentTarget.style.borderColor='var(--border-strong)';}}
      onMouseLeave={e=>{e.currentTarget.style.background='var(--surface-card)';e.currentTarget.style.borderColor='var(--border-default)';}}>
      <ScoreRing score={lote.score} size={52} stroke={4}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-sans)',fontSize:15,fontWeight:600,color:'var(--text-primary)',
          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:3}}>
          {lote.name}
        </div>
        <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)',marginBottom:7}}>
          {silo?`${silo.name} · `:''}{lote.grain} · {lote.tons} t · {lote.days} días
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:6,height:6,borderRadius:'50%',
            background:isMon?'var(--action-primary)':'var(--text-muted)',
            boxShadow:isMon?'0 0 0 3px var(--green-tint)':'none'}}/>
          <span style={{fontFamily:'var(--font-sans)',fontSize:11,fontWeight:600,textTransform:'uppercase',
            letterSpacing:'.05em',color:isMon?'var(--action-primary)':'var(--text-muted)'}}>
            {isMon?'En monitoreo':'Finalizado'}
          </span>
        </div>
      </div>
      <Icon name="chevron-right" size={20} color="var(--text-muted)"/>
    </button>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   SCREEN 23 — Lista de lotes
   ═════════════════════════════════════════════════════════════════════ */
function PasaporteListScreen({nav, lotes, silos=[]}){
  const all = lotes && lotes.length ? lotes : LOTES;
  const siloById=React.useMemo(()=>{const m={};silos.forEach(s=>m[s.id]=s);return m;},[silos]);
  const [query,setQuery]=React.useState('');
  const [tab,setTab]=React.useState('activos');
  const [grainF,setGrainF]=React.useState('all');

  const statusF = tab==='activos'?'monitoring':'finalized';
  const grains=['all', ...Array.from(new Set(all.map(l=>l.grain)))];

  const filtered=all.filter(l=>{
    if(l.status!==statusF) return false;
    if(grainF!=='all' && l.grain!==grainF) return false;
    if(query.trim() && !l.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  }).sort((a,b)=>b.score-a.score);

  const monCount=all.filter(l=>l.status==='monitoring').length;
  const finCount=all.filter(l=>l.status==='finalized').length;

  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--surface-app)'}}>
      <div style={{padding:'16px 16px 12px',flexShrink:0}}>
        <h1 style={{fontFamily:'var(--font-sans)',fontSize:26,fontWeight:700,color:'var(--text-primary)',
          letterSpacing:'-0.3px',margin:0}}>Pasaporte de Calidad</h1>
        <p style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)',margin:'4px 0 0'}}>
          Certificados de calidad por lote
        </p>
      </div>

      {/* buscador */}
      <div style={{padding:'0 16px 10px',flexShrink:0}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',
            display:'flex',color:'var(--text-muted)',pointerEvents:'none'}}>
            <SearchGlyph size={16}/>
          </span>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar lote"
            style={{width:'100%',padding:'10px 12px 10px 38px',background:'var(--surface-input)',
              border:'1px solid var(--border-default)',borderRadius:'var(--radius-md)',
              color:'var(--text-primary)',fontFamily:'var(--font-sans)',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
          {query&&(
            <button onClick={()=>setQuery('')} style={{position:'absolute',right:6,top:'50%',
              transform:'translateY(-50%)',...IB,width:28,height:28,color:'var(--text-muted)'}}>
              <Icon name="x" size={15}/>
            </button>
          )}
        </div>
      </div>

      {/* tabs: activos vs. certificados emitidos */}
      <div style={{padding:'0 16px 8px',flexShrink:0}}>
        <Tabs items={[
          {id:'activos',      label:'Activos',      count:monCount},
          {id:'certificados', label:'Certificados', count:finCount},
        ]} activeId={tab} onChange={setTab}/>
      </div>

      {/* filtros: grano */}
      {grains.length>2&&(
        <div style={{padding:'0 16px 12px',flexShrink:0,display:'flex',gap:6,overflowX:'auto'}}>
          {grains.map(g=>(
            <Chip key={g} active={grainF===g} onClick={()=>setGrainF(g)}>{g==='all'?'Todo grano':g}</Chip>
          ))}
        </div>
      )}

      {/* lista */}
      <div style={{flex:1,overflowY:'auto',padding:'4px 16px 24px'}}>
        {filtered.length===0?(
          <div style={{padding:'32px 8px'}}>
            <EmptyState variant="empty" size="sm" title="No hay lotes"
              body={query?`Ningún lote coincide con "${query}".`:tab==='activos'?'No hay lotes en monitoreo. Iniciá uno desde el detalle de un silo.':'Aún no se emitieron certificados.'}/>
          </div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {filtered.map(l=><LoteCard key={l.id} lote={l} silo={siloById[l.siloId]} onClick={()=>nav('pasaporte',{lote:l})}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Certificado — ledger row + esquinas ornamentales
   ═════════════════════════════════════════════════════════════════════ */
function CertRow({icon, label, value, valueColor, last}){
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,
      padding:'11px 0',borderBottom:last?'none':'1px solid var(--border-default)'}}>
      <span style={{display:'flex',alignItems:'center',gap:8,fontFamily:'var(--font-sans)',fontSize:12.5,
        color:'var(--text-secondary)'}}>
        {icon&&<Icon name={icon} size={14} color="var(--text-muted)"/>}
        {label}
      </span>
      <span style={{fontFamily:'var(--font-sans)',fontSize:13.5,fontWeight:600,
        color:valueColor||'var(--text-primary)',textAlign:'right',
        lineHeight:1.35,minWidth:0}}>
        {value}
      </span>
    </div>
  );
}

function Corner({pos}){
  const size=16, base={position:'absolute',width:size,height:size,border:'1.5px solid var(--action-primary)',opacity:.55};
  const styles={
    tl:{...base,top:6,left:6,borderRight:'none',borderBottom:'none'},
    tr:{...base,top:6,right:6,borderLeft:'none',borderBottom:'none'},
    bl:{...base,bottom:6,left:6,borderRight:'none',borderTop:'none'},
    br:{...base,bottom:6,right:6,borderLeft:'none',borderTop:'none'},
  };
  return <span style={styles[pos]}/>;
}

function Certificate({lote, silo, onQRTap}){
  const isMon=lote.status==='monitoring';
  const tone=scoreTone(lote.score), color=toneColor(tone);

  return(
    <div style={{position:'relative',
      background:'linear-gradient(180deg,#141414 0%,#0D0D0D 100%)',
      border:'1px solid var(--border-default)',borderRadius:'var(--radius-lg)',
      padding:'24px 20px 20px',
      boxShadow:'0 10px 32px rgba(0,0,0,.45)'}}>

      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
      </div>

      {/* marca + folio */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,
        paddingBottom:16,borderBottom:'1px solid var(--border-default)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Icon name="shield" size={18} color="var(--action-primary)"/>
          <span style={{fontFamily:'var(--font-sans)',fontSize:13,fontWeight:700,
            color:'var(--text-primary)',letterSpacing:'-0.2px'}}>SiloGuard</span>
        </div>
        <div style={{fontFamily:'var(--font-sans)',fontSize:10.5,fontWeight:700,letterSpacing:'.22em',
          textTransform:'uppercase',color:'var(--text-secondary)'}}>Certificado de Calidad</div>
        <div style={{fontFamily:MONO,fontSize:10,color:'var(--text-muted)',letterSpacing:'.02em'}}>N° {lote.id}</div>
        <StatusBadge tone={isMon?'ok':'resolved'} style={{marginTop:2}}>
          {isMon?'En monitoreo':'Finalizado'}
        </StatusBadge>
      </div>

      {/* score central */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'22px 0 18px',gap:8}}>
        <span style={{fontFamily:'var(--font-sans)',fontSize:10,fontWeight:600,letterSpacing:'.15em',
          textTransform:'uppercase',color:'var(--text-muted)'}}>Score histórico</span>
        <ScoreRing score={lote.score} size={132} stroke={9} showLabel/>
      </div>

      {/* datos del lote */}
      <div style={{padding:'2px 0'}}>
        {silo&&<CertRow icon="home"        label="Silo de origen"       value={silo.name}/>}
        <CertRow icon="clipboard"    label="Grano y tonelaje"     value={`${lote.grain} · ${lote.tons} t`}/>
        <CertRow icon="clock"        label="Período monitoreado"  value={lote.end?`${lote.start} – ${lote.end}`:`${lote.start} – en curso`}/>
        <CertRow icon="target"       label="Días bajo monitoreo"  value={`${lote.days} días`}/>
        <CertRow icon="check-circle" label="Alertas resueltas"    value={lote.alertsResolved}/>
        <CertRow icon="wind"         label="CO₂ promedio"         value={`${lote.avg.co2} ppm`}/>
        <CertRow icon="thermometer"  label="Temp. promedio"       value={`${lote.avg.temp}°C`}/>
        <CertRow icon="droplet"      label="Humedad promedio"     value={`${lote.avg.hum}%`} last/>
      </div>

      {/* QR + verificación */}
      <div style={{display:'flex',alignItems:'center',gap:14,marginTop:16,paddingTop:16,
        borderTop:'1px solid var(--border-default)'}}>
        <button onClick={onQRTap} style={{border:'none',background:'none',padding:0,cursor:'pointer',
          borderRadius:8,lineHeight:0}} aria-label="Ampliar código QR">
          <FakeQR seed={lote.id} size={64}/>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--font-sans)',fontSize:11,fontWeight:600,textTransform:'uppercase',
            letterSpacing:'.05em',color:'var(--text-muted)',marginBottom:3}}>Hash de verificación</div>
          <div style={{fontFamily:MONO,fontSize:12,color:'var(--text-primary)',marginBottom:5,
            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lote.id}</div>
          <button onClick={onQRTap} style={{display:'flex',alignItems:'center',gap:4,background:'none',
            border:'none',padding:0,cursor:'pointer',color:'var(--action-primary)'}}>
            <span style={{fontFamily:'var(--font-sans)',fontSize:12,fontWeight:600}}>Ampliar QR</span>
            <Icon name="chevron-right" size={13} color="var(--action-primary)"/>
          </button>
        </div>
      </div>

      {/* firma */}
      <div style={{marginTop:18,paddingTop:14,borderTop:'1px solid var(--border-default)',
        textAlign:'center'}}>
        <p style={{fontFamily:'var(--font-sans)',fontSize:10.5,color:'var(--text-muted)',
          lineHeight:1.5,margin:0}}>
          Emitido y verificado digitalmente por SiloGuard.<br/>Escaneá el QR para validar su autenticidad.
        </p>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Modal QR ampliado
   ═════════════════════════════════════════════════════════════════════ */
function QRModal({open,onClose,lote}){
  return(
    <Modal open={open} onClose={onClose} title="Verificación del lote" size="sm">
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,padding:'4px 0'}}>
        <FakeQR seed={lote.id} size={220}/>
        <div style={{fontFamily:MONO,fontSize:13,color:'var(--text-primary)',fontWeight:600}}>{lote.id}</div>
        <p style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)',
          textAlign:'center',lineHeight:1.5,margin:0}}>
          Escaneá este código para verificar la autenticidad del certificado en siloguard.com/verify
        </p>
      </div>
    </Modal>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Bottom sheet — Compartir
   ═════════════════════════════════════════════════════════════════════ */
function ShareOption({icon, iconGlyph, label, sub, onClick}){
  return(
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:12,width:'100%',
      padding:'12px 14px',background:'var(--surface-input)',border:'1px solid var(--border-default)',
      borderRadius:'var(--radius-md)',cursor:'pointer',textAlign:'left',transition:'background .15s'}}>
      <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,
        borderRadius:'var(--radius-md)',background:'var(--green-tint)',color:'var(--action-primary)',flexShrink:0}}>
        {iconGlyph||<Icon name={icon} size={17}/>}
      </span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-sans)',fontSize:14,fontWeight:600,color:'var(--text-primary)'}}>{label}</div>
        {sub&&<div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)'}}>{sub}</div>}
      </div>
    </button>
  );
}

function ShareSheet({open,onClose,lote,onViewQR}){
  const [copied,setCopied]=React.useState(false);
  const copyLink=()=>{
    setCopied(true);
    setTimeout(()=>{setCopied(false);onClose();},1200);
  };
  return(
    <BottomSheet open={open} onClose={onClose} title="Compartir certificado">
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <ShareOption icon="file-text" label="Descargar como PDF" sub="Documento listo para imprimir" onClick={onClose}/>
        <ShareOption icon="camera" label="Compartir como imagen" sub="Ideal para WhatsApp o email" onClick={onClose}/>
        <ShareOption iconGlyph={<LinkGlyph size={17}/>} label={copied?'¡Link copiado!':'Copiar link de verificación'}
          sub={`siloguard.com/verify/${lote.id}`} onClick={copyLink}/>
        <ShareOption icon="scan-qr" label="Ver QR grande" sub="Para mostrar o escanear en persona"
          onClick={()=>{onClose();onViewQR();}}/>
      </div>
    </BottomSheet>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   SCREEN 24 — Detalle del lote / Pasaporte
   ═════════════════════════════════════════════════════════════════════ */
function PasaporteDetailScreen({lote, silos=[], nav}){
  const [showShare,setShowShare]=React.useState(false);
  const [showQR,setShowQR]=React.useState(false);
  const silo=silos.find(s=>s.id===lote.siloId);

  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--surface-app)'}}>
      <div style={{display:'flex',alignItems:'center',gap:4,padding:'10px 16px 10px 8px',
        background:'var(--surface-app)',borderBottom:'1px solid var(--border-default)',flexShrink:0}}>
        <button onClick={()=>nav('calidad')} style={IB} aria-label="Volver">
          <Icon name="chevron-left" size={22}/>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--font-sans)',fontSize:16,fontWeight:700,color:'var(--text-primary)',
            letterSpacing:'-0.2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
            Pasaporte de Calidad
          </div>
          <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)',
            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lote.name}</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <Certificate lote={lote} silo={silo} onQRTap={()=>setShowQR(true)}/>
      </div>

      <div style={{padding:'12px 16px',borderTop:'1px solid var(--border-default)',
        background:'var(--surface-app)',flexShrink:0}}>
        <Button variant="primary" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}
          onClick={()=>setShowShare(true)}>
          <ShareGlyph size={16} color="var(--action-primary-text)"/>Compartir certificado
        </Button>
      </div>

      <ShareSheet open={showShare} onClose={()=>setShowShare(false)} lote={lote} onViewQR={()=>setShowQR(true)}/>
      <QRModal open={showQR} onClose={()=>setShowQR(false)} lote={lote}/>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Estado del lote — card en Detalle de silo (pantalla 2)
   Punto de entrada al ciclo de vida del lote: iniciar / ver pasaporte.
   ═════════════════════════════════════════════════════════════════════ */
function LoteStatusCard({lote, onIniciar, onVerPasaporte}){
  if(!lote){
    return(
      <div style={{margin:'0 16px 4px',padding:'14px',display:'flex',alignItems:'center',gap:12,
        background:'var(--surface-card)',border:'1px dashed var(--border-strong)',
        borderRadius:'var(--radius-lg)'}}>
        <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:38,height:38,
          borderRadius:'var(--radius-md)',background:'var(--surface-input)',color:'var(--text-muted)',flexShrink:0}}>
          <Icon name="clipboard" size={18}/>
        </span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--font-sans)',fontSize:13.5,fontWeight:600,color:'var(--text-primary)',marginBottom:2}}>
            Sin lote iniciado
          </div>
          <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)',lineHeight:1.4}}>
            Iniciá el seguimiento de este acopio para emitir su certificado de calidad.
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onIniciar} style={{flexShrink:0}}>Iniciar lote</Button>
      </div>
    );
  }
  const isMon=lote.status==='monitoring';
  return(
    <button onClick={onVerPasaporte} style={{margin:'0 16px 4px',padding:'14px',display:'flex',alignItems:'center',gap:12,
      width:'calc(100% - 32px)',background:'var(--surface-card)',border:'1px solid var(--border-default)',
      borderRadius:'var(--radius-lg)',cursor:'pointer',textAlign:'left'}}>
      <ScoreRing score={lote.score} size={44} stroke={4}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:isMon?'var(--action-primary)':'var(--text-muted)'}}/>
          <span style={{fontFamily:'var(--font-sans)',fontSize:11,fontWeight:600,textTransform:'uppercase',
            letterSpacing:'.05em',color:isMon?'var(--action-primary)':'var(--text-muted)'}}>
            {isMon?`En monitoreo · día ${lote.days}`:'Certificado emitido'}
          </span>
        </div>
        <div style={{fontFamily:'var(--font-sans)',fontSize:13.5,fontWeight:600,color:'var(--text-primary)',
          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lote.name}</div>
      </div>
      <span style={{fontFamily:'var(--font-sans)',fontSize:12.5,fontWeight:600,color:'var(--action-primary)',
        display:'flex',alignItems:'center',gap:3,flexShrink:0}}>
        Pasaporte<Icon name="chevron-right" size={14} color="var(--action-primary)"/>
      </span>
    </button>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Iniciar lote — bottom sheet, datos heredados del silo (fricción mínima)
   ═════════════════════════════════════════════════════════════════════ */
function IniciarLoteSheet({open, onClose, silo, onConfirm}){
  const [name,setName]=React.useState('');
  React.useEffect(()=>{ if(open&&silo) setName(`Lote ${silo.grain} ${silo.name.replace(/^Silo\s*/i,'')}`.trim()); },[open,silo]);
  if(!silo) return null;
  return(
    <BottomSheet open={open} onClose={onClose} title="Iniciar nuevo lote">
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <p style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)',lineHeight:1.5,margin:0}}>
          Se inicia el seguimiento de calidad de <strong style={{color:'var(--text-primary)'}}>{silo.name}</strong> con
          los datos actuales del silo. Al finalizar, se emitirá el certificado.
        </p>
        <div>
          <span style={{...LBL,marginBottom:6}}>Nombre del lote</span>
          <input value={name} onChange={e=>setName(e.target.value)}
            style={{width:'100%',padding:'11px 12px',background:'var(--surface-input)',
              border:'1px solid var(--action-primary)',borderRadius:'var(--radius-md)',
              color:'var(--text-primary)',fontFamily:'var(--font-sans)',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{background:'var(--surface-input)',border:'1px solid var(--border-default)',
          borderRadius:'var(--radius-md)',padding:'0 14px'}}>
          <CertRow icon="clipboard" label="Grano y tonelaje" value={`${silo.grain} · ${silo.tons} t`}/>
          <CertRow icon="clock"     label="Inicio de monitoreo" value={todayStr()} last/>
        </div>
        <Button variant="primary" style={{width:'100%'}} disabled={!name.trim()}
          onClick={()=>onConfirm({name:name.trim(),silo})}>
          Iniciar monitoreo
        </Button>
      </div>
    </BottomSheet>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Finalizar lote — confirmación, emite el certificado
   ═════════════════════════════════════════════════════════════════════ */
function FinalizarLoteConfirm({open, onClose, lote, onConfirm}){
  if(!lote) return null;
  return(
    <Modal open={open} onClose={onClose} title="Finalizar lote" size="sm"
      actions={[
        <Button key="no" variant="ghost" onClick={onClose}>Cancelar</Button>,
        <Button key="ok" variant="primary" onClick={()=>onConfirm(lote)}>Finalizar y emitir</Button>,
      ]}>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <p style={{margin:0,lineHeight:1.55}}>
          Se cerrará el seguimiento de <strong style={{color:'var(--text-primary)'}}>{lote.name}</strong> y se
          emitirá su certificado final con el score histórico actual (<strong style={{color:toneColor(scoreTone(lote.score))}}>{lote.score}</strong>).
        </p>
        <p style={{margin:0,fontSize:12.5,color:'var(--text-muted)'}}>Esta acción no se puede deshacer.</p>
      </div>
    </Modal>
  );
}

/* ── exports ── */
window.PasaporteListScreen=PasaporteListScreen;
window.PasaporteDetailScreen=PasaporteDetailScreen;
window.LoteStatusCard=LoteStatusCard;
window.IniciarLoteSheet=IniciarLoteSheet;
window.FinalizarLoteConfirm=FinalizarLoteConfirm;
window.LOTES_PASAPORTE=LOTES;
window.genLoteId=genLoteId;
window.todayStr=todayStr;
window.estimateScore=estimateScore;

})();
