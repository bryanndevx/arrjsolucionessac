// Script para insertar categorías iniciales en la tabla `categories`
// Uso: node scripts/seed-categories.js

const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const categories = [
  { id: 1, nombre: 'EN VENTA', descripcion: "Equipos disponibles para compra inmediata. Consultar condiciones de entrega y garantía." },
  { id: 2, nombre: 'EN ALQUILER', descripcion: "Equipos disponibles para alquiler por día/semana/mes. Tarifas y condiciones según contrato." },
  { id: 3, nombre: 'EN MANTENIMIENTO', descripcion: "Equipo en mantenimiento preventivo o correctivo — temporalmente no disponible." }
]

const dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite')
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('No se pudo abrir la base de datos:', dbPath)
    console.error(err && err.message)
    process.exit(1)
  }
})

db.serialize(() => {
  categories.forEach((cat) => {
    db.get('SELECT idCategoria, nombre, descripcion FROM categories WHERE nombre = ?', [cat.nombre], (err, rowByName) => {
      if (err) return console.error('Error comprobando categoría por nombre:', err.message)
      if (rowByName) {
        // Si existe pero no tiene descripcion, actualizarla
        if (!rowByName.descripcion) {
          db.run('UPDATE categories SET descripcion = ?, updatedAt = datetime(\'now\') WHERE idCategoria = ?', [cat.descripcion, rowByName.idCategoria], function (uErr) {
            if (uErr) return console.error('Error actualizando descripción:', uErr.message)
            console.log(`Actualizada descripción: (${rowByName.idCategoria}) ${rowByName.nombre}`)
          })
        } else {
          console.log(`Existe: (${rowByName.idCategoria}) ${rowByName.nombre}`)
        }
        return
      }

      // Si no existe por nombre, comprobar si el id deseado está libre
      db.get('SELECT idCategoria FROM categories WHERE idCategoria = ?', [cat.id], (err2, rowById) => {
        if (err2) return console.error('Error comprobando categoría por id:', err2.message)
        if (!rowById) {
          // Insertar con id especificado
          const sql = `INSERT INTO categories (idCategoria, nombre, descripcion, estado, createdAt, updatedAt) VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))`;
          db.run(sql, [cat.id, cat.nombre, cat.descripcion], function (insErr) {
            if (insErr) return console.error('Error insertando categoría:', insErr.message)
            console.log(`Insertada: (${cat.id}) ${cat.nombre}`)
          })
        } else {
          // id ocupado, insertar sin id (autoincrement)
          const sql2 = `INSERT INTO categories (nombre, descripcion, estado, createdAt, updatedAt) VALUES (?, ?, 1, datetime('now'), datetime('now'))`;
          db.run(sql2, [cat.nombre, cat.descripcion], function (insErr2) {
            if (insErr2) return console.error('Error insertando categoría (sin id):', insErr2.message)
            console.log(`Insertada con id auto: (${this.lastID}) ${cat.nombre} (id solicitado ${cat.id} estaba ocupado)`)
          })
        }
      })
    })
  })
})

// Cerrar DB tras un pequeño timeout para permitir que las operaciones terminen
setTimeout(() => {
  db.close((err) => {
    if (err) console.error('Error cerrando DB:', err.message)
    else console.log('Script finalizado')
  })
}, 800)
