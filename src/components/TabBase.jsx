function TabBase({ movilesData, base, onChange }) {

  function agregar() {
    onChange([...base, { movil: '' }])
  }

  function actualizar(index, valor) {
    onChange(base.map((b, i) => i === index ? { movil: valor } : b))
  }

  function eliminar(index) {
    onChange(base.filter((_, i) => i !== index))
  }

  const inputStyle = {
    width: '90%', padding: '0.45rem 0.75rem',
    borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'
  }
  const labelStyle = { fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }

  return (
    <div>
      {base.map((b, i) => (
        <div key={i} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Móvil en base</label>
            <select style={inputStyle} value={b.movil} onChange={e => actualizar(i, e.target.value)}>
              <option value="">-- seleccionar --</option>
              {movilesData.map(mv => (
                <option key={mv.movil} value={mv.movil}>
                  {mv.movil} - {mv.dominio}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => eliminar(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a32d2d', fontSize: '18px', paddingBottom: '6px' }}>✕</button>
        </div>
      ))}

      <button
        onClick={agregar}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed #185fa5', background: 'none', color: '#185fa5', cursor: 'pointer', fontSize: '13px' }}
      >+ Agregar móvil en base</button>
    </div>
  )
}

export default TabBase