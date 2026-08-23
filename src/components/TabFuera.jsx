function TabFuera({ movilesData, fuera, onChange }) {

  function agregar() {
    onChange([...fuera, { movil: '', motivo: '', desde: '' }])
  }

  function actualizar(index, campo, valor) {
    onChange(fuera.map((f, i) => i === index ? { ...f, [campo]: valor } : f))
  }

  function eliminar(index) {
    onChange(fuera.filter((_, i) => i !== index))
  }

  return (
    <div>
      {fuera.map((f, i) => (
        <div key={i} className="card">
          <div className="card-row">
            <span style={{ fontWeight: '600' }}>Móvil fuera de servicio #{i + 1}</span>
            <button onClick={() => eliminar(i)} className="btn-icon-delete">✕</button>
          </div>

          <div className="grid-3">
            <div className="field">
              <label className="field-label">Interno</label>
              <select className="field-select" value={f.movil} onChange={e => actualizar(i, 'movil', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {movilesData.map(mv => (
                  <option key={mv.movil} value={mv.movil}>
                    {mv.movil} - {mv.dominio}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Desde</label>
              <input
                className="field-input"
                value={f.desde}
                onChange={e => actualizar(i, 'desde', e.target.value)}
                placeholder="Ej: 15/05/2026"
              />
            </div>
            <div className="field">
              <label className="field-label">Motivo</label>
              <input
                className="field-input"
                placeholder="Ej: sin pastillas de freno"
                value={f.motivo}
                onChange={e => actualizar(i, 'motivo', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={agregar} className="btn-add">+ Agregar móvil fuera de servicio</button>
    </div>
  )
}

export default TabFuera
