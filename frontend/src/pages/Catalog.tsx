import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Catalog.css'
import { ProductCard } from '../components/common'
import { products as localProducts } from '../constants'
import type { Product } from '../types/product.types'

// Catalog will fetch products from backend /api/products when available,
// otherwise falls back to local mock data.

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 })
  const [availability, setAvailability] = useState<string>('ambos')
  const [products, setProducts] = useState<Product[]>(localProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('relevancia')
  const itemsPerPage = 6

  // Determinar el tipo de precio basado en la disponibilidad
  const priceType = availability === 'alquiler' ? 'daily' : 'total'
  const maxPrice = priceType === 'daily' ? 1000 : 200000

  const toggleCategory = (cat: string) => {
    setSelectedCategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setCurrentPage(1)
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
    setCurrentPage(1)
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by categories
    if (selectedCategory.length > 0) {
      filtered = filtered.filter(p => {
        const productName = p.name.toLowerCase()
        return selectedCategory.some(cat => {
          switch(cat) {
            case 'excavadoras':
              return productName.includes('excavadora')
            case 'gruas':
              return productName.includes('grúa') || productName.includes('grua')
            case 'bulldozers':
              return productName.includes('bulldozer')
            case 'cargadores':
              return productName.includes('cargador')
            case 'compactadoras':
              return productName.includes('compactador')
            case 'retroexcavadoras':
              return productName.includes('retroexcavadora')
            default:
              return false
          }
        })
      })
    }

    // Filter by availability
    if (availability === 'venta') {
      filtered = filtered.filter(p => p.type === 'sale' || p.badge === 'EN VENTA')
    } else if (availability === 'alquiler') {
      filtered = filtered.filter(p => p.type === 'rent' || p.badge === 'EN ALQUILER')
    }

    // Filter by price
    filtered = filtered.filter(p => {
      // Para alquileres, usar pricePerDay si existe
      const priceToCompare = p.type === 'rent' && p.pricePerDay ? p.pricePerDay : p.price
      return priceToCompare >= priceRange.min && priceToCompare <= priceRange.max
    })

    // Filter by brands (if any selected)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => 
        selectedBrands.some(brand => {
          const productName = p.name.toLowerCase()
          switch(brand) {
            case 'caterpillar':
              return productName.includes('cat') || productName.includes('caterpillar')
            case 'komatsu':
              return productName.includes('komatsu')
            case 'volvo':
              return productName.includes('volvo')
            case 'hitachi':
              return productName.includes('hitachi')
            case 'liebherr':
              return productName.includes('liebherr')
            case 'jcb':
              return productName.includes('jcb')
            case 'bomag':
              return productName.includes('bomag')
            case 'tadano':
              return productName.includes('tadano')
            default:
              return false
          }
        })
      )
    }

    // Sort
    switch(sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.type === 'rent' && a.pricePerDay ? a.pricePerDay : a.price
          const priceB = b.type === 'rent' && b.pricePerDay ? b.pricePerDay : b.price
          return priceA - priceB
        })
        break
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.type === 'rent' && a.pricePerDay ? a.pricePerDay : a.price
          const priceB = b.type === 'rent' && b.pricePerDay ? b.pricePerDay : b.price
          return priceB - priceA
        })
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // relevancia - keep original order
        break
    }

    return filtered
  }

  const filteredProducts = applyFilters()
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handleResetFilters = () => {
    setSelectedCategory([])
    setSelectedBrands([])
    setPriceRange({ min: 0, max: 200000 })
    setAvailability('ambos')
    setCurrentPage(1)
    setSortBy('relevancia')
  }

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // Fetch products from backend on mount
  useEffect(() => {
    let cancelled = false
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok')
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        // Map backend product shape to frontend Product type
        const mapped: Product[] = data.map((p: any) => {
          // prefer backend images if they are full URLs; otherwise fallback to local imported assets
          let images: string[] = []
          if (Array.isArray(p.images) && p.images.length > 0) {
            // if items look like full URLs (start with http or /), use them; else fallback
            const usable = p.images.filter((x: string) => typeof x === 'string' && (x.startsWith('http') || x.startsWith('/')))
            if (usable.length > 0) images = usable
          }

          if (images.length === 0) {
            const fallback = localProducts.find(lp => String(lp.id) === String(p.id))
            images = fallback?.images || []
          }

          return {
            id: String(p.id),
            name: p.name,
            price: Number(p.price),
            pricePerDay: p.pricePerDay ? Number(p.pricePerDay) : undefined,
            images,
            badge: p.category?.nombre ? p.category.nombre : p.type === 'rent' ? 'EN ALQUILER' : 'EN VENTA',
            short: p.short || '',
            description: p.description || '',
            type: p.type || undefined
          }
        })
        setProducts(mapped)
      })
      .catch(() => {
        // keep localProducts as fallback
      })

    return () => { cancelled = true }
  }, [])

  return (
    <div className="catalog-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="separator">/</span>
            <Link to="/catalog">Catálogo</Link>
            <span className="separator">/</span>
            <span className="current">Excavadoras</span>
          </nav>
        </div>
      </div>

      <div className="catalog-layout container">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <h3 className="filters-title">Filtros</h3>

          {/* Categorías */}
          <div className="filter-section">
            <button className="filter-header">
              <span>Categorías</span>
              <span className="icon">^</span>
            </button>
            <div className="filter-content">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={selectedCategory.includes('excavadoras')}
                  onChange={() => toggleCategory('excavadoras')}
                />
                <span>Excavadoras</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedCategory.includes('gruas')}
                  onChange={() => toggleCategory('gruas')}
                />
                <span>Grúas</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedCategory.includes('bulldozers')}
                  onChange={() => toggleCategory('bulldozers')}
                />
                <span>Bulldozers</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedCategory.includes('cargadores')}
                  onChange={() => toggleCategory('cargadores')}
                />
                <span>Cargadores frontales</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedCategory.includes('compactadoras')}
                  onChange={() => toggleCategory('compactadoras')}
                />
                <span>Compactadoras</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedCategory.includes('retroexcavadoras')}
                  onChange={() => toggleCategory('retroexcavadoras')}
                />
                <span>Retroexcavadoras</span>
              </label>
            </div>
          </div>

          {/* Marca */}
          <div className="filter-section">
            <button className="filter-header">
              <span>Marca</span>
              <span className="icon">^</span>
            </button>
            <div className="filter-content">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('caterpillar')}
                  onChange={() => toggleBrand('caterpillar')}
                />
                <span>Caterpillar</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('komatsu')}
                  onChange={() => toggleBrand('komatsu')}
                />
                <span>Komatsu</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('volvo')}
                  onChange={() => toggleBrand('volvo')}
                />
                <span>Volvo</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('hitachi')}
                  onChange={() => toggleBrand('hitachi')}
                />
                <span>Hitachi</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('liebherr')}
                  onChange={() => toggleBrand('liebherr')}
                />
                <span>Liebherr</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('jcb')}
                  onChange={() => toggleBrand('jcb')}
                />
                <span>JCB</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('bomag')}
                  onChange={() => toggleBrand('bomag')}
                />
                <span>Bomag</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes('tadano')}
                  onChange={() => toggleBrand('tadano')}
                />
                <span>Tadano</span>
              </label>
            </div>
          </div>

          {/* Rango de Precio */}
          <div className="filter-section">
            <button className="filter-header">
              <span>Rango de Precio {priceType === 'daily' ? '(por día)' : ''}</span>
              <span className="icon">^</span>
            </button>
            <div className="filter-content">
              <div className="price-range">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Min: S/</label>
                    <input 
                      type="number" 
                      min="0" 
                      max={maxPrice}
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})
                        setCurrentPage(1)
                      }}
                      className="price-input"
                    />
                  </div>
                  <div className="price-input-group">
                    <label>Max: S/</label>
                    <input 
                      type="number" 
                      min="0" 
                      max={maxPrice}
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange({...priceRange, max: parseInt(e.target.value) || maxPrice})
                        setCurrentPage(1)
                      }}
                      className="price-input"
                    />
                  </div>
                </div>
                <p className="price-hint">
                  {priceType === 'daily' 
                    ? 'Precio de alquiler por día' 
                    : 'Precio de venta total'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="filter-section">
            <button className="filter-header">
              <span>Disponibilidad</span>
              <span className="icon">^</span>
            </button>
            <div className="filter-content">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="availability"
                  checked={availability === 'ambos'}
                  onChange={() => {
                    setAvailability('ambos')
                    setCurrentPage(1)
                  }}
                />
                <span>Ambos</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="availability"
                  checked={availability === 'venta'}
                  onChange={() => {
                    setAvailability('venta')
                    setCurrentPage(1)
                  }}
                />
                <span>Para Venta</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="availability"
                  checked={availability === 'alquiler'}
                  onChange={() => {
                    setAvailability('alquiler')
                    setCurrentPage(1)
                  }}
                />
                <span>Para Alquiler</span>
              </label>
            </div>
          </div>

          <button 
            className="btn-apply-filters"
            onClick={() => setCurrentPage(1)}
          >
            Aplicar Filtros
          </button>
          <button 
            className="btn-reset-filters"
            onClick={handleResetFilters}
          >
            Restablecer
          </button>
        </aside>

        {/* Main Content */}
        <main className="catalog-main">
          <div className="catalog-header">
            <h1>Catálogo de Maquinaria</h1>
            <div className="catalog-meta">
              <span>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} resultados</span>
              <div className="sort-by">
                <label>Ordenar por:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="relevancia">Relevancia</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {currentProducts.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron productos con los filtros seleccionados.</p>
              <button onClick={handleResetFilters} className="btn-reset">Restablecer Filtros</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="page-btn prev" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    className="page-btn next"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
