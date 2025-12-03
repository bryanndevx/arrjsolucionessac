import { useEffect, useState } from 'react'
import './AdminDashboard.css'

type Inventory = {
  id: number
  stockActual: number
  stockMinimo: number
  stockMaximo?: number
  ubicacion?: string
  product?: { id: number; name: string; category?: { id: number; nombre: string } }
}

export default function AdminInventory() {
  const [items, setItems] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<Inventory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formValues, setFormValues] = useState({ stockActual: '', stockMinimo: '', ubicacion: '' })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/inventories')
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
      await fetch(`/api/inventories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockActual: newStock })
      })
      // actualizar en UI de forma optimista
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, stockActual: newStock } : it)))
    } catch (err) {
      console.error(err)
    }
  }

  function openEdit(id: number) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    setEditingItem(item)
    setFormValues({
      stockActual: String(item.stockActual),
      stockMinimo: String(item.stockMinimo ?? ''),
      ubicacion: item.ubicacion ?? ''
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  async function saveEdit() {
    if (!editingItem) return
    const newStock = parseInt(formValues.stockActual)
    if (Number.isNaN(newStock)) return alert('Stock debe ser un número válido')

    const body = { stockActual: newStock, ubicacion: formValues.ubicacion }
    try {
      const res = await fetch(`/api/inventories/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...it, ...body } : it)))
      closeModal()
    } catch (err) {
      console.error('Error guardando cambios:', err)
      alert('Error guardando cambios. Revisa la consola.')
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
                <th>Estado</th>
                <th>Acciones</th>
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
                  <td>{it.product?.category?.nombre || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button title="Disminuir" className="btn btn-decrease" onClick={() => adjust(it.id, -1)}>-</button>
                      <button title="Aumentar" className="btn btn-increase" onClick={() => adjust(it.id, 1)}>+</button>
                      <button title="Editar" className="btn btn-edit" onClick={() => openEdit(it.id)}>
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isModalOpen && editingItem && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Editar Inventario — ID {editingItem.id}</h3>
            </div>
            <div className="modal-body">
              <label className="form-control">
                <div>Stock actual</div>
                <input
                  type="number"
                  value={formValues.stockActual}
                  onChange={(e) => setFormValues((s) => ({ ...s, stockActual: e.target.value }))}
                />
              </label>

              <label className="form-control">
                <div>Stock mínimo (no editable)</div>
                <input type="number" value={formValues.stockMinimo} disabled />
              </label>

              <label className="form-control">
                <div>Ubicación</div>
                <input
                  type="text"
                  value={formValues.ubicacion}
                  onChange={(e) => setFormValues((s) => ({ ...s, ubicacion: e.target.value }))}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-save" onClick={saveEdit}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
