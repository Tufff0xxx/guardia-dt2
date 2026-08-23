function TabBase({ movilesData, base, onChange, movilesActivos, movilJefatura }) {

  // Móviles ya usados en Móviles activos y Jefatura
  const movilesUsados = [
    movilJefatura?.movil,
    ...movilesActivos.map(m => m.movil)
  ].filter(Boolean)

  function agregar() {
    onChange([...base, { movil: '' }])
  }

  function actualizar(index, valor) {
    onChange(base.map((b, i) => i === index ? { movil: valor } : b))
  }

  function eliminar(index) {
    onChange(base.filter((_, i) => i !== index))
  }

  return (
    <div>
      {base.map((b, i) => {
        // Móviles usados en otras tarjetas de "en base"
        const usadosEnOtrasBase = base
          .filter((_, idx) => idx !== i)
          .map(x => x.movil)
          .filter(Boolean)

        const movilesDisponibles = movilesData.filter(mv =>
          !movilesUsados.includes(mv.movil) && !usadosEnOtrasBase.includes(mv.movil)
        )

        return (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Móvil en base</label>
              <select className="field-select" value={b.movil} onChange={e => actualizar(i, e.target.value)}>
                <option value="">-- seleccionar --</option>
                {movilesDisponibles.map(mv => (
                  <option key={mv.movil} value={mv.movil}>
                    {mv.movil} - {mv.dominio}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={() => eliminar(i)} className="btn-icon-delete">✕</button>
          </div>
        )
      })}

      <button onClick={agregar} className="btn-add">+ Agregar móvil en base</button>
    </div>
  )
}

export default TabBase
