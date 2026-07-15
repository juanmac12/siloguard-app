/* SiloGuard — Profile Screens
   Exports: ProfileScreen, EditProfileScreen, NotificationsScreen, DevicesScreen */
const _PDS = window.SiloGuardDesignSystem_633342;
const { Button: PBtn, Icon: PIcon, Toggle: PTgl, Input: PInp, BottomSheet: PSheet, StatusBadge: PSBadge } = _PDS;

/* ── shared ── */
const _L={fontFamily:'var(--font-sans)',fontSize:11,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--text-muted)',margin:'0 0 8px',display:'block'};

function PBackHeader({title,onBack,right}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:4,padding:'10px 16px 10px 8px',background:'var(--surface-app)',borderBottom:'1px solid var(--border-default)',flexShrink:0}}>
      <button onClick={onBack} style={{display:'flex',alignItems:'center',justifyContent:'center',width:40,height:40,background:'transparent',border:'none',borderRadius:'var(--radius-md)',color:'var(--action-primary)',cursor:'pointer',flexShrink:0}}>
        <PIcon name="chevron-left" size={24}/>
      </button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-sans)',fontSize:17,fontWeight:600,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{title}</div>
      </div>
      {right&&<div style={{flexShrink:0,marginLeft:8}}>{right}</div>}
    </div>
  );
}

function PAvatar({name,size=72,editable,onEdit}){
  const ini=(name||'?').split(' ').filter(Boolean).map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return(
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:'50%',background:'var(--green-tint)',border:'2px solid var(--action-primary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontFamily:'var(--font-sans)',fontSize:size*.35,fontWeight:700,color:'var(--action-primary)',letterSpacing:'-0.5px'}}>{ini}</span>
      </div>
      {editable&&<button onClick={onEdit} style={{position:'absolute',bottom:-2,right:-2,width:26,height:26,borderRadius:'50%',background:'var(--action-primary)',border:'2px solid var(--surface-app)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',padding:0}}>
        <PIcon name="camera" size={12} color="#000"/>
      </button>}
    </div>
  );
}

function MRow({icon,label,value,onClick,danger,last,toggle}){
  return(
    <div onClick={onClick} role={onClick?'button':undefined} tabIndex={onClick?0:undefined}
      style={{display:'flex',alignItems:'center',gap:12,padding:'13px 0',
        borderBottom:last?'none':'1px solid var(--border-default)',cursor:onClick?'pointer':'default'}}>
      <span style={{display:'flex',flexShrink:0,color:danger?'var(--status-critical)':'var(--text-secondary)'}}><PIcon name={icon} size={20}/></span>
      <span style={{flex:1,fontFamily:'var(--font-sans)',fontSize:15,fontWeight:500,color:danger?'var(--status-critical)':'var(--text-primary)'}}>{label}</span>
      {value&&<span style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-muted)',marginRight:4}}>{value}</span>}
      {toggle}
      {onClick&&!danger&&!toggle&&<PIcon name="chevron-right" size={18} color="var(--text-muted)"/>}
    </div>
  );
}

function SCard({label,children,style}){
  return(
    <div style={{marginBottom:14,...style}}>
      {label&&<span style={_L}>{label}</span>}
      <div style={{background:'var(--surface-card)',border:'1px solid var(--border-default)',borderRadius:'var(--radius-lg)',padding:'0 14px'}}>{children}</div>
    </div>
  );
}

function VerifiedBadge(){
  return(
    <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'2px 8px 2px 6px',borderRadius:999,background:'var(--green-tint)',color:'var(--action-primary)',fontFamily:'var(--font-sans)',fontSize:11,fontWeight:600,flexShrink:0}}>
      <PIcon name="check-circle" size={11}/>Verificado
    </span>
  );
}

function SMini({label,value,color='var(--text-primary)'}){
  const isN=typeof value==='number';
  return(
    <div style={{background:'var(--surface-card)',border:'1px solid var(--border-default)',borderRadius:'var(--radius-md)',padding:'10px 12px',textAlign:'center'}}>
      <div style={{fontFamily:'var(--font-sans)',fontSize:isN?20:14,fontWeight:700,color,lineHeight:1.15,height:24,display:'flex',alignItems:'center',justifyContent:'center'}}>{value}</div>
      <div style={{fontFamily:'var(--font-sans)',fontSize:10,color:'var(--text-muted)',letterSpacing:'.05em',textTransform:'uppercase',marginTop:4}}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE — main screen (2 variations via variant prop)
   ═══════════════════════════════════════════════════════════ */
function ProfileScreen({profile,siloCount,variant,nav}){
  const [showLogout,setShowLogout]=React.useState(false);

  const onl=profile.devices.filter(d=>d.status==='online').length;
  const tot=profile.devices.length;
  const isP=variant==='propuesta';

  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--surface-app)'}}>
      <div style={{padding:'16px 16px 0',flexShrink:0}}>
        <h1 style={{fontFamily:'var(--font-sans)',fontSize:26,fontWeight:700,color:'var(--text-primary)',letterSpacing:'-0.3px',margin:0}}>Mi Perfil</h1>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'12px 16px 24px'}}>
        {isP?(
          /* ─── PROPUESTA ─── */
          <>
            <div onClick={()=>nav('edit-profile')} role="button" tabIndex={0}
              style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'16px 0 20px',cursor:'pointer'}}>
              <PAvatar name={profile.name} size={72} editable onEdit={()=>nav('edit-profile')}/>
              <h2 style={{fontFamily:'var(--font-sans)',fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:'12px 0 6px',letterSpacing:'-0.3px'}}>{profile.name}</h2>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <p style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)',margin:0}}>{profile.email}</p>
                <VerifiedBadge/>
              </div>
            </div>
            <div onClick={()=>nav('edit-profile')} role="button" tabIndex={0}
              style={{background:'var(--green-tint)',border:'1px solid rgba(34,197,94,.2)',borderRadius:'var(--radius-lg)',padding:14,marginBottom:16,cursor:'pointer'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <PIcon name="map-pin" size={16} color="var(--action-primary)"/>
                <span style={{fontFamily:'var(--font-sans)',fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>{profile.farm.name}</span>
              </div>
              <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)',display:'flex',gap:6,flexWrap:'wrap'}}>
                <span>{profile.farm.location}</span><span>·</span>
                <span>{siloCount} silos</span><span>·</span>
                <span>{profile.farm.hectares} ha</span>
              </div>
            </div>
            <SCard label="CONFIGURACIÓN">
              <MRow icon="bell"   label="Notificaciones"     onClick={()=>nav('notifications')}/>
              <MRow icon="target" label="Umbrales de alerta" onClick={()=>nav('umbrales')} last/>
            </SCard>
            <SCard label="SEGURIDAD">
              <MRow icon="lock" label="Cambiar contraseña" onClick={()=>{}} last/>
            </SCard>
            <SCard label="AYUDA">
              <MRow icon="info"           label="Repetir tutorial"        onClick={()=>{}}/>
              <MRow icon="message-circle" label="Soporte por WhatsApp"    onClick={()=>window.open('https://wa.me/5491100000000')}/>
              <MRow icon="file-text"      label="Términos y condiciones" onClick={()=>{}}/>
              <MRow icon="shield"         label="Política de privacidad" onClick={()=>{}} last/>
            </SCard>
          </>
        ):(
          /* ─── ACTUAL ─── */
          <>
            <div onClick={()=>nav('edit-profile')} role="button" tabIndex={0}
              style={{display:'flex',gap:14,alignItems:'center',padding:'12px 0 16px',cursor:'pointer'}}>
              <PAvatar name={profile.name} size={52}/>
              <div style={{flex:1,minWidth:0}}>
                <h2 style={{fontFamily:'var(--font-sans)',fontSize:18,fontWeight:700,color:'var(--text-primary)',margin:0,letterSpacing:'-0.2px'}}>{profile.name}</h2>
                <p style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)',margin:'2px 0 0'}}>{profile.email}</p>
              </div>
              <span style={{fontFamily:'var(--font-sans)',fontSize:13,fontWeight:500,color:'var(--action-primary)'}}>Editar</span>
              <PIcon name="chevron-right" size={16} color="var(--action-primary)"/>
            </div>
            {/* farm card */}
            <div style={{background:'var(--green-tint)',border:'1px solid rgba(34,197,94,.2)',borderRadius:'var(--radius-lg)',padding:14,marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <PIcon name="map-pin" size={16} color="var(--action-primary)"/>
                <span style={{fontFamily:'var(--font-sans)',fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>{profile.farm.name}</span>
              </div>
              <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-secondary)',display:'flex',gap:6,flexWrap:'wrap'}}>
                <span>{profile.farm.location}</span><span>·</span>
                <span>{siloCount} silos</span><span>·</span>
                <span>{profile.farm.hectares} ha</span>
              </div>
            </div>
            <SCard>
              <MRow icon="wifi"   label="Mis lanzas"     value={`${onl}/${tot} online`} onClick={()=>nav('devices')}/>
              <MRow icon="bell"   label="Notificaciones" onClick={()=>nav('notifications')}/>
              <MRow icon="target" label="Umbrales de alerta" onClick={()=>nav('umbrales')}/>
              <MRow icon="refresh-cw" label="Repetir tutorial" onClick={()=>{}} last/>
            </SCard>

            <SCard>
              <MRow icon="message-circle" label="Soporte WhatsApp" onClick={()=>window.open('https://wa.me/5491100000000')}/>
              <MRow icon="file-text"      label="Legal"            onClick={()=>{}} last/>
            </SCard>
          </>
        )}
        {/* Logout — shared */}
        <div style={{marginTop:8}}>
          <PBtn variant="ghost" style={{width:'100%',color:'var(--status-critical)'}} onClick={()=>setShowLogout(true)}>
            Cerrar sesión
          </PBtn>
        </div>
        {isP?(
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,margin:'14px 0 0'}}>
            <span style={{fontFamily:'var(--font-sans)',fontSize:11,color:'var(--text-muted)'}}>SiloGuard v1.0.0</span>
            <span style={{color:'var(--text-muted)',fontSize:11}}>·</span>
            <span onClick={()=>{}} role="button" tabIndex={0} style={{fontFamily:'var(--font-sans)',fontSize:11,color:'var(--status-critical)',cursor:'pointer'}}>Eliminar cuenta</span>
          </div>
        ):(
          <p style={{fontFamily:'var(--font-sans)',fontSize:11,color:'var(--text-muted)',textAlign:'center',margin:'12px 0 0'}}>SiloGuard v1.0.0</p>
        )}
      </div>
      <PSheet open={showLogout} onClose={()=>setShowLogout(false)} title="¿Cerrar sesión?"
        actions={[
          <PBtn key="y" variant="danger" style={{width:'100%'}} onClick={()=>setShowLogout(false)}>Sí, cerrar sesión</PBtn>,
          <PBtn key="n" variant="ghost"  style={{width:'100%'}} onClick={()=>setShowLogout(false)}>Cancelar</PBtn>,
        ]}>
        <p style={{fontFamily:'var(--font-sans)',fontSize:14,color:'var(--text-secondary)',margin:0}}>
          Vas a salir de tu cuenta en este dispositivo. Podés volver a iniciar sesión en cualquier momento.
        </p>
      </PSheet>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EDIT PROFILE
   ═══════════════════════════════════════════════════════════ */
function EditProfileScreen({profile,onSave,nav}){
  const [f,setF]=React.useState({
    name:profile.name,email:profile.email,phone:profile.phone,
    farmName:profile.farm.name,farmLoc:profile.farm.location,farmHa:String(profile.farm.hectares),
  });
  const [saved,setSaved]=React.useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const save=()=>{
    onSave({...profile,name:f.name,email:f.email,phone:f.phone,
      farm:{...profile.farm,name:f.farmName,location:f.farmLoc,hectares:Number(f.farmHa)||0}});
    setSaved(true); setTimeout(()=>nav('perfil'),800);
  };
  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--surface-app)'}}>
      <PBackHeader title="Editar perfil" onBack={()=>nav('perfil')}/>
      <div style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:16}}>
        {/* avatar */}
        <div style={{display:'flex',justifyContent:'center',paddingTop:4,paddingBottom:8}}>
          <PAvatar name={f.name} size={80} editable onEdit={()=>{}}/>
        </div>
        <span style={_L}>Datos personales</span>
        <PInp label="Nombre completo" value={f.name}  onChange={e=>set('name',e.target.value)}/>
        <PInp label="Email"           value={f.email} onChange={e=>set('email',e.target.value)} type="email"/>
        <PInp label="Teléfono"        value={f.phone} onChange={e=>set('phone',e.target.value)} type="tel"/>
        <div style={{height:4}}/>
        <span style={_L}>Mi campo</span>
        <PInp label="Nombre del campo" value={f.farmName} onChange={e=>set('farmName',e.target.value)}/>
        <PInp label="Ubicación"        value={f.farmLoc}  onChange={e=>set('farmLoc',e.target.value)}/>
        <PInp label="Hectáreas"        value={f.farmHa}   onChange={e=>set('farmHa',e.target.value)} type="number"/>
      </div>
      <div style={{padding:'12px 16px',borderTop:'1px solid var(--border-default)',background:'var(--surface-app)',flexShrink:0}}>
        <PBtn variant="primary" style={{width:'100%'}} onClick={save} disabled={saved}>{saved?'✓ Guardado':'Guardar cambios'}</PBtn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS
   ═══════════════════════════════════════════════════════════ */
function NRow({icon,label,desc,checked,onChange,last,disabled}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 0',borderBottom:last?'none':'1px solid var(--border-default)',opacity:disabled?.5:1,transition:'opacity .15s'}}>
      <span style={{display:'flex',flexShrink:0,color:'var(--text-secondary)'}}><PIcon name={icon} size={20}/></span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-sans)',fontSize:15,fontWeight:500,color:'var(--text-primary)'}}>{label}</div>
        {desc&&<div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)',marginTop:2}}>{desc}</div>}
      </div>
      <PTgl checked={checked} onChange={onChange} size="sm" disabled={disabled}/>
    </div>
  );
}

function NotificationsScreen({settings,onChange,nav}){
  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--surface-app)'}}>
      <PBackHeader title="Notificaciones" onBack={()=>nav('perfil')}/>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <SCard label="ALERTAS">
          <NRow icon="alert-triangle" label="Alertas críticas"  desc="Siempre activas — Requerido" checked={true} onChange={()=>{}} disabled={true}/>
          <NRow icon="trending-up"    label="Advertencias"      desc="Lecturas por encima del umbral"       checked={settings.warning}  onChange={v=>onChange('warning',v)} last/>
        </SCard>
        <SCard label="RESUMEN SEMANAL">
          <NRow icon="clock" label="Recibir resumen semanal" desc="Todos los lunes a las 8:00 AM" checked={settings.weeklySummary!==false} onChange={v=>onChange('weeklySummary',v)} last/>
        </SCard>
        <SCard label="SILENCIO NOCTURNO">
          <NRow icon="moon" label="Silenciar de noche" desc="Las alertas críticas se envían siempre, incluso en horario de silencio." checked={settings.nightSilence||false} onChange={v=>onChange('nightSilence',v)}/>
          {settings.nightSilence&&(
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 0',borderTop:'1px solid var(--border-default)'}}>
              <span style={{display:'flex',flexShrink:0,color:'var(--text-secondary)'}}><PIcon name="clock" size={18}/></span>
              <span style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)'}}>De</span>
              <span style={{fontFamily:'var(--font-sans)',fontSize:14,fontWeight:600,color:'var(--text-primary)',background:'var(--surface-input)',padding:'4px 10px',borderRadius:'var(--radius-md)',border:'1px solid var(--border-default)'}}>{settings.nightStart||'22:00'}</span>
              <span style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-secondary)'}}>a</span>
              <span style={{fontFamily:'var(--font-sans)',fontSize:14,fontWeight:600,color:'var(--text-primary)',background:'var(--surface-input)',padding:'4px 10px',borderRadius:'var(--radius-md)',border:'1px solid var(--border-default)'}}>{settings.nightEnd||'07:00'}</span>
            </div>
          )}
          <div style={{padding:'10px 0',borderTop:'1px solid var(--border-default)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{display:'flex',flexShrink:0,color:'var(--text-secondary)'}}><PIcon name="smartphone" size={18}/></span>
              <span style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-muted)'}}>Permisos de notificaciones: <strong style={{color:'var(--status-ok)'}}>Activados</strong></span>
            </div>
          </div>
        </SCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEVICES (Mis Lanzas)
   ═══════════════════════════════════════════════════════════ */
function DCard({device,last}){
  const on=device.status==='online';
  const bc=device.battery>50?'var(--status-ok)':device.battery>20?'var(--status-warn)':'var(--status-critical)';
  return(
    <div style={{padding:'14px 0',borderBottom:last?'none':'1px solid var(--border-default)',display:'flex',gap:12,alignItems:'center'}}>
      <div style={{width:44,height:44,borderRadius:'var(--radius-md)',background:on?'var(--green-tint)':'var(--surface-input)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <PIcon name="wifi" size={20} color={on?'var(--action-primary)':'var(--text-muted)'}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontFamily:'var(--font-sans)',fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>{device.name}</span>
          <span style={{width:8,height:8,borderRadius:'50%',background:on?'var(--status-ok)':'var(--text-muted)',flexShrink:0}}/>
        </div>
        <div style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)',marginTop:2}}>{device.silo} · {device.lastSync}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}>
        <span style={{fontFamily:'var(--font-sans)',fontSize:13,fontWeight:600,color:bc}}>{device.battery}%</span>
        <span style={{fontFamily:'var(--font-sans)',fontSize:10,color:'var(--text-muted)'}}>Batería</span>
      </div>
    </div>
  );
}

function DevicesScreen({devices,nav}){
  const onl=devices.filter(d=>d.status==='online').length;
  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--surface-app)'}}>
      <PBackHeader title="Mis lanzas" onBack={()=>nav('perfil')}/>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
          <div style={{background:'var(--green-tint)',border:'1px solid rgba(34,197,94,.2)',borderRadius:'var(--radius-md)',padding:'10px 12px',textAlign:'center'}}>
            <div style={{fontFamily:'var(--font-sans)',fontSize:22,fontWeight:700,color:'var(--action-primary)'}}>{onl}</div>
            <div style={{fontFamily:'var(--font-sans)',fontSize:10,color:'var(--text-muted)',letterSpacing:'.05em',textTransform:'uppercase',marginTop:4}}>Online</div>
          </div>
          <div style={{background:'var(--surface-card)',border:'1px solid var(--border-default)',borderRadius:'var(--radius-md)',padding:'10px 12px',textAlign:'center'}}>
            <div style={{fontFamily:'var(--font-sans)',fontSize:22,fontWeight:700,color:'var(--text-muted)'}}>{devices.length-onl}</div>
            <div style={{fontFamily:'var(--font-sans)',fontSize:10,color:'var(--text-muted)',letterSpacing:'.05em',textTransform:'uppercase',marginTop:4}}>Offline</div>
          </div>
        </div>
        <SCard label="DISPOSITIVOS">
          {devices.map((d,i)=><DCard key={d.id} device={d} last={i===devices.length-1}/>)}
        </SCard>
        <div style={{marginTop:4}}>
          <PBtn variant="secondary" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <PIcon name="plus-circle" size={16}/>Vincular nueva lanza
          </PBtn>
        </div>
      </div>
    </div>
  );
}

/* ── export to window ── */
Object.assign(window, { ProfileScreen, EditProfileScreen, NotificationsScreen, DevicesScreen });
