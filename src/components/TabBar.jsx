const TABS = [
  { id: 'guardia', label: 'Guardia' },
  { id: 'moviles', label: 'Móviles' },
  { id: 'infantes', label: 'Infantes' },
  { id: 'fuera', label: 'Fuera de servicio' },
  { id: 'base', label: 'En base' },
  { id: 'novedades', label: 'Novedades' },
  { id: 'mensaje', label: 'Mensaje' },
]

function TabBar({ tabActiva, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            background: tabActiva === tab.id ? '#fff' : '#f5f5f3',
            fontWeight: tabActiva === tab.id ? '600' : 'normal',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabBar