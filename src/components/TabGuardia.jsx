const ROLES = [
  'JEFE DE GUARDIA',
  'AYUDANTE DE GUARDIA',
  'ADMINISTRATIVO',
  'ARMERO',
  'LOGÍSTICO',
  'PUESTO 1',
  'OTRO'
]

function TabGuardia({ personal, administrativos, datos, onChange }) {

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
                <select
                  value={r.rol}
                  onChange={e => actualizarRol(i, 'rol', e.target.value)}
                  style={inputStyle}
                >
                  {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Efectivo</label>
                {r.usarNomina ? (
                  <select
                    value={r.persona}
                    onChange={e => actualizarRol(i, 'persona', e.target.value)}
                    style={inputStyle}
                  >
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
              <button
                onClick={() => eliminarRol(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a32d2d', fontSize: '18px', paddingBottom: '4px' }}
              >✕</button>
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

      {/* Casilla */}
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Casilla / Sector</p>
        <input
          value={datos.casilla}
          onChange={e => actualizarCampo('casilla', e.target.value)}
          placeholder="Ej: CASILLA CONGRESO – CUBRE DT 22"
          style={inputStyle}
        />
      </div>
    </div>
  )
}

export default TabGuardia