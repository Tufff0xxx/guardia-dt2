function TabNovedades({ personal, novedades, onChange, companiaFiltro, onCompaniaChange }) {

  function companiaDeNovedad(persona) {
    try { return JSON.parse(persona)?.guardia } catch { return null }
  }

  const personalFiltrado = companiaFiltro
    ? personal.filter(p => p.guardia === companiaFiltro)
    : personal

  const novedadesFiltradas = companiaFiltro
  ? novedades.filter(n => companiaDeNovedad(n.persona) === companiaFiltro || !n.persona)
  : novedades

  function agregar() {
    onChange([...novedades, { persona: '', detalle: '', automatico: false }])
  }

  function actualizar(novedadOriginal, campo, valor) {
    onChange(novedades.map(n => n === novedadOriginal ? { ...n, [campo]: valor } : n))
  }

  function eliminar(novedadOriginal) {
    onChange(novedades.filter(n => n !== novedadOriginal))
  }

  return (
    <div>
      {/* Filtro de compañía */}
      <div className="card">
        <p className="card-title">Filtrar por compañía</p>
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
            ? `Mostrando ${novedadesFiltradas.length} novedades de compañía ${companiaFiltro}`
            : `Mostrando todas las novedades (${novedades.length})`}
        </p>
      </div>

      {novedadesFiltradas.map((n, i) => (
        <div key={i} className="card">
          <div className="card-row">
            <span style={{ fontWeight: '600' }}>
              Novedad #{i + 1}
              {n.automatico && (
                <span style={{ fontSize: '11px', color: '#3b6d11', background: '#eaf3de', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>
                  Automático
                </span>
              )}
            </span>
            <button onClick={() => eliminar(n)} className="btn-icon-delete">✕</button>
          </div>
          <div className="grid-1-2">
            <div className="field">
              <label className="field-label">Efectivo</label>
              <select className="field-select" value={n.persona} onChange={e => actualizar(n, 'persona', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personalFiltrado.map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Detalle</label>
              <input
                className="field-input"
                placeholder="Ej: ART 55 INC D 29/01 AL 28/07"
                value={n.detalle}
                onChange={e => actualizar(n, 'detalle', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={agregar} className="btn-add">+ Agregar novedad</button>
    </div>
  )
}

export default TabNovedades
