const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite')
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Could not open DB', err.message)
    process.exit(1)
  }
})

const locations = [
  'Patio Principal',
  'Depósito Central',
  'Planta de Mantenimiento',
  'Base Operativa Norte',
  'Sitio Obra A',
  'Sucursal Sur',
  'Depósito Secundario',
  'Base Operativa Sur'
]

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;')
  db.run('PRAGMA busy_timeout = 5000;')

  db.all('SELECT id FROM products ORDER BY id', (err, rows) => {
    if (err) {
      console.error('Error reading products:', err.message)
      db.close()
      return
    }

    const stmt = db.prepare(`INSERT OR REPLACE INTO inventories (id, idProducto, stockActual, stockMinimo, stockMaximo, ubicacion, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`)

    rows.forEach((r, idx) => {
      const id = r.id
      const stockActual = 10 + (idx % 10)
      const stockMinimo = 2 + (idx % 5)
      const stockMaximo = stockActual + 20
      const ubicacion = locations[idx % locations.length]
      stmt.run(id, id, stockActual, stockMinimo, stockMaximo, ubicacion)
    })

    stmt.finalize((e) => {
      if (e) console.error('Finalize error:', e.message)
      console.log('Seed finished')
      db.close()
    })
  })
})
