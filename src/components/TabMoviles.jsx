function TabMoviles({ personal, movilesData, moviles, onChange, ruggers, handys }) {

  function agregarMovil() {
    onChange([...moviles, {
      sector: '', movil: '', p1: '', p2: '', rugger: '', handy: '', obs: ''
    }])
  }

  function actualizarMovil(index, campo, valor) {
    onChange(moviles.map((m, i) => i === index ? { ...m, [campo]: valor } : m))
  }

  function eliminarMovil(index) {
    onChange(moviles.filter((_, i) => i !== index))
  }

  const inputStyle = {
    width: '90%', padding: '0.45rem 0.75rem',
    borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'
  }
  const labelStyle = { fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }

  return (
    <div>
      {moviles.map((m, i) => {
        const movilSeleccionado = movilesData.find(x => x.movil === m.movil)
        return (
          <div key={i} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: '600' }}>Móvil #{i + 1}</span>
              <button onClick={() => eliminarMovil(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a32d2d', fontSize: '18px' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label style={labelStyle}>Sector / Nombre</label>
                <input style={inputStyle} placeholder="Ej: QUEBRADA 4" value={m.sector} onChange={e => actualizarMovil(i, 'sector', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Móvil (interno)</label>
                <select style={inputStyle} value={m.movil} onChange={e => actualizarMovil(i, 'movil', e.target.value)}>
                  <option value="">-- seleccionar --</option>
                  {movilesData.map(mv => (
                    <option key={mv.movil} value={mv.movil}>
                      {mv.movil} - {mv.dominio}{mv.estado !== 'NORMAL' ? ` [${mv.estado}]` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {movilSeleccionado && (
              <p style={{ fontSize: '12px', color: '#185fa5', marginBottom: '8px' }}>
                Dominio: <strong>{movilSeleccionado.dominio}</strong>
              </p>
            )}

            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Jefe de Coche</label>
              <select style={inputStyle} value={m.p1} onChange={e => actualizarMovil(i, 'p1', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personal.map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Chofer</label>
              <select style={inputStyle} value={m.p2} onChange={e => actualizarMovil(i, 'p2', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personal.map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div>
                <label style={labelStyle}>Rugger</label>
                <select style={inputStyle} value={m.rugger} onChange={e => actualizarMovil(i, 'rugger', e.target.value)}>
                  <option value="">-- seleccionar --</option>
                  {ruggers.map(r => (
                    <option key={r.interno} value={`${r.interno} - ${r.linea}`}>
                      {r.interno} - {r.linea}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Handy</label>
                <select style={inputStyle} value={m.handy} onChange={e => actualizarMovil(i, 'handy', e.target.value)}>
                  <option value="">-- seleccionar --</option>
                  {handys.map(h => (
                    <option key={h.numero} value={h.numero}>
                      {h.numero}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Observación</label>
                <input style={inputStyle} placeholder="Ej: 🦎 RIESGO" value={m.obs} onChange={e => actualizarMovil(i, 'obs', e.target.value)} />
              </div>
            </div>
          </div>
        )
      })}

      <button
        onClick={agregarMovil}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed #185fa5', background: 'none', color: '#185fa5', cursor: 'pointer', fontSize: '13px' }}
      >+ Agregar móvil</button>
    </div>
  )
}

export default TabMoviles