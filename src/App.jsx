import { useState, useEffect } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import TabGuardia from './components/TabGuardia'
import TabMoviles from './components/TabMoviles'
import TabFuera from './components/TabFuera'
import TabBase from './components/TabBase'
import TabNovedades from './components/TabNovedades'
import TabInfantes from './components/TabInfantes'
import { guardarBorrador, cargarBorrador } from './firebase'
import TabMensaje from './components/TabMensaje'

const SHEET_ID = '1fIZCewChVYl1oXmYsTLSeINtYj0Sr5--K3r11YBdwzM'
const API_KEY = 'AIzaSyCVLH6YMTyytuVDkICayvjxtTow8t0l3cY'

const hoy = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function App() {
  const [personal, setPersonal] = useState([])
  const [movilesData, setMovilesData] = useState([])
  const [estado, setEstado] = useState('Cargando datos...')
  const [tabActiva, setTabActiva] = useState('guardia')
  const [ruggers, setRuggers] = useState([])
  const [handys, setHandys] = useState([])
  const [fuera, setFuera] = useState([])
  const [base, setBase] = useState([])
  const [novedades, setNovedades] = useState([])
  const [administrativos, setAdministrativos] = useState([])
  const [companiaFiltro, setCompaniaFiltro] = useState('')
  const [infantes, setInfantes] = useState([])
  const [companiaFiltroInfantes, setCompaniaFiltroInfantes] = useState('')
  const [movilJefatura, setMovilJefatura] = useState({
  movil: '', jefe: '', chofer: '', rugger: '', handy: ''
  })
  const [companiaFiltroNovedades, setCompaniaFiltroNovedades] = useState('')
  const [movilesActivos, setMovilesActivos] = useState([
  { sector: '', movil: '', p1: '', p2: '', rugger: '',p3: '', handy: '', obs: '' }
  
])

  async function handleGuardarBorrador() {
  const datos = {
    guardia,
    movilesActivos,
    movilJefatura,
    fuera,
    base,
    novedades
  }
  const ok = await guardarBorrador(datos)
  alert(ok ? '✅ Borrador guardado correctamente' : '❌ Error al guardar')
}

async function handleCargarBorrador() {
  const datos = await cargarBorrador()
  if (!datos) { alert('No hay borrador guardado'); return }
  if (datos.guardia) setGuardia(datos.guardia)
  if (datos.movilesActivos) setMovilesActivos(datos.movilesActivos)
  if (datos.movilJefatura) setMovilJefatura(datos.movilJefatura)
  if (datos.fuera) setFuera(datos.fuera)
  if (datos.base) setBase(datos.base)
  if (datos.novedades) setNovedades(datos.novedades)
  alert('✅ Borrador cargado correctamente')
}

  async function handleGuardarBorrador() {
  const datos = {
    guardia,
    movilesActivos,
    movilJefatura,
    fuera,
    base,
    novedades,
    infantes
  }
  const ok = await guardarBorrador(datos)
  alert(ok ? '✅ Borrador guardado correctamente' : '❌ Error al guardar')
}

async function handleCargarBorrador() {
  const datos = await cargarBorrador()
  if (!datos) { alert('No hay borrador guardado'); return }
  if (datos.guardia) setGuardia(datos.guardia)
  if (datos.movilesActivos) setMovilesActivos(datos.movilesActivos)
  if (datos.movilJefatura) setMovilJefatura(datos.movilJefatura)
  if (datos.fuera) setFuera(datos.fuera)
  if (datos.base) setBase(datos.base)
  if (datos.novedades) setNovedades(datos.novedades)
  if (datos.infantes) setInfantes(datos.infantes)
  alert('✅ Borrador cargado correctamente')
}

  const [guardia, setGuardia] = useState({
    division: 'DIVISION TERRITORIAL 2',
    fecha: hoy(),
    horario: '',
    roles: [{ rol: 'JEFE DE GUARDIA', persona: '' }],
  })

  useEffect(() => {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`
  Promise.all([
    fetch(`${base}/NOMINA?key=${API_KEY}`).then(r => r.json()),
    fetch(`${base}/MOVILES?key=${API_KEY}`).then(r => r.json()),
    fetch(`${base}/RUGGEAR?key=${API_KEY}`).then(r => r.json()),
    fetch(`${base}/HANDY?key=${API_KEY}`).then(r => r.json()),
    fetch(`${base}/ADMINISTRATIVOS?key=${API_KEY}`).then(r => r.json()),
    ]).then(([dp, dm, dr, dh, da]) => {
  
    const listaPersonal = dp.values.slice(1)
      .map(r => ({
      dni: (r[1] || '').toString().replace(/,/g, '').trim(),
      jerarquia: r[2] || '',
      nombre: r[3] || '',
      efectivo: r[0] || '',
      guardia: r[5] || ''   // ← esta línea
    }))

    const listaAdministrativos = da.values.slice(1)
    .filter(r => r[2] && r[3])
    .map(r => ({
    dni: (r[1] || '').toString().replace(/,/g, '').trim(),
    jerarquia: r[2] || '',
    nombre: r[3] || '',
    efectivo: r[0] || ''
  }))

setAdministrativos(listaAdministrativos)

    const listaMoviles = dm.values.slice(1)
      .filter(r => r[0])
      .map(r => ({
        movil: r[0].toString().trim(),
        dominio: (r[1] || '').trim(),
        estado: r[4] || 'NORMAL',
        motivo: r[5] || '',
        desde: r[6] || ''
      }))
      const listaFuera = listaMoviles
        .filter(m => m.estado !== 'NORMAL')
        .map(m => ({
          movil: m.movil,
          motivo: m.motivo,
          desde: m.desde
  }))
    const listaRugger = dr.values.slice(1)
      .filter(r => r[0])
      .map(r => ({
        interno: r[0].toString().trim(),
        linea: (r[1] || '').toString().trim()
      }))
    const listaHandy = dh.values.slice(1)
      .filter(r => r[0])
      .map(r => ({
        numero: r[0].toString().trim()
      }))

    setPersonal(listaPersonal)
    setMovilesData(listaMoviles)
    setFuera(listaFuera)
    setRuggers(listaRugger)
    setHandys(listaHandy)
    setEstado(`${listaPersonal.length} efectivos · ${listaMoviles.length} móviles cargados`)
  }).catch(() => setEstado('⚠️ Error al conectar con Google Sheets'))
}, [])

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem' }}>
      <Header estado={estado} />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
  <button
    onClick={handleGuardarBorrador}
    style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid #3b6d11', background: '#eaf3de', color: '#3b6d11', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
  >💾 Guardar borrador</button>
  <button
    onClick={handleCargarBorrador}
    style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid #185fa5', background: '#e6f1fb', color: '#185fa5', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
  >📂 Cargar borrador</button>
</div>
      <TabBar tabActiva={tabActiva} onChange={setTabActiva} />
     
      {tabActiva === 'moviles' && (
    <TabMoviles
    personal={personal}
    movilesData={movilesData}
    moviles={movilesActivos}
    onChange={setMovilesActivos}
    ruggers={ruggers}
    handys={handys}
    companiaFiltro={companiaFiltro}
    onCompaniaChange={setCompaniaFiltro}
    movilJefatura={movilJefatura}
    infantes={infantes}
  />
)}

  {tabActiva === 'fuera' && (
  <TabFuera
    movilesData={movilesData}
    fuera={fuera}
    onChange={setFuera}
  />
)}
  {tabActiva === 'base' && (
    <TabBase
      movilesData={movilesData}
      base={base}
      onChange={setBase}
  />
)}
  {tabActiva === 'novedades' && (
  <TabNovedades
    personal={personal}
    novedades={novedades}
    onChange={setNovedades}
    companiaFiltro={companiaFiltroNovedades}
    onCompaniaChange={setCompaniaFiltroNovedades}
  />
)}
  {tabActiva === 'mensaje' && (
  <TabMensaje
    guardia={guardia}
    movilJefatura={movilJefatura}
    movilesActivos={movilesActivos}
    movilesData={movilesData}
    fuera={fuera}
    base={base}
    novedades={novedades}
    infantes={infantes}
  />
  )}
    {tabActiva === 'guardia' && (
  <TabGuardia
    personal={personal}
    administrativos={administrativos}
    datos={guardia}
    onChange={setGuardia}
    movilJefatura={movilJefatura}
    onMovilJefatura={setMovilJefatura}
    movilesData={movilesData}
    ruggers={ruggers}
    handys={handys}
  />
)}

  {tabActiva === 'infantes' && (
  <TabInfantes
    personal={personal}
    ruggers={ruggers}
    handys={handys}
    infantes={infantes}
    onChange={setInfantes}
    movilesActivos={movilesActivos}
    movilJefatura={movilJefatura}
    companiaFiltro={companiaFiltroInfantes}
    onCompaniaChange={setCompaniaFiltroInfantes}
  />
)}
    </div>
  )
}

export default App