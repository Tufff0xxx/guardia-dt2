function TabMoviles({ personal, movilesData, moviles, onChange, ruggers, handys, companiaFiltro, onCompaniaChange, movilJefatura, infantes }) {

  const personalFiltrado = companiaFiltro
    ? personal.filter(p => p.guardia === companiaFiltro)
    : personal

  const ruggersUsadosGlobal = [
    movilJefatura?.rugger,
    ...infantes.map(inf => inf.rugger)
  ].filter(Boolean)

  const handysUsadosGlobal = [
    movilJefatura?.handy,
    ...infantes.map(inf => inf.handy)
  ].filter(Boolean)

  function agregarMovil() {
    onChange([...moviles, {
      sector: '', movil: '', p1: '', p2: '', p3: '', rugger: '', handy: '', obs: ''
    }])
  }

  function actualizarMovil(index, campo, valor) {
    onChange(moviles.map((m, i) => i === index ? { ...m, [campo]: valor } : m))
  }

  function eliminarMovil(index) {
    onChange(moviles.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">Filtrar personal por compañía</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', '1º', '2º', '3º'].map(c => (
            <button
              key={c}
              onClick={() => onCompaniaChange(c)}
              className="chip-btn"
              style={{
                background: companiaFiltro === c ? '#185fa5' : '#f5f5f3',
                color: companiaFiltro === c ? '#fff' : '#1a1a18',
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
            const d3 = (() => { try { return JSON.parse(mv.p3)?.dni } catch { return null } })()
            return [d1, d2, d3]
          })
          .filter(Boolean)

        const movilesUsados = moviles
          .filter((_, idx) => idx !== i)
          .map(mv => mv.movil)
          .filter(Boolean)

        const personalDisponible = personalFiltrado.filter(p => !efectivosUsados.includes(p.dni))
        const movilesDisponibles = movilesData.filter(mv => !movilesUsados.includes(mv.movil))

        const ruggersUsadosEnOtros = [
          ...moviles.filter((_, idx) => idx !== i).map(mv => mv.rugger),
          ...ruggersUsadosGlobal
        ].filter(Boolean)

        const handysUsadosEnOtros = [
          ...moviles.filter((_, idx) => idx !== i).map(mv => mv.handy),
          ...handysUsadosGlobal
        ].filter(Boolean)

        const ruggersDisponibles = ruggers.filter(r => !ruggersUsadosEnOtros.includes(`${r.interno} - ${r.linea}`))
        const handysDisponibles = handys.filter(h => !handysUsadosEnOtros.includes(h.numero))

        const p1Dni = (() => { try { return JSON.parse(m.p1)?.dni } catch { return null } })()
        const p2Dni = (() => { try { return JSON.parse(m.p2)?.dni } catch { return null } })()

        return (
          <div key={i} className="card">
            <div className="card-row">
              <span style={{ fontWeight: '600' }}>Móvil #{i + 1}</span>
              <button onClick={() => eliminarMovil(i)} className="btn-icon-delete">✕</button>
            </div>

            <div className="grid-2">
              <div className="field">
                <label className="field-label">Sector / Nombre</label>
                <input className="field-input" placeholder="Ej: QUEBRADA 4" value={m.sector} onChange={e => actualizarMovil(i, 'sector', e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Móvil (interno)</label>
                <select className="field-select" value={m.movil} onChange={e => actualizarMovil(i, 'movil', e.target.value)}>
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

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Jefe de Coche</label>
              <select className="field-select" value={m.p1} onChange={e => actualizarMovil(i, 'p1', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personalDisponible.map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Chofer</label>
              <select className="field-select" value={m.p2} onChange={e => actualizarMovil(i, 'p2', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personalDisponible.filter(p => p.dni !== p1Dni).map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Efectivo 3 (opcional)</label>
              <select className="field-select" value={m.p3} onChange={e => actualizarMovil(i, 'p3', e.target.value)}>
                <option value="">-- sin asignar --</option>
                {personalDisponible.filter(p => p.dni !== p1Dni && p.dni !== p2Dni).map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div className="grid-3">
              <div className="field">
                <label className="field-label">Rugger</label>
                <select className="field-select" value={m.rugger} onChange={e => actualizarMovil(i, 'rugger', e.target.value)}>
                  <option value="">-- seleccionar --</option>
                  {ruggersDisponibles.map(r => (
                    <option key={r.interno} value={`${r.interno} - ${r.linea}`}>
                      {r.interno} - {r.linea}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Handy</label>
                <select className="field-select" value={m.handy} onChange={e => actualizarMovil(i, 'handy', e.target.value)}>
                  <option value="">-- seleccionar --</option>
                  {handysDisponibles.map(h => (
                    <option key={h.numero} value={h.numero}>{h.numero}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Observación</label>
                <input className="field-input" placeholder="Ej: 🦎 RIESGO" value={m.obs} onChange={e => actualizarMovil(i, 'obs', e.target.value)} />
              </div>
            </div>
          </div>
        )
      })}

      <button onClick={agregarMovil} className="btn-add">+ Agregar móvil</button>
    </div>
  )
}

export default TabMoviles
