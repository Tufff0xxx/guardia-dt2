function TabMoviles({ personal, movilesData, moviles, onChange, ruggers, handys, companiaFiltro, onCompaniaChange, movilJefatura, infantes }) {

  const personalFiltrado = companiaFiltro
    ? personal.filter(p => p.guardia === companiaFiltro)
    : personal

  // Ruggers ya usados en jefatura e infantes
  const ruggersUsadosGlobal = [
    movilJefatura?.rugger,
    ...infantes.map(inf => inf.rugger)
  ].filter(Boolean)

  // Handys ya usados en jefatura e infantes
  const handysUsadosGlobal = [
    movilJefatura?.handy,
    ...infantes.map(inf => inf.handy)
  ].filter(Boolean)

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
      {/* Filtro de compañía */}
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Filtrar personal por compañía</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', '1º', '2º', '3º'].map(c => (
            <button
              key={c}
              onClick={() => onCompaniaChange(c)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: companiaFiltro === c ? '#185fa5' : '#f5f5f3',
                color: companiaFiltro === c ? '#fff' : '#1a1a18',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: companiaFiltro === c ? '600' : 'normal'
              }}
            >
              {c === '' ? 'Todos' : `Compañía ${c}`}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
          {companiaFiltro
            ? `Mostrando ${personalFiltrado.length} efectivos de compañía ${companiaFiltro}`
            : `Mostrando todos los efectivos (${personal.length})`}
        </p>
      </div>

      {moviles.map((m, i) => {
        const movilSeleccionado = movilesData.find(x => x.movil === m.movil)

        const efectivosUsados = moviles
          .filter((_, idx) => idx !== i)
          .flatMap(mv => {
            const d1 = (() => { try { return JSON.parse(mv.p1)?.dni } catch { return null } })()
            const d2 = (() => { try { return JSON.parse(mv.p2)?.dni } catch { return null } })()
            return [d1, d2]
          })
          .filter(Boolean)

        const movilesUsados = moviles
          .filter((_, idx) => idx !== i)
          .map(mv => mv.movil)
          .filter(Boolean)

        const personalDisponible = personalFiltrado.filter(p => !efectivosUsados.includes(p.dni))
        const movilesDisponibles = movilesData.filter(mv => !movilesUsados.includes(mv.movil))

        // Ruggers usados en otros móviles + jefatura + infantes
        const ruggersUsadosEnOtros = [
          ...moviles.filter((_, idx) => idx !== i).map(mv => mv.rugger),
          ...ruggersUsadosGlobal
        ].filter(Boolean)

        // Handys usados en otros móviles + jefatura + infantes
        const handysUsadosEnOtros = [
          ...moviles.filter((_, idx) => idx !== i).map(mv => mv.handy),
          ...handysUsadosGlobal
        ].filter(Boolean)

        const ruggersDisponibles = ruggers.filter(r => !ruggersUsadosEnOtros.includes(`${r.interno} - ${r.linea}`))
        const handysDisponibles = handys.filter(h => !handysUsadosEnOtros.includes(h.numero))

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
                  {movilesDisponibles.map(mv => (
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
                {personalDisponible.map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Chofer</label>
              <select style={inputStyle} value={m.p2} onChange={e => actualizarMovil(i, 'p2', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personalDisponible.filter(p => {
                  try { return JSON.parse(m.p1)?.dni !== p.dni } catch { return true }
                }).map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div>
                <label style={labelStyle}>Rugger</label>
                <select style={inputStyle} value={m.rugger} onChange={e => actualizarMovil(i, 'rugger', e.target.value)}>
                  <option value="">-- seleccionar --</option>
                  {ruggersDisponibles.map(r => (
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
                  {handysDisponibles.map(h => (
                    <option key={h.numero} value={h.numero}>{h.numero}</option>
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