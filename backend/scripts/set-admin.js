// Script para actualizar el role de un usuario a 'admin' en la base de datos SQLite
// Uso: node scripts/set-admin.js correo@ejemplo.com

const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const email = process.argv[2]
if (!email) {
  console.error('Uso: node scripts/set-admin.js correo@ejemplo.com')
  process.exit(1)
}

const dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite')
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('No se pudo abrir la base de datos:', dbPath)
    console.error(err.message)
    process.exit(1)
  }
})

const sql = `UPDATE user SET role = 'admin' WHERE email = ?;`;
db.run(sql, [email], function (err) {
  if (err) {
    console.error('Error ejecutando la actualización:', err.message)
    process.exit(1)
  }
  if (this.changes === 0) {
    console.log(`No se encontraron registros para el email: ${email}`)
  } else {
    console.log(`Usuario actualizado a admin: ${email} (filas afectadas: ${this.changes})`)
  }
  db.close()
})
