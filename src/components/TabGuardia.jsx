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

  return (
    <div>
      {/* Datos generales */}
      <div className="card">
        <p className="card-title">Datos de la guardia</p>
        <div className="grid-3">
          <div className="field">
            <label className="field-label">División</label>
            <input className="field-input" value={datos.division} onChange={e => actualizarCampo('division', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Fecha</label>
            <input className="field-input" type="date" value={datos.fecha} onChange={e => actualizarCampo('fecha', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Horario</label>
            <input className="field-input" value={datos.horario} onChange={e => actualizarCampo('horario', e.target.value)} placeholder="Ej: 07 a 14" />
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="card">
        <p className="card-title">Personal de guardia</p>
        {datos.roles.map((r, i) => (
          <div key={i} style={{ background: '#f5f5f3', borderRadius: '8px', padding: '0.65rem', marginBottom: '0.5rem' }}>
            <div className="grid-role">
              <div className="field">
                <label className="field-label">Rol</label>
                <select className="field-select" value={r.rol} onChange={e => actualizarRol(i, 'rol', e.target.value)}>
                  {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Efectivo</label>
                {r.usarNomina ? (
                  <select className="field-select" value={r.persona} onChange={e => actualizarRol(i, 'persona', e.target.value)}>
                    <option value="">-- seleccionar --</option>
                    {personal.map(p => (
                      <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    className="field-select"
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
                  >
                    <option value="">-- seleccionar --</option>
                    {administrativos.map(p => (
                      <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                    ))}
                    <option value="__OTRO__">-- OTRO EFECTIVO --</option>
                  </select>
                )}
              </div>
              <button onClick={() => eliminarRol(i)} className="btn-icon-delete">✕</button>
            </div>
            {r.usarNomina && (
              <button
                onClick={() => {
                  const nuevosRoles = datos.roles.map((r, idx) =>
                    idx === i ? { ...r, usarNomina: false, persona: '' } : r
                  )
                  onChange({ ...datos, roles: nuevosRoles })
                }}
                className="link-btn"
              >← Volver a lista reducida</button>
            )}
          </div>
        ))}
        <button onClick={agregarRol} className="btn-add">+ Agregar rol</button>
      </div>

      {/* Móvil de Jefatura */}
      <div className="card-highlight">
        <p className="card-title-highlight">Móvil de Jefatura</p>

        <div className="grid-2">
          <div className="field">
            <label className="field-label">Móvil (interno)</label>
            <select className="field-select" value={movilJefatura.movil} onChange={e => actualizarJefatura('movil', e.target.value)}>
              <option value="">-- seleccionar --</option>
              {movilesData.map(mv => (
                <option key={mv.movil} value={mv.movil}>
                  {mv.movil} - {mv.dominio}{mv.estado !== 'NORMAL' ? ` [${mv.estado}]` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            {movilJefatura.movil && (
              <p style={{ fontSize: '12px', color: '#185fa5', marginTop: '1.5rem' }}>
                Dominio: <strong>{movilesData.find(x => x.movil === movilJefatura.movil)?.dominio}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="field" style={{ marginBottom: '8px' }}>
          <label className="field-label">Jefe</label>
          <select className="field-select" value={movilJefatura.jefe} onChange={e => actualizarJefatura('jefe', e.target.value)}>
            <option value="">-- seleccionar --</option>
            {administrativos.map(p => (
              <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
            ))}
          </select>
        </div>

        <div className="field" style={{ marginBottom: '8px' }}>
          <label className="field-label">Chofer</label>
          <select className="field-select" value={movilJefatura.chofer} onChange={e => actualizarJefatura('chofer', e.target.value)}>
            <option value="">-- seleccionar --</option>
            {personal.map(p => (
              <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label">Rugger</label>
            <select className="field-select" value={movilJefatura.rugger} onChange={e => actualizarJefatura('rugger', e.target.value)}>
              <option value="">-- seleccionar --</option>
              {ruggers.map(r => (
                <option key={r.interno} value={`${r.interno} - ${r.linea}`}>{r.interno} - {r.linea}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Handy</label>
            <select className="field-select" value={movilJefatura.handy} onChange={e => actualizarJefatura('handy', e.target.value)}>
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
