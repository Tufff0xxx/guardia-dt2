function TabInfantes({ personal, ruggers, handys, infantes, onChange, movilesActivos, movilJefatura, companiaFiltro, onCompaniaChange }) {

  const personalFiltrado = companiaFiltro
    ? personal.filter(p => p.guardia === companiaFiltro)
    : personal

  const efectivosEnMoviles = movilesActivos.flatMap(m => {
  const d1 = (() => { try { return JSON.parse(m.p1)?.dni } catch { return null } })()
  const d2 = (() => { try { return JSON.parse(m.p2)?.dni } catch { return null } })()
  const d3 = (() => { try { return JSON.parse(m.p3)?.dni } catch { return null } })()
  return [d1, d2, d3]
}).filter(Boolean)

  // Ruggers usados en móviles y jefatura
  const ruggersUsadosGlobal = [
    movilJefatura?.rugger,
    ...movilesActivos.map(m => m.rugger)
  ].filter(Boolean)

  // Handys usados en móviles y jefatura
  const handysUsadosGlobal = [
    movilJefatura?.handy,
    ...movilesActivos.map(m => m.handy)
  ].filter(Boolean)

  function efectivosUsadosEnOtros(index) {
    return infantes
      .filter((_, idx) => idx !== index)
      .flatMap(inf => {
        const d1 = (() => { try { return JSON.parse(inf.e1)?.dni } catch { return null } })()
        const d2 = (() => { try { return JSON.parse(inf.e2)?.dni } catch { return null } })()
        const d3 = (() => { try { return JSON.parse(inf.e3)?.dni } catch { return null } })()
        return [d1, d2, d3]
      })
      .filter(Boolean)
  }

  function agregar() {
    onChange([...infantes, { sector: '', obs: '', rugger: '', handy: '', e1: '', e2: '', e3: '' }])
  }

  function actualizar(index, campo, valor) {
    onChange(infantes.map((inf, i) => i === index ? { ...inf, [campo]: valor } : inf))
  }

  function eliminar(index) {
    onChange(infantes.filter((_, i) => i !== index))
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

      {infantes.map((inf, i) => {
        const usadosEnOtros = efectivosUsadosEnOtros(i)
        const todosUsados = [...efectivosEnMoviles, ...usadosEnOtros]
        const e1Dni = (() => { try { return JSON.parse(inf.e1)?.dni } catch { return null } })()
        const e2Dni = (() => { try { return JSON.parse(inf.e2)?.dni } catch { return null } })()
        const personalDisponible = personalFiltrado.filter(p => !todosUsados.includes(p.dni))

        // Ruggers usados en otros infantes + global
        const ruggersUsadosEnOtros = [
          ...infantes.filter((_, idx) => idx !== i).map(inf => inf.rugger),
          ...ruggersUsadosGlobal
        ].filter(Boolean)

        // Handys usados en otros infantes + global
        const handysUsadosEnOtros = [
          ...infantes.filter((_, idx) => idx !== i).map(inf => inf.handy),
          ...handysUsadosGlobal
        ].filter(Boolean)

        const ruggersDisponibles = ruggers.filter(r => !ruggersUsadosEnOtros.includes(`${r.interno} - ${r.linea}`))
        const handysDisponibles = handys.filter(h => !handysUsadosEnOtros.includes(h.numero))

        return (
          <div key={i} className="card">
            <div className="card-row">
              <span style={{ fontWeight: '600' }}>Infante #{i + 1}</span>
              <button onClick={() => eliminar(i)} className="btn-icon-delete">✕</button>
            </div>

            <div className="grid-2">
              <div className="field">
                <label className="field-label">Sector</label>
                <input className="field-input" placeholder="Ej: CHATEAU 30" value={inf.sector} onChange={e => actualizar(i, 'sector', e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Rugger</label>
                <select className="field-select" value={inf.rugger} onChange={e => actualizar(i, 'rugger', e.target.value)}>
                  <option value="">-- seleccionar --</option>
                  {ruggersDisponibles.map(r => (
                    <option key={r.interno} value={`${r.interno} - ${r.linea}`}>
                      {r.interno} - {r.linea}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Observación</label>
              <input className="field-input" placeholder="Ej: Teniendo en cuenta..." value={inf.obs} onChange={e => actualizar(i, 'obs', e.target.value)} />
            </div>

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Handy</label>
              <select className="field-select" value={inf.handy} onChange={e => actualizar(i, 'handy', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {handysDisponibles.map(h => (
                  <option key={h.numero} value={h.numero}>{h.numero}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Efectivo 1</label>
              <select className="field-select" value={inf.e1} onChange={e => actualizar(i, 'e1', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personalDisponible.map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Efectivo 2</label>
              <select className="field-select" value={inf.e2} onChange={e => actualizar(i, 'e2', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personalDisponible.filter(p => p.dni !== e1Dni).map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginBottom: '8px' }}>
              <label className="field-label">Efectivo 3 (opcional)</label>
              <select className="field-select" value={inf.e3} onChange={e => actualizar(i, 'e3', e.target.value)}>
                <option value="">-- sin asignar --</option>
                {personalDisponible.filter(p => p.dni !== e1Dni && p.dni !== e2Dni).map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>
          </div>
        )
      })}

      <button onClick={agregar} className="btn-add">+ Agregar infante</button>
    </div>
  )
}

export default TabInfantes
