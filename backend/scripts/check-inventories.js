const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite')
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Could not open DB', err.message)
    process.exit(1)
  }
})

db.serialize(() => {
  db.get("SELECT count(*) as cnt FROM sqlite_master WHERE type='table' AND name='inventories'", (err, row) => {
    if (err) return console.error('Error checking table:', err.message)
    if (!row || row.cnt === 0) {
      console.log('Table inventories does not exist')
      db.close()
      return
    }

    db.get('SELECT COUNT(*) as total FROM inventories', (err2, r2) => {
      if (err2) return console.error('Error counting inventories:', err2.message)
      console.log('total_inventories:', r2.total)

      db.all('SELECT id, idProducto, stockActual, stockMinimo, ubicacion FROM inventories ORDER BY id LIMIT 20', (err3, rows) => {
        if (err3) return console.error('Error selecting inventories:', err3.message)
        console.log('sample rows:', rows)
        db.close()
      })
    })
  })
})
