function Header({ estado }) {
  return (
    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
      <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', margin: 0 }}>División Territorial 2 — Carga de Guardia</h2>
      <p style={{ color: '#666', fontSize: '13px' }}>{estado}</p>
    </div>
  )
}

export default Header