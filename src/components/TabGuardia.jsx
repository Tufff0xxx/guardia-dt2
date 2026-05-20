const ROLES = [
  'JEFE DE GUARDIA',
  'AYUDANTE DE GUARDIA',
  'ADMINISTRATIVO',
  'ARMERO',
  'LOGÍSTICO',
  'PUESTO 1',
  'CASILLA CONGRESO',
  'OTRO'
]

function TabGuardia({ personal, administrativos, datos, onChange, movilJefatura, onMovilJefatura, movilesData, ruggers, handys }) {

  function actualizarCampo(campo, valor) {
    onChange({ ...datos, [campo]: valor })
  }

  function agregarRol() {
    const nuevosRoles = [...datos.roles, { rol: 'JEFE DE GUARDIA', persona: '', usarNomina: false }]
    onChange({ ...datos, roles: nuevosRoles })
  }

  function actualizarRol(index, campo, valor) {
    const nuevosRoles = datos.roles.map((r, i) =>
      i === index ? { ...r, [campo]: valor } : r
    )
    onChange({ ...datos, roles: nuevosRoles })
  }

  function eliminarRol(index) {
    const nuevosRoles = datos.roles.filter((_, i) => i !== index)
    onChange({ ...datos, roles: nuevosRoles })
  }

  function actualizarJefatura(campo, valor) {
    onMovilJefatura({ ...movilJefatura, [campo]: valor })
  }

  const inputStyle = {
    width: '100%', padding: '0.45rem 0.75rem',
    borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'
  }
  const labelStyle = { fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }

  return (
    <div>
      {/* Datos generales */}
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Datos de la guardia</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>División</label>
            <input value={datos.division} onChange={e => actualizarCampo('division', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Fecha</label>
            <input type="date" value={datos.fecha} onChange={e => actualizarCampo('fecha', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Horario</label>
            <input value={datos.horario} onChange={e => actualizarCampo('horario', e.target.value)} placeholder="Ej: 07 a 14" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Roles */}
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Personal de guardia</p>
        {datos.roles.map((r, i) => (
          <div key={i} style={{ background: '#f5f5f3', borderRadius: '8px', padding: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px', alignItems: 'flex-end' }}>
              <div>
                <label style={labelStyle}>Rol</label>
                <select value={r.rol} onChange={e => actualizarRol(i, 'rol', e.target.value)} style={inputStyle}>
                  {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Efectivo</label>
                {r.usarNomina ? (
                  <select value={r.persona} onChange={e => actualizarRol(i, 'persona', e.target.value)} style={inputStyle}>
                    <option value="">-- seleccionar --</option>
                    {personal.map(p => (
                      <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={r.persona}
                    onChange={e => {
                      if (e.target.value === '__OTRO__') {
                        const nuevosRoles = datos.roles.map((r, idx) =>
                          idx === i ? { ...r, usarNomina: true, persona: '' } : r
                        )
                        onChange({ ...datos, roles: nuevosRoles })
                      } else {
                        actualizarRol(i, 'persona', e.target.value)
                      }
                    }}
                    style={inputStyle}
                  >
                    <option value="">-- seleccionar --</option>
                    {administrativos.map(p => (
                      <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                    ))}
                    <option value="__OTRO__">-- OTRO EFECTIVO --</option>
                  </select>
                )}
              </div>
              <button onClick={() => eliminarRol(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a32d2d', fontSize: '18px', paddingBottom: '4px' }}>✕</button>
            </div>
            {r.usarNomina && (
              <button
                onClick={() => {
                  const nuevosRoles = datos.roles.map((r, idx) =>
                    idx === i ? { ...r, usarNomina: false, persona: '' } : r
                  )
                  onChange({ ...datos, roles: nuevosRoles })
                }}
                style={{ marginTop: '6px', fontSize: '12px', color: '#185fa5', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
              >← Volver a lista reducida</button>
            )}
          </div>
        ))}
        <button
          onClick={agregarRol}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed #185fa5', background: 'none', color: '#185fa5', cursor: 'pointer', fontSize: '13px', marginTop: '0.5rem' }}
        >+ Agregar rol</button>
      </div>

      

      {/* Móvil de Jefatura */}
      <div style={{ border: '1.5px solid #185fa5', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#185fa5', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Móvil de Jefatura</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <div>
            <label style={labelStyle}>Móvil (interno)</label>
            <select style={inputStyle} value={movilJefatura.movil} onChange={e => actualizarJefatura('movil', e.target.value)}>
              <option value="">-- seleccionar --</option>
              {movilesData.map(mv => (
                <option key={mv.movil} value={mv.movil}>
                  {mv.movil} - {mv.dominio}{mv.estado !== 'NORMAL' ? ` [${mv.estado}]` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            {movilJefatura.movil && (
              <p style={{ fontSize: '12px', color: '#185fa5', marginTop: '1.5rem' }}>
                Dominio: <strong>{movilesData.find(x => x.movil === movilJefatura.movil)?.dominio}</strong>
              </p>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>Jefe</label>
          <select style={inputStyle} value={movilJefatura.jefe} onChange={e => actualizarJefatura('jefe', e.target.value)}>
            <option value="">-- seleccionar --</option>
            {administrativos.map(p => (
              <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>Chofer</label>
          <select style={inputStyle} value={movilJefatura.chofer} onChange={e => actualizarJefatura('chofer', e.target.value)}>
            <option value="">-- seleccionar --</option>
            {personal.map(p => (
              <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={labelStyle}>Rugger</label>
            <select style={inputStyle} value={movilJefatura.rugger} onChange={e => actualizarJefatura('rugger', e.target.value)}>
              <option value="">-- seleccionar --</option>
              {ruggers.map(r => (
                <option key={r.interno} value={`${r.interno} - ${r.linea}`}>{r.interno} - {r.linea}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Handy</label>
            <select style={inputStyle} value={movilJefatura.handy} onChange={e => actualizarJefatura('handy', e.target.value)}>
              <option value="">-- seleccionar --</option>
              {handys.map(h => (
                <option key={h.numero} value={h.numero}>{h.numero}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabGuardia