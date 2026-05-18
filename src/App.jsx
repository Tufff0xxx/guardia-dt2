import { useState, useEffect } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import TabGuardia from './components/TabGuardia'
import TabMoviles from './components/TabMoviles'
import TabFuera from './components/TabFuera'
import TabBase from './components/TabBase'
import TabNovedades from './components/TabNovedades'
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
  const [movilesActivos, setMovilesActivos] = useState([
  { sector: '', movil: '', p1: '', p2: '', rugger: '', handy: '', obs: '' }
  
])

  const [guardia, setGuardia] = useState({
    division: 'DIVISION TERRITORIAL 2',
    fecha: hoy(),
    horario: '',
    roles: [{ rol: 'JEFE DE GUARDIA', persona: '' }],
    casilla: ''
  })

  useEffect(() => {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`
  Promise.all([
    fetch(`${base}/NOMINA?key=${API_KEY}`).then(r => r.json()),
    fetch(`${base}/MOVILES?key=${API_KEY}`).then(r => r.json()),
    fetch(`${base}/RUGGEAR?key=${API_KEY}`).then(r => r.json()),
    fetch(`${base}/HANDY?key=${API_KEY}`).then(r => r.json()),
  ]).then(([dp, dm, dr, dh]) => {
    const listaPersonal = dp.values.slice(1)
      .filter(r => r[2] && r[3])
      .map(r => ({
        dni: (r[1] || '').toString().replace(/,/g, '').trim(),
        jerarquia: r[2] || '',
        nombre: r[3] || '',
        efectivo: r[0] || ''  // columna A, ya concatenada
    }))
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
      <TabBar tabActiva={tabActiva} onChange={setTabActiva} />
      {tabActiva === 'guardia' && (
        <TabGuardia
          personal={personal}
          datos={guardia}
          onChange={setGuardia}
          
        />
      )}
      {tabActiva === 'moviles' && (
  <TabMoviles
    personal={personal}
    movilesData={movilesData}
    moviles={movilesActivos}
    onChange={setMovilesActivos}
    ruggers={ruggers}
    handys={handys}
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
    />
  )}
  {tabActiva === 'mensaje' && (
  <TabMensaje
    guardia={guardia}
    movilesActivos={movilesActivos}
    movilesData={movilesData}
    fuera={fuera}
    base={base}
    novedades={novedades}
  />
)}
    </div>
  )
}

export default App