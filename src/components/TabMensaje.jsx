function TabMensaje({ guardia, movilJefatura, movilesActivos, movilesData, fuera, base, novedades }) {

  function formatFecha(d) {
    if (!d) return ''
    const [y, m, dd] = d.split('-')
    return `${dd}/${m}/${y}`
  }

  function parsePerson(val) {
    try { return JSON.parse(val) } catch { return null }
  }

  function personLine(val) {
    const p = parsePerson(val)
    if (!p) return '▪️(sin asignar)'
    return `▪️${p.efectivo || p.jerarquia + ' ' + p.nombre}${p.dni ? ' DNI ' + p.dni : ''}`
  }

  function generarTexto() {
    const division = guardia.division || 'DIVISION TERRITORIAL 2'
    const fecha = formatFecha(guardia.fecha)
    const horario = guardia.horario || ''
    const casilla = guardia.casilla || ''

    let msg = '💠'.repeat(8) + '\n'
    msg += `*${division}*\n`
    msg += `*FECHA*: ${fecha}\n`
    msg += `*HORARIO*: ${horario}\n`

    // Roles de guardia
    if (guardia.roles.length) {
      guardia.roles.forEach(r => {
        msg += `*${r.rol}*\n`
        msg += `${personLine(r.persona)}\n`
      })
    }

    if (casilla) msg += `*${casilla}*\n`
    msg += '\n'

    // Móvil de jefatura
    if (movilJefatura.movil || movilJefatura.jefe) {
      const mv = movilesData.find(x => x.movil === movilJefatura.movil)
      const dominio = mv ? mv.dominio : ''
      msg += `*00) MÓVIL DE JEFATURA*\n`
      if (movilJefatura.movil) msg += `Movil *${dominio}* (${movilJefatura.movil})\n`
      msg += `${personLine(movilJefatura.jefe)}\n`
      msg += `${personLine(movilJefatura.chofer)}\n`
      msg += `Rugger: ${movilJefatura.rugger}\n`
      msg += `Handy: ${movilJefatura.handy}\n\n`
    }

    // Móviles activos
    movilesActivos.forEach((m, i) => {
      const mv = movilesData.find(x => x.movil === m.movil)
      const dominio = mv ? mv.dominio : ''
      const obsStr = m.obs ? ` ${m.obs}` : ''
      msg += `*${String(i + 1).padStart(2, '0')}) ${m.sector}*\n`
      if (m.movil) msg += `Movil *${dominio}* (${m.movil})${obsStr}\n`
      msg += `${personLine(m.p1)}\n`
      msg += `${personLine(m.p2)}\n`
      msg += `Rugger: ${m.rugger}\n`
      msg += `Handy: ${m.handy}\n\n`
    })

    // Novedades
    if (novedades.length) {
      msg += '*NOVEDADES*\n'
      novedades.forEach(n => {
        const p = parsePerson(n.persona)
        if (p) msg += `▪️${p.efectivo || p.jerarquia + ' ' + p.nombre} ${p.dni} ${n.detalle}\n`
      })
      msg += '\n'
    }

    // Fuera de servicio
    if (fuera.length) {
      msg += `❌*MOVILES FUERA DE SERVICIO ${fuera.length}*❌\n`
      fuera.forEach(f => {
        const mv = movilesData.find(x => x.movil === f.movil)
        const dom = mv ? mv.dominio : ''
        msg += `-INTERNO ${f.movil} DOMINIO ${dom} (${f.motivo.toUpperCase()}${f.desde ? ' DESDE ' + f.desde : ''})\n`
      })
      msg += '\n'
    }

    // En base
    if (base.length) {
      msg += '*MOVILES EN BASE*\n'
      base.forEach(b => {
        const mv = movilesData.find(x => x.movil === b.movil)
        const dom = mv ? mv.dominio : ''
        msg += `Movil *${b.movil}* ${dom}\n`
      })
    }

    return msg
  }

  async function copiar() {
    const texto = generarTexto()
    try {
      await navigator.clipboard.writeText(texto)
      alert('¡Mensaje copiado!')
    } catch {
      alert('No se pudo copiar, seleccioná el texto manualmente.')
    }
  }

  return (
    <div>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Mensaje generado</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => document.getElementById('output').textContent = generarTexto()}
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1.5px solid #333', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
            >⚡ Generar</button>
            <button
              onClick={copiar}
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
            >📋 Copiar</button>
          </div>
        </div>
        <pre id="output" style={{ background: '#f5f5f3', borderRadius: '8px', padding: '1rem', fontSize: '12px', lineHeight: '1.7', whiteSpace: 'pre-wrap', maxHeight: '450px', overflowY: 'auto', color: '#1a1a18' }}>
          El mensaje aparecerá aquí...
        </pre>
      </div>
    </div>
  )
}

export default TabMensaje