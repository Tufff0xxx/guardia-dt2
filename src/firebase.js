import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'

const firebaseConfig = {
  databaseURL: 'https://guardia-dt2-96dbe-default-rtdb.firebaseio.com'
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export async function guardarBorrador(datos) {
  try {
    await set(ref(db, 'borrador'), datos)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export async function cargarBorrador() {
  try {
    const snapshot = await get(ref(db, 'borrador'))
    if (snapshot.exists()) return snapshot.val()
    return null
  } catch (e) {
    console.error(e)
    return null
  }
}