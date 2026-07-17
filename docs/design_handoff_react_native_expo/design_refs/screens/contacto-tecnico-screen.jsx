/* SiloGuard — Pantalla 25: Contacto con técnico
   Accedida desde Detalle de alerta [15]. Ofrece llamada directa, WhatsApp con
   contexto precargado, o una consulta escrita (con motivo) cuando el técnico
   no está disponible o el celular está sin conexión.
   Exports: ContactoTecnicoScreen */

(function () {

  const _CTDS = window.SiloGuardDesignSystem_633342;
  const { Button: CTBtn, Icon: CTIco, StatusBadge: CTBadge, StatusDot: CTDot } = _CTDS;

  const CT_PHONE_DISPLAY = '011 4000-1234';
  const CT_PHONE_TEL = '+5491140001234';
  const CT_WHATSAPP_NUMBER = '5491140001234';

  const CT_MOTIVOS = [
    { id: 'confirmar', label: 'Necesito confirmar una acción' },
    { id: 'no-funciono', label: 'La acción recomendada no funcionó' },
    { id: 'otro', label: 'Otro motivo' },
  ];

  const CTLBL = {
    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
    textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 8,
  };

  /* Lunes a sábados, 7:00 a 20:00 */
  function ctIsInHours(date) {
    const day = date.getDay();
    const hour = date.getHours() + date.getMinutes() / 60;
    return day >= 1 && day <= 6 && hour >= 7 && hour < 20;
  }
  function ctTimeStr(date) {
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  function CTBackHeader({ title, onBack }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 16px 10px 8px', background: 'var(--surface-app)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'transparent', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--action-primary)', cursor: 'pointer', flexShrink: 0 }}>
          <CTIco name="chevron-left" size={24} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        </div>
      </div>
    );
  }

  function CTValueChip({ label, value, tone }) {
    const color = tone === 'critical' ? 'var(--status-critical)' : tone === 'warn' ? 'var(--status-warn)' : 'var(--text-secondary)';
    return (
      <div style={{ flex: 1, background: 'var(--surface-input)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '9px 12px', minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color, letterSpacing: '-0.2px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.04em', textTransform: 'uppercase', marginTop: 3 }}>{label}</div>
      </div>
    );
  }

  /**
   * @param alert       alerta origen (title, silo, time, variant, sensor, value, threshold)
   * @param nav         router del prototipo — nav('alert-detail',{alert}) para volver
   * @param connState   'online' | 'offline-recent' | 'offline-prolonged' (estado global del celular)
   * @param availability 'auto' (según hora real) | 'en-horario' | 'fuera-de-horario' — para demo/tweaks
   */
  function ContactoTecnicoScreen({ alert, nav, connState = 'online', availability = 'auto' }) {
    const offline = connState !== 'online';
    const now = React.useMemo(() => new Date(), []);
    const inHours = availability === 'en-horario' ? true
      : availability === 'fuera-de-horario' ? false
      : ctIsInHours(now);

    const cr = alert?.variant === 'critical';
    const sensorLabel = { temp: 'Temp.', humidity: 'Humedad', co2: 'CO₂' }[alert?.sensor] || 'Lectura';
    const unit = { temp: '°C', humidity: '%', co2: 'ppm' }[alert?.sensor] || '';

    const [showForm, setShowForm] = React.useState(!inHours);
    React.useEffect(() => { setShowForm(!inHours); }, [inHours]);

    const [motivo, setMotivo] = React.useState('');
    const [mensaje, setMensaje] = React.useState('');
    const [state, setState] = React.useState('idle'); // idle | sending | sent

    const callDisabled = !inHours;
    const messageDisabled = !inHours || offline;
    const canSubmit = !!motivo && mensaje.trim().length >= 10 && !offline;

    const doCall = () => { if (!callDisabled) window.open(`tel:${CT_PHONE_TEL}`); };
    const doWhatsapp = () => {
      if (messageDisabled) return;
      const text = `Hola, soy productor de SiloGuard.%0ASilo: ${encodeURIComponent(alert?.silo || '')}%0AAlerta: ${encodeURIComponent(alert?.title || '')}`;
      window.open(`https://wa.me/${CT_WHATSAPP_NUMBER}?text=${text}`, '_blank');
    };
    const submit = () => {
      if (!canSubmit) return;
      setState('sending');
      setTimeout(() => setState('sent'), 900);
    };

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface-app)' }}>
        <CTBackHeader title="Contactar técnico" onBack={() => nav('alert-detail', { alert })} />

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {offline && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', background: 'rgba(245,158,11,.06)', border: '1px solid var(--status-warn)', borderRadius: 'var(--radius-lg)' }}>
              <span style={{ display: 'flex', flexShrink: 0, marginTop: 1, color: 'var(--status-warn)' }}><CTIco name="wifi-off" size={16} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Necesitás conexión para contactar al técnico por mensaje</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>Podés llamar directamente — la llamada no requiere internet.</div>
              </div>
            </div>
          )}

          {/* Contexto de la alerta */}
          {alert && (
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <CTBadge tone={cr ? 'critical' : 'warn'}>{cr ? 'Crítica' : 'Advertencia'}</CTBadge>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)' }}>{alert.time}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{alert.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <CTIco name="map-pin" size={13} color="var(--text-secondary)" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)' }}>{alert.silo}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <CTValueChip label={sensorLabel} value={`${alert.value} ${unit}`} tone={cr ? 'critical' : 'warn'} />
                <CTValueChip label="Umbral" value={alert.threshold} />
              </div>
            </div>
          )}

          {/* Disponibilidad */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CTDot tone={inHours ? 'ok' : 'warn'} size={9} glow />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: inHours ? 'var(--status-ok)' : 'var(--status-warn)' }}>
                {inHours ? 'Disponible ahora' : 'Fuera de horario de atención'}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)' }}>
              Lunes a sábados, 7:00 a 20:00 · Ahora son las {ctTimeStr(now)}
            </span>
          </div>

          {!inHours && (
            <div style={{ padding: '11px 14px', background: 'rgba(245,158,11,.07)', border: '1px solid var(--status-warn)', borderRadius: 'var(--radius-lg)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                Fuera de horario de atención. Dejá tu consulta y te respondemos a primera hora.
              </span>
            </div>
          )}

          {/* Opciones de contacto directo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <CTBtn variant="primary" fullWidth disabled={callDisabled} onClick={doCall}
                leadingIcon={<CTIco name="phone" size={18} />}>
                Llamar ahora
              </CTBtn>
              <div style={{ textAlign: 'center', marginTop: 6, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>{CT_PHONE_DISPLAY}</div>
            </div>
            <CTBtn variant="secondary" fullWidth disabled={messageDisabled} onClick={doWhatsapp}
              leadingIcon={<CTIco name="message-circle" size={18} />}>
              Enviar mensaje (WhatsApp)
            </CTBtn>
            {callDisabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CTIco name="clock" size={12} color="var(--text-muted)" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>Fuera de horario — dejá tu consulta abajo</span>
              </div>
            )}
            {!callDisabled && messageDisabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CTIco name="wifi-off" size={12} color="var(--text-muted)" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>Requiere conexión</span>
              </div>
            )}
          </div>

          {/* Link para dejar consulta escrita en vez de llamar/chatear */}
          {inHours && !showForm && state === 'idle' && (
            <button onClick={() => setShowForm(true)} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', alignSelf: 'flex-start' }}>
              <CTIco name="edit" size={13} color="var(--action-primary)" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--action-primary)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Prefiero dejar mi consulta por escrito
              </span>
            </button>
          )}

          {/* Formulario de consulta escrita */}
          {showForm && state !== 'sent' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>
              <span style={CTLBL}>¿Por qué motivo nos contactás?</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: -6 }}>
                {CT_MOTIVOS.map(m => (
                  <button key={m.id} onClick={() => setMotivo(m.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                    background: motivo === m.id ? 'var(--green-tint)' : 'var(--surface-input)',
                    border: `1px solid ${motivo === m.id ? 'var(--action-primary)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                  }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${motivo === m.id ? 'var(--action-primary)' : 'var(--border-default)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {motivo === m.id && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--action-primary)' }} />}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-primary)', fontWeight: motivo === m.id ? 600 : 400 }}>{m.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <span style={CTLBL}>Tu consulta</span>
                <textarea value={mensaje} maxLength={500} rows={4}
                  onChange={e => setMensaje(e.target.value)}
                  placeholder="Ej: la aireación no bajó el CO₂ después de 6 horas."
                  style={{ width: '100%', padding: '11px 12px', background: 'var(--surface-input)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', resize: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5, boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>{mensaje.length}/500</span>
                </div>
              </div>

              <CTBtn variant="primary" fullWidth onClick={submit} disabled={!canSubmit || state === 'sending'}>
                {state === 'sending' ? 'Enviando…' : 'Enviar consulta'}
              </CTBtn>
              {offline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CTIco name="wifi-off" size={12} color="var(--text-muted)" />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>Necesitás conexión para enviar tu consulta</span>
                </div>
              )}
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {inHours ? 'Te respondemos a la brevedad.' : 'Te contactamos a primera hora del próximo horario de atención.'}
              </span>
            </div>
          )}

          {/* Confirmación de envío */}
          {state === 'sent' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, padding: '24px 8px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-tint)', border: '1px solid rgba(34,197,94,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(34,197,94,.3)' }}>
                <CTIco name="check-circle" size={30} color="var(--action-primary)" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Consulta enviada</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 260 }}>
                  Te respondemos pronto{!inHours ? ', a primera hora del próximo horario de atención' : ''}.
                </div>
              </div>
              <CTBtn variant="ghost" onClick={() => nav('alert-detail', { alert })}>Volver a la alerta</CTBtn>
            </div>
          )}

          {/* Nota de privacidad */}
          {state !== 'sent' && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'center', marginTop: 4 }}>
              Al contactar aceptás compartir los datos actuales del silo con el técnico.
            </span>
          )}
        </div>
      </div>
    );
  }

  Object.assign(window, { ContactoTecnicoScreen });

})();
