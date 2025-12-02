import { useEffect, useState } from 'react'
import './AdminDashboard.css'

type Inventory = {
  id: number
  stockActual: number
  stockMinimo: number
  stockMaximo?: number
  ubicacion?: string
  product?: { id: number; name: string }
}

export default function AdminInventory() {
  const [items, setItems] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/inventories')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function adjust(id: number, delta: number) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const newStock = item.stockActual + delta
    try {
      await fetch(`/inventories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockActual: newStock })
      })
      load()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="panel">
        <h4>Inventario</h4>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Ubicación</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.product?.name || '—'}</td>
                  <td>{it.stockActual}</td>
                  <td>{it.stockMinimo}</td>
                  <td>{it.ubicacion || '—'}</td>
                  <td>
                    <button className="btn" onClick={() => adjust(it.id, -1)}>-</button>
                    <button className="btn" onClick={() => adjust(it.id, 1)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
