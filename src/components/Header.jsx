function Header({ estado }) {
  return (
    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
      <h2>División Territorial 2 — Carga de Guardia</h2>
      <p style={{ color: '#666', fontSize: '13px' }}>{estado}</p>
    </div>
  )
}

export default Header