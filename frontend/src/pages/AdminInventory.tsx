import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [activeTab, setActiveTab] = useState<'inventario' | 'categorias' | 'productos'>('inventario')
  const [categories, setCategories] = useState<Array<{ id: number; nombre: string }>>([])
  const [products, setProducts] = useState<Array<any>>([])
  const [editingItem, setEditingItem] = useState<Inventory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formValues, setFormValues] = useState({ stockActual: '', stockMinimo: '', ubicacion: '' })

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    // when switching tabs, lazy-load categories or products
    if (activeTab === 'categorias' && categories.length === 0) fetchCategories()
    if (activeTab === 'productos' && products.length === 0) fetchProducts()
  }, [activeTab])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

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
        <div className="tabs">
          <button className={`tab ${activeTab === 'inventario' ? 'active' : ''}`} onClick={() => setActiveTab('inventario')}>Inventario</button>
          <button className={`tab ${activeTab === 'categorias' ? 'active' : ''}`} onClick={() => setActiveTab('categorias')}>Categorías</button>
          <button className={`tab ${activeTab === 'productos' ? 'active' : ''}`} onClick={() => setActiveTab('productos')}>Productos</button>
        </div>

        {/* Inventario tab */}
        {activeTab === 'inventario' && (
          <div>
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
                          <button title="Editar" className="btn btn-edit" onClick={() => openEdit(it.id)}>✏️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Categorias tab */}
        {activeTab === 'categorias' && (
          <div>
            {categories.length === 0 ? (
              <div>No hay categorías</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>
                      <td>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Productos tab */}
        {activeTab === 'productos' && (
          <div>
            {products.length === 0 ? (
              <div>No hay productos</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.category?.nombre ?? '—'}</td>
                      <td>{p.price != null ? Number(p.price).toLocaleString('es-PE') : '—'}</td>
                      <td>
                        <Link to={`/product/${p.id}`}>Ver</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
