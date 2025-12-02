/**
 * Script para actualizar los productos existentes y poblar
 * las nuevas columnas: anio, horas, condicion
 *
 * Uso: desde la carpeta `backend` ejecutar:
 *   node ./scripts/update-products-fields.js
 */
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, '..', 'data', 'database.sqlite')

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error abriendo la BD:', err.message)
    process.exit(1)
  }
})

db.serialize(() => {
  // Evitar SQLITE_BUSY ocasional
  db.exec('PRAGMA busy_timeout = 5000')
  db.exec('PRAGMA foreign_keys = ON')

  db.all('SELECT id, name FROM products', (err, rows) => {
    if (err) {
      console.error('Error leyendo products:', err.message)
      db.close()
      return
    }

    if (!rows || rows.length === 0) {
      console.log('No hay productos para actualizar.')
      db.close()
      return
    }

    console.log(`Encontrados ${rows.length} productos. Actualizando...`)

    const condiciones = ['Excelente', 'Buena', 'Regular', 'Necesita reparación']

    const updateStmt = db.prepare(
      `UPDATE products SET anio = ?, horas = ?, condicion = ? WHERE id = ?`
    )

    rows.forEach((p, idx) => {
      // Valores de ejemplo:
      // - anio: entre 2005 y 2024 (varía según índice)
      // - horas: entre 100 y 5000
      // - condicion: rotar entre las opciones
      const anio = 2005 + (idx % 20) // 2005..2024
      const horas = 100 + ((idx * 37) % 4900) // pseudo-random
      const condicion = condiciones[idx % condiciones.length]

      updateStmt.run(anio, horas, condicion, p.id, (err) => {
        if (err) console.error(`Error actualizando producto ${p.id}:`, err.message)
      })
    })

    updateStmt.finalize((err) => {
      if (err) console.error('Error finalizando updateStmt:', err.message)
      else console.log('Actualizaciones realizadas. Puedes verificar con `node ./scripts/check-products.js` o con DB Browser.')

      db.close((err) => {
        if (err) console.error('Error cerrando la BD:', err.message)
      })
    })
  })
})
