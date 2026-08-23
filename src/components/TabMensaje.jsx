function TabMensaje({ guardia, movilJefatura, movilesActivos, movilesData, fuera, base, novedades, infantes, companiaFiltroNovedades }) {

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

    let msg = '💠'.repeat(8) + '\n'
    msg += `*${division}*\n`
    msg += `*FECHA*: ${fecha}\n`
    msg += `*HORARIO*: ${horario}\n`

    if (guardia.roles.length) {
      guardia.roles.forEach(r => {
        const p = parsePerson(r.persona)
        if (p) {
          msg += `*${r.rol}*\n`
          msg += `${personLine(r.persona)}\n`
        }
      })
    }
    msg += '\n'

    if (movilJefatura.jefe) {
      const mv = movilesData.find(x => x.movil === movilJefatura.movil)
      const dominio = mv ? mv.dominio : ''
      msg += `*00) MÓVIL DE JEFATURA*\n`
      if (movilJefatura.movil) msg += `Movil *${dominio}* (${movilJefatura.movil})\n`
      msg += `${personLine(movilJefatura.jefe)}\n`
      if (movilJefatura.chofer) msg += `${personLine(movilJefatura.chofer)}\n`
      if (movilJefatura.rugger) msg += `Rugger: ${movilJefatura.rugger}\n`
      if (movilJefatura.handy) msg += `Handy: ${movilJefatura.handy}\n`
      msg += '\n'
    }

    movilesActivos
      .filter(m => m.movil || m.p1 || m.p2)
      .forEach((m, i) => {
        const mv = movilesData.find(x => x.movil === m.movil)
        const dominio = mv ? mv.dominio : ''
        const obsStr = m.obs ? ` ${m.obs}` : ''
        msg += `*${String(i + 1).padStart(2, '0')}) ${m.sector}*\n`
        if (m.movil) msg += `Movil *${dominio}* (${m.movil})${obsStr}\n`
        if (m.p1) msg += `${personLine(m.p1)}\n`
        if (m.p2) msg += `${personLine(m.p2)}\n`
        if (m.p3) msg += `${personLine(m.p3)}\n`
        if (m.rugger) msg += `Rugger: ${m.rugger}\n`
        if (m.handy) msg += `Handy: ${m.handy}\n`
        msg += '\n'
      })

    if (infantes.length) {
      msg += '*INFANTES*\n'
      infantes.forEach(inf => {
        msg += `${inf.sector}${inf.rugger ? ' Con Rugger ' + inf.rugger : ''}\n`
        if (inf.obs) msg += `(${inf.obs})\n`
        if (inf.e1) msg += `${personLine(inf.e1)}\n`
        if (inf.e2) msg += `${personLine(inf.e2)}\n`
        if (inf.e3) msg += `${personLine(inf.e3)}\n`
      })
      msg += '\n'
    }

    // Novedades filtradas por compañía
    function companiaDeNovedad(persona) {
      try { return JSON.parse(persona)?.guardia } catch { return null }
    }
    const novedadesFiltradas = companiaFiltroNovedades
      ? novedades.filter(n => companiaDeNovedad(n.persona) === companiaFiltroNovedades)
      : novedades

    if (novedadesFiltradas.length) {
      msg += '*NOVEDADES*\n'
      novedadesFiltradas.forEach(n => {
        const p = parsePerson(n.persona)
        if (p) msg += `▪️${p.efectivo || p.jerarquia + ' ' + p.nombre} ${p.dni} ${n.detalle}\n`
      })
      msg += '\n'
    }

    if (fuera.length) {
      msg += `❌*MOVILES FUERA DE SERVICIO ${fuera.length}*❌\n`
      fuera.forEach(f => {
        const mv = movilesData.find(x => x.movil === f.movil)
        const dom = mv ? mv.dominio : ''
        msg += `-INTERNO ${f.movil} DOMINIO ${dom} (${f.motivo.toUpperCase()}${f.desde ? ' DESDE ' + f.desde : ''})\n`
      })
      msg += '\n'
    }

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
      <div className="card">
        <div className="output-actions">
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Mensaje generado</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('output').textContent = generarTexto()}
              style={{ padding: '0.6rem 1rem', minHeight: '44px', borderRadius: '8px', border: '1.5px solid #333', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
            >⚡ Generar</button>
            <button
              onClick={copiar}
              style={{ padding: '0.6rem 1rem', minHeight: '44px', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
            >📋 Copiar</button>
          </div>
        </div>
        <pre id="output" className="output-box">
          El mensaje aparecerá aquí...
        </pre>
      </div>
    </div>
  )
}

export default TabMensaje