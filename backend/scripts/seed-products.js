// Script para sembrar productos desde frontend/src/constants/products.data.ts
// Uso: node scripts/seed-products.js

const fs = require('fs')
const path = require('path')
const vm = require('vm')
const sqlite3 = require('sqlite3').verbose()

const frontendProductsPath = path.resolve(__dirname, '..', '..', 'frontend', 'src', 'constants', 'products.data.ts')
const dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite')

function extractProductsArray(tsContent) {
  // Map import variables to paths
  const importRegex = /import\s+(\w+)\s+from\s+['"](.+?)['"];?/g
  const importMap = {}
  let m
  while ((m = importRegex.exec(tsContent)) !== null) {
    const varName = m[1]
    const rel = m[2]
    importMap[varName] = rel
  }

  // Find start of export products array
  const exportIndex = tsContent.indexOf('export const products')
  if (exportIndex === -1) throw new Error('No export const products found')
  const arrStart = tsContent.indexOf('[', exportIndex)
  if (arrStart === -1) throw new Error('Could not find array start')

  // Find matching closing bracket for the array
  let i = arrStart
  let depth = 0
  for (; i < tsContent.length; i++) {
    const ch = tsContent[i]
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) break
    }
  }
  if (depth !== 0) throw new Error('Unbalanced brackets parsing products array')
  const arrText = tsContent.slice(arrStart, i + 1)

  // Replace imported image variables with string paths
  let jsText = arrText
  Object.keys(importMap).forEach((varName) => {
    const rel = importMap[varName]
    // compute a path relative to frontend root (keep as string for DB)
    jsText = jsText.replace(new RegExp("\\b" + varName + "\\b", 'g'), JSON.stringify(rel))
  })

  // Remove TypeScript type annotations if present (simple approach)
  jsText = jsText.replace(/\:\s*Product\[\]\s*/g, '')

  // Evaluate the array safely
  const sandbox = {}
  vm.createContext(sandbox)
  const script = new vm.Script('result = ' + jsText)
  script.runInContext(sandbox)
  return sandbox.result
}

function mapBadgeToCategoryId(badge) {
  if (!badge) return null
  const normalized = String(badge).trim().toUpperCase()
  if (normalized.includes('VENTA')) return 1
  if (normalized.includes('ALQUILER') || normalized.includes('ALQUIER')) return 2
  if (normalized.includes('MANTENIMIENTO')) return 3
  return null
}

async function run() {
  if (!fs.existsSync(frontendProductsPath)) {
    console.error('Archivo de productos no encontrado:', frontendProductsPath)
    process.exit(1)
  }
  const ts = fs.readFileSync(frontendProductsPath, 'utf8')
  let products
  try {
    products = extractProductsArray(ts)
  } catch (err) {
    console.error('Error extrayendo productos:', err.message)
    process.exit(1)
  }

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('No se pudo abrir la base de datos:', dbPath)
      console.error(err && err.message)
      process.exit(1)
    }
  })

  db.serialize(() => {
    const insertStmt = db.prepare(`INSERT INTO products (id, name, description, short, price, pricePerDay, type, images, idCategoria, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`)
    const updateStmt = db.prepare(`UPDATE products SET name = ?, description = ?, short = ?, price = ?, pricePerDay = ?, type = ?, images = ?, idCategoria = ?, updatedAt = datetime('now') WHERE id = ?`)

    products.forEach((p) => {
      const id = p.id ? Number(p.id) : null
      const name = p.name || null
      const description = p.description || null
      const short = p.short || null
      const price = p.price != null ? Number(p.price) : 0
      const pricePerDay = p.pricePerDay != null ? Number(p.pricePerDay) : null
      const type = p.type || null
      // images may be array or single string
      let images = null
      if (Array.isArray(p.images)) images = p.images.join(',')
      else if (p.images) images = String(p.images)
      const idCategoria = mapBadgeToCategoryId(p.badge || p.categoryId || p.badgeId)

      if (id) {
        // check existence by id
        db.get('SELECT id FROM products WHERE id = ?', [id], (err, row) => {
          if (err) return console.error('Error checking product id:', err.message)
          if (row) {
            updateStmt.run([name, description, short, price, pricePerDay, type, images, idCategoria, id], function (uErr) {
              if (uErr) return console.error('Error updating product id', id, uErr.message)
              console.log('Updated product id', id, name)
            })
          } else {
            insertStmt.run([id, name, description, short, price, pricePerDay, type, images, idCategoria], function (insErr) {
              if (insErr) return console.error('Error inserting product id', id, insErr.message)
              console.log('Inserted product id', id, name)
            })
          }
        })
      } else {
        // insert without id
        insertStmt.run([null, name, description, short, price, pricePerDay, type, images, idCategoria], function (insErr) {
          if (insErr) return console.error('Error inserting product (no id):', insErr.message)
          console.log('Inserted product id auto', this.lastID, name)
        })
      }
    })

    // finalize statements after a short delay
    setTimeout(() => {
      insertStmt.finalize()
      updateStmt.finalize()
      db.close((err) => {
        if (err) console.error('Error closing DB:', err.message)
        else console.log('Seed products finished')
      })
    }, 800)
  })
}

run()
