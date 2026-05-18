function TabNovedades({ personal, novedades, onChange }) {

  function agregar() {
    onChange([...novedades, { persona: '', detalle: '' }])
  }

  function actualizar(index, campo, valor) {
    onChange(novedades.map((n, i) => i === index ? { ...n, [campo]: valor } : n))
  }

  function eliminar(index) {
    onChange(novedades.filter((_, i) => i !== index))
  }

  const inputStyle = {
    width: '90%', padding: '0.45rem 0.75rem',
    borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'
  }
  const labelStyle = { fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }

  return (
    <div>
      {novedades.map((n, i) => (
        <div key={i} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: '600' }}>Novedad #{i + 1}</span>
            <button onClick={() => eliminar(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a32d2d', fontSize: '18px' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Efectivo</label>
              <select style={inputStyle} value={n.persona} onChange={e => actualizar(i, 'persona', e.target.value)}>
                <option value="">-- seleccionar --</option>
                {personal.map(p => (
                  <option key={p.dni} value={JSON.stringify(p)}>{p.efectivo}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Detalle</label>
              <input
                style={inputStyle}
                placeholder="Ej: ART 55 INC D 29/01 AL 28/07"
                value={n.detalle}
                onChange={e => actualizar(i, 'detalle', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={agregar}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed #185fa5', background: 'none', color: '#185fa5', cursor: 'pointer', fontSize: '13px' }}
      >+ Agregar novedad</button>
    </div>
  )
}

export default TabNovedades