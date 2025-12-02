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
  db.get("SELECT count(*) as total FROM products", (err, row) => {
    if (err) return console.error('Error counting products:', err.message)
    console.log('total_products:', row.total)

    db.all('SELECT id, name, idCategoria FROM products ORDER BY id LIMIT 20', (err2, rows) => {
      if (err2) return console.error('Error selecting products:', err2.message)
      console.log('sample products:', rows)
      db.close()
    })
  })
})
