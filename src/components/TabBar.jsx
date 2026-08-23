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
    <div className="tab-bar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="chip-btn"
          style={{
            background: tabActiva === tab.id ? '#fff' : '#f5f5f3',
            fontWeight: tabActiva === tab.id ? '600' : 'normal',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabBar
