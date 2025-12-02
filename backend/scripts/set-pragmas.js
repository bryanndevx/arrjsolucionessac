// Script para aplicar PRAGMA en la base de datos SQLite
// Uso: node scripts/set-pragmas.js

const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite')
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('No se pudo abrir la base de datos:', dbPath)
    console.error(err.message)
    process.exit(1)
  }
  console.log('Base de datos abierta:', dbPath)
})

db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL;", function (err) {
    if (err) console.error('Error setting journal_mode:', err.message)
    else console.log('journal_mode set to WAL')
  })
  db.run("PRAGMA busy_timeout = 60000;", function (err) {
    if (err) console.error('Error setting busy_timeout:', err.message)
    else console.log('busy_timeout set to 60000')
  })
})

db.close((err) => {
  if (err) console.error('Error closing DB:', err.message)
  else console.log('Script finished')
})
