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

  const inputStyle = {
    width: '90%', padding: '0.45rem 0.75rem',
    borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'
  }
  const labelStyle = { fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }

  return (
    <div>
      {fuera.map((f, i) => (
        <div key={i} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: '600' }}>Móvil fuera de servicio #{i + 1}</span>
            <button onClick={() => eliminar(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a32d2d', fontSize: '18px' }}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Interno</label>
              <select style={inputStyle} value={f.movil} onChange={e => actualizar(i, 'movil', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {movilesData.map(mv => (
                  <option key={mv.movil} value={mv.movil}>
                    {mv.movil} - {mv.dominio}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Desde</label>
              <input
                style={inputStyle}
                value={f.desde}
                onChange={e => actualizar(i, 'desde', e.target.value)}
                placeholder="Ej: 15/05/2026"
              />
            </div>
            <div>
              <label style={labelStyle}>Motivo</label>
              <input
                style={inputStyle}
                placeholder="Ej: sin pastillas de freno"
                value={f.motivo}
                onChange={e => actualizar(i, 'motivo', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={agregar}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed #185fa5', background: 'none', color: '#185fa5', cursor: 'pointer', fontSize: '13px' }}
      >+ Agregar móvil fuera de servicio</button>
    </div>
  )
}

export default TabFuera