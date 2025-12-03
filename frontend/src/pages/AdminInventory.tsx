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
  const [categories, setCategories] = useState<Array<any>>([])
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [categoryForm, setCategoryForm] = useState({ nombre: '', descripcion: '', estado: true })
  const [products, setProducts] = useState<Array<any>>([])
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [productForm, setProductForm] = useState<any>({ name: '', short: '', description: '', price: '', pricePerDay: '', type: '', images: '', anio: '', horas: '', condicion: '', idCategoria: null })
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

  async function toggleCategoryState(id: number, state: boolean) {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: state })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCategories((prev) => prev.map((c) => (c.idCategoria === id ? { ...c, estado: state } : c)))
    } catch (err) {
      console.error('Error updating category state:', err)
      alert('No se pudo actualizar el estado de la categoría')
    }
  }

  function openCategoryEdit(c: any) {
    setEditingCategory(c)
    setCategoryForm({ nombre: c.nombre ?? '', descripcion: c.descripcion ?? '', estado: !!c.estado })
    setIsModalOpen(true)
  }

  async function saveCategoryEdit() {
    if (!editingCategory) return
    const body = { nombre: categoryForm.nombre, descripcion: categoryForm.descripcion, estado: categoryForm.estado }
    try {
      const res = await fetch(`/api/categories/${editingCategory.idCategoria}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setCategories((prev) => prev.map((item) => (item.idCategoria === updated.idCategoria ? updated : item)))
      setEditingCategory(null)
      closeModal()
    } catch (err) {
      console.error('Error saving category edit:', err)
      alert('Error actualizando categoría')
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

  async function adjustProductStock(productId: number, delta: number) {
    const p = products.find((x: any) => x.id === productId)
    const invId = p?.inventory?.id
    if (!invId) return alert('Producto no tiene inventario asociado')
    try {
      const newStock = (p.inventory.stockActual ?? 0) + delta
      const res = await fetch(`/api/inventories/${invId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockActual: newStock })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // update local products list inventory
      setProducts((prev) => prev.map((item: any) => (item.id === productId ? { ...item, inventory: { ...item.inventory, stockActual: newStock } } : item)))
    } catch (err) {
      console.error('Error ajustando stock de producto:', err)
      alert('No se pudo ajustar el stock del producto')
    }
  }

  function openProductEdit(p: any) {
    setEditingProduct(p)
    setProductForm({
      name: p.name ?? '',
      short: p.short ?? '',
      description: p.description ?? '',
      price: p.price != null ? String(p.price) : '',
      pricePerDay: p.pricePerDay != null ? String(p.pricePerDay) : '',
      type: p.type ?? '',
      images: Array.isArray(p.images) ? p.images.join(',') : (p.images ?? ''),
      anio: p.anio != null ? String(p.anio) : '',
      horas: p.horas != null ? String(p.horas) : '',
      condicion: p.condicion ?? '',
      idCategoria: p.category?.idCategoria ?? p.category?.id ?? null
    })
    setIsModalOpen(true)
  }

  async function saveProductEdit() {
    if (!editingProduct) return
    const body: any = {
      name: productForm.name,
      short: productForm.short,
      description: productForm.description,
      price: productForm.price !== '' ? Number(productForm.price) : null,
      pricePerDay: productForm.pricePerDay !== '' ? Number(productForm.pricePerDay) : null,
      type: productForm.type,
      images: productForm.images ? productForm.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      anio: productForm.anio !== '' ? Number(productForm.anio) : null,
      horas: productForm.horas !== '' ? Number(productForm.horas) : null,
      condicion: productForm.condicion
    }
    // allow updating category by idCategoria if provided
    if (productForm.idCategoria) body.idCategoria = productForm.idCategoria

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setProducts((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
      setEditingProduct(null)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error guardando producto:', err)
      alert('Error actualizando producto')
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
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Creado</th>
                    <th>Actualizado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.idCategoria}>
                      <td>{c.idCategoria}</td>
                      <td>{c.nombre}</td>
                      <td>{c.descripcion ?? '—'}</td>
                      <td>{c.estado ? 'Activo' : 'Inactivo'}</td>
                      <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>
                      <td>{c.updatedAt ? new Date(c.updatedAt).toLocaleString() : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button title="Marcar activo" className="btn btn-increase" onClick={() => toggleCategoryState(c.idCategoria, true)}>+</button>
                          <button title="Marcar inactivo" className="btn btn-decrease" onClick={() => toggleCategoryState(c.idCategoria, false)}>-</button>
                          <button title="Editar" className="btn btn-edit" onClick={() => openCategoryEdit(c)}>✏️</button>
                        </div>
                      </td>
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
                    <th>Precio por día</th>
                    <th>Año</th>
                    <th>Horas</th>
                    <th>Condición</th>
                    <th>Stock</th>
                    
                    <th>Creado</th>
                    <th>Actualizado</th>
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
                      <td>{p.pricePerDay != null ? Number(p.pricePerDay).toLocaleString('es-PE') : '—'}</td>
                      <td>{p.anio ?? '—'}</td>
                      <td>{p.horas ?? '—'}</td>
                      <td>{p.condicion ?? '—'}</td>
                      <td>{p.inventory?.stockActual ?? '—'}</td>
                      
                      <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '—'}</td>
                      <td>{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button title="Disminuir stock" className="btn btn-decrease" onClick={() => adjustProductStock(p.id, -1)}>-</button>
                          <button title="Aumentar stock" className="btn btn-increase" onClick={() => adjustProductStock(p.id, 1)}>+</button>
                          <button title="Editar producto" className="btn btn-edit" onClick={() => openProductEdit(p)}>✏️</button>
                          <Link to={`/product/${p.id}`}>Ver</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>
                {editingProduct
                  ? `Editar Producto — ID ${editingProduct.id}`
                  : editingCategory
                  ? `Editar Categoría — ID ${editingCategory.idCategoria}`
                  : `Editar Inventario — ID ${editingItem?.id}`}
              </h3>
            </div>
            <div className="modal-body">
              {editingProduct ? (
                <>
                  <label className="form-control">
                    <div>Nombre</div>
                    <input type="text" value={productForm.name} onChange={(e) => setProductForm((s: any) => ({ ...s, name: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Short</div>
                    <input type="text" value={productForm.short} onChange={(e) => setProductForm((s: any) => ({ ...s, short: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Descripción</div>
                    <textarea value={productForm.description} onChange={(e) => setProductForm((s: any) => ({ ...s, description: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Precio</div>
                    <input type="number" value={productForm.price} onChange={(e) => setProductForm((s: any) => ({ ...s, price: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Precio por día</div>
                    <input type="number" value={productForm.pricePerDay} onChange={(e) => setProductForm((s: any) => ({ ...s, pricePerDay: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Año</div>
                    <input type="number" value={productForm.anio} onChange={(e) => setProductForm((s: any) => ({ ...s, anio: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Horas</div>
                    <input type="number" value={productForm.horas} onChange={(e) => setProductForm((s: any) => ({ ...s, horas: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Condición</div>
                    <input type="text" value={productForm.condicion} onChange={(e) => setProductForm((s: any) => ({ ...s, condicion: e.target.value }))} />
                  </label>

                  <label className="form-control">
                    <div>Imágenes (coma-separadas)</div>
                    <input type="text" value={productForm.images} onChange={(e) => setProductForm((s: any) => ({ ...s, images: e.target.value }))} />
                  </label>
                </>
              ) : editingCategory ? (
                <>
                  <label className="form-control">
                    <div>Nombre</div>
                    <input type="text" value={categoryForm.nombre} onChange={(e) => setCategoryForm((s) => ({ ...s, nombre: e.target.value }))} />
                  </label>
                  <label className="form-control">
                    <div>Descripción</div>
                    <input type="text" value={categoryForm.descripcion} onChange={(e) => setCategoryForm((s) => ({ ...s, descripcion: e.target.value }))} />
                  </label>
                  <label className="form-control">
                    <div>Estado</div>
                    <select value={categoryForm.estado ? '1' : '0'} onChange={(e) => setCategoryForm((s) => ({ ...s, estado: e.target.value === '1' }))}>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </label>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => { closeModal(); setEditingCategory(null); setEditingProduct(null); }}>Cancelar</button>
              <button className="btn btn-save" onClick={() => {
                if (editingProduct) { saveProductEdit() }
                else if (editingCategory) { saveCategoryEdit() }
                else { saveEdit() }
              }}>{editingProduct ? 'Guardar producto' : (editingCategory ? 'Guardar' : 'Guardar')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
