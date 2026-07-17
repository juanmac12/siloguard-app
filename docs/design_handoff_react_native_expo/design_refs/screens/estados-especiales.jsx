/* SiloGuard — Bloque 9: Estados especiales
   Pantallas [27] Sin conexión (celular) · [28] Lanza sin respuesta
   No son pantallas propias — son ESTADOS superpuestos sobre Dashboard [11]
   y Detalle de silo [12]. Exports: OfflineBanner, DeviceOfflineBanner,
   DisabledHint, relTime */

(function(){

const DS = window.SiloGuardDesignSystem_633342;
const { Icon } = DS;

/* ═════════════════════════════════════════════════════════════════════
   Iconos puntuales no cubiertos por el set compartido
   ═════════════════════════════════════════════════════════════════════ */
function WifiOffGlyph({size=18,color='currentColor'}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
    <line x1="2" y1="2" x2="22" y2="22"/>
    <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
    <path d="M5 12.5a10 10 0 0 1 3-2.1M19 12.5a10 10 0 0 0-2.2-1.6M2 8.8a15 15 0 0 1 4.2-2.8M22 8.8a15 15 0 0 0-8-4.3M12 20h.01"/>
  </svg>);
}
function CloudOffGlyph({size=18,color='currentColor'}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
    <line x1="2" y1="2" x2="22" y2="22"/>
    <path d="M18.5 17H19a3.5 3.5 0 0 0 .4-6.98A6 6 0 0 0 8.4 6.4M6.6 6.6A6 6 0 0 0 5 18h.5"/>
  </svg>);
}
function AntennaGlyph({size=16,color='currentColor'}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
    <path d="M12 20V10"/><path d="M5 10a7 7 0 0 1 14 0"/><path d="M2 6a11 11 0 0 1 20 0"/><circle cx="12" cy="20" r="1.5" fill={color} stroke="none"/>
  </svg>);
}

/* ═════════════════════════════════════════════════════════════════════
   Formato relativo de tiempo — "hace 12 min", "hace 2 h"
   ═════════════════════════════════════════════════════════════════════ */
function relTime(mins){
  if(mins<60) return `hace ${mins} min`;
  const h=Math.round(mins/60);
  return `hace ${h} ${h===1?'hora':'horas'}`;
}

/* ═════════════════════════════════════════════════════════════════════
   [27] Sin conexión — banner global, va arriba de cualquier pantalla
   intensidad: 'recent' (<1h) vs 'prolonged' (>=1h)
   ═════════════════════════════════════════════════════════════════════ */
function OfflineBanner({minutesOffline=12}){
  const prolonged = minutesOffline>=60;
  const tone = prolonged?'var(--status-warn)':'var(--status-warn)';
  return(
    <div style={{display:'flex',alignItems:'flex-start',gap:10,margin:'0 16px 10px',padding:'11px 14px',
      background:prolonged?'rgba(234,179,8,.10)':'rgba(234,179,8,.06)',
      border:`1px solid var(--status-warn)`,borderRadius:'var(--radius-lg)',flexShrink:0}}>
      <span style={{display:'flex',flexShrink:0,marginTop:1,color:'var(--status-warn)'}}>
        <WifiOffGlyph size={16}/>
      </span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-sans)',fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>
          Sin conexión a internet
        </div>
        <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)',marginTop:2,lineHeight:1.4}}>
          Último dato recibido: {relTime(minutesOffline)}.
          {prolonged&&' Los datos pueden estar desactualizados.'}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Nota inline para acciones bloqueadas por falta de red
   ═════════════════════════════════════════════════════════════════════ */
function DisabledHint({children}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:6}}>
      <WifiOffGlyph size={12} color="var(--text-muted)"/>
      <span style={{fontFamily:'var(--font-sans)',fontSize:11.5,color:'var(--text-muted)'}}>{children||'Requiere conexión'}</span>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   [28] Lanza sin respuesta — banner por silo, dentro de Detalle de silo
   intensidad: 'recent' (<30min) vs 'prolonged' (>=30min)
   ═════════════════════════════════════════════════════════════════════ */
const DIAG_STEPS=[
  'Verificá que la lanza esté encendida y el LED verde parpadee.',
  'Asegurate de que el router WiFi del silo esté funcionando.',
  'Acercate al silo y verificá que la lanza esté correctamente clavada.',
  'Si el problema persiste, contactá a soporte técnico.',
];

function DeviceOfflineBanner({minutesOffline=12, onContactSupport}){
  const prolonged = minutesOffline>=30;
  const [open,setOpen]=React.useState(false);
  const tone = prolonged?'var(--status-critical)':'var(--status-warn)';
  const tint = prolonged?'rgba(239,68,68,.07)':'rgba(234,179,8,.07)';
  return(
    <div style={{margin:'0 16px 4px',background:tint,border:`1px solid ${tone}`,
      borderRadius:'var(--radius-lg)',overflow:'hidden',flexShrink:0}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'13px 14px'}}>
        <span style={{display:'flex',flexShrink:0,marginTop:1,color:tone}}>
          <CloudOffGlyph size={18}/>
        </span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--font-sans)',fontSize:13.5,fontWeight:700,color:'var(--text-primary)'}}>
            La lanza no responde
          </div>
          <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)',marginTop:2}}>
            Última señal recibida: {relTime(minutesOffline)}
          </div>
        </div>
      </div>
      <button onClick={()=>setOpen(o=>!o)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        width:'100%',padding:'10px 14px',background:'transparent',border:'none',borderTop:`1px solid ${tone}`,
        cursor:'pointer',opacity:.85}}>
        <span style={{fontFamily:'var(--font-sans)',fontSize:12.5,fontWeight:600,color:tone}}>¿Qué puedo hacer?</span>
        <Icon name="chevron-down" size={15} color={tone} style={{transform:open?'rotate(180deg)':'none',transition:'transform .15s'}}/>
      </button>
      {open&&(
        <div style={{padding:'2px 14px 14px'}}>
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {DIAG_STEPS.map((s,i)=>(
              <div key={i} style={{display:'flex',gap:9,alignItems:'flex-start'}}>
                <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:18,height:18,
                  borderRadius:'50%',background:'var(--surface-input)',border:`1px solid ${tone}`,flexShrink:0,marginTop:1}}>
                  <span style={{fontFamily:'var(--font-sans)',fontSize:10,fontWeight:700,color:tone}}>{i+1}</span>
                </span>
                <span style={{fontFamily:'var(--font-sans)',fontSize:12.5,color:'var(--text-secondary)',lineHeight:1.5}}>{s}</span>
              </div>
            ))}
          </div>
          <button onClick={onContactSupport} style={{marginTop:12,display:'flex',alignItems:'center',justifyContent:'center',
            gap:6,width:'100%',padding:'10px',background:'var(--surface-input)',border:`1px solid ${tone}`,
            borderRadius:'var(--radius-md)',cursor:'pointer'}}>
            <Icon name="clipboard" size={14} color={tone}/>
            <span style={{fontFamily:'var(--font-sans)',fontSize:12.5,fontWeight:600,color:tone}}>Contactar soporte</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── exports ── */
window.OfflineBanner=OfflineBanner;
window.DeviceOfflineBanner=DeviceOfflineBanner;
window.DisabledHint=DisabledHint;
window.relTime=relTime;
window.AntennaGlyph=AntennaGlyph;

})();
