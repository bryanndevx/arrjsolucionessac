import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './Product.css'
import { products as mockProducts } from '../constants'
import { useCart } from '../contexts/CartContext'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { add } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1) // Para alquileres: días, Para ventas: unidades
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        // Mapear respuesta del backend al shape esperado en frontend
        const images = Array.isArray(data.images)
          ? data.images
          : typeof data.images === 'string' && data.images.length > 0
          ? data.images.split(',')
          : []

        const mapped = {
          id: String(data.id),
          name: data.name,
          description: data.description,
          short: data.short,
          price: data.price ? Number(data.price) : 0,
          pricePerDay: data.pricePerDay ? Number(data.pricePerDay) : undefined,
          type: data.type,
          images: images.length ? images : undefined,
          anio: data.anio,
          horas: data.horas,
          condicion: data.condicion,
          category: data.category,
          inventory: data.inventory
        }

        setProduct(mapped)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching product:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="container">Cargando producto...</div>
  if (error) return <div className="container">Error cargando producto: {error}</div>
  if (!product) return <div className="container">Producto no encontrado</div>

  const relatedProducts = mockProducts.filter(p => p.id !== product.id).slice(0, 4)
  const isRent = product.type === 'rent'

  const handleAddToCart = () => {
    add(product, quantity)
    // Mostrar confirmación o redirigir al carrito
    alert(`${product.name} agregado al carrito (${quantity} ${isRent ? 'días' : 'unidad(es)'})`)
  }

  const handleBuyNow = () => {
    add(product, quantity)
    navigate('/cart')
  }

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="separator">/</span>
            <Link to="/catalog">Alquiler</Link>
            <span className="separator">/</span>
            <span className="current">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="product-detail-layout container">
        {/* Left Column - Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={product.images?.[selectedImage] ?? '/vite.svg'} alt={product.name} />
          </div>
          <div className="image-thumbnails">
            <button 
              className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
              onClick={() => setSelectedImage(0)}
            >
              <img src={product.images?.[0] ?? '/vite.svg'} alt={`${product.name} vista 1`} />
            </button>
            <button 
              className={`thumbnail ${selectedImage === 1 ? 'active' : ''}`}
              onClick={() => setSelectedImage(1)}
            >
              <img src={product.images?.[1] ?? product.images?.[0] ?? '/vite.svg'} alt={`${product.name} vista 2`} />
            </button>
            <button 
              className={`thumbnail ${selectedImage === 2 ? 'active' : ''}`}
              onClick={() => setSelectedImage(2)}
            >
              <img src={product.images?.[2] ?? product.images?.[0] ?? '/vite.svg'} alt={`${product.name} vista 3`} />
            </button>
            <button 
              className={`thumbnail ${selectedImage === 3 ? 'active' : ''}`}
              onClick={() => setSelectedImage(3)}
            >
              <img src={product.images?.[3] ?? product.images?.[0] ?? '/vite.svg'} alt={`${product.name} vista 4`} />
            </button>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="product-info">
          <div className="product-code">CÓDIGO: {product.id ? `EXC-${String(product.id).padStart(4, '0')}` : '—'}</div>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-subtitle">Potencia y eficiencia para proyectos de gran envergadura.</p>

          <div className="product-specs">
            <div className="spec-item">
              <div className="spec-label">Año:</div>
              <div className="spec-value">{product.anio ?? '—'}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Horas:</div>
              <div className="spec-value">{product.horas != null ? Number(product.horas).toLocaleString('es-PE') : '—'}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Condición:</div>
              <div className="spec-value">{product.condicion ?? '—'}</div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="pricing-section">
            <div className="price-display">
              {isRent && product.pricePerDay ? (
                <>
                  <div className="price-label">Precio por día</div>
                  <div className="price-amount">S/ {product.pricePerDay.toLocaleString('es-PE')}</div>
                  <div className="price-note">* Precio sujeto a disponibilidad y duración del alquiler</div>
                </>
              ) : (
                <>
                  <div className="price-label">Precio de venta</div>
                  <div className="price-amount">S/ {product.price.toLocaleString('es-PE')}</div>
                  <div className="price-note">* Precio incluye documentación completa</div>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label className="quantity-label">
                {isRent ? 'Días de alquiler:' : 'Cantidad:'}
              </label>
              <div className="quantity-controls-product">
                <button 
                  className="btn-qty-product"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  type="button"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val > 0) setQuantity(val)
                  }}
                  className="qty-input-product"
                />
                <button 
                  className="btn-qty-product"
                  onClick={() => setQuantity(quantity + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
              {isRent && (
                <div className="estimated-total">
                  Total estimado: S/ {((product.pricePerDay || 0) * quantity).toLocaleString('es-PE')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="btn-add-cart"
                onClick={handleAddToCart}
              >
                Agregar al Carrito
              </button>
              <button 
                className="btn-buy-now"
                onClick={handleBuyNow}
              >
                {isRent ? 'Reservar Ahora' : 'Comprar Ahora'}
              </button>
            </div>

            {/* Contact for Custom Quote */}
            <div className="custom-quote-section">
              <p className="custom-quote-text">
                ¿Necesitas un proyecto personalizado o cotización especial?
              </p>
              <Link to="/contact" className="btn-custom-quote">
                Solicitar Cotización Personalizada
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Specs Section */}
      <div className="product-details-section">
        <div className="container">
          <h2 className="section-title">Descripción y Especificaciones</h2>
          
          <p className="description-text">
            La excavadora CAT 336 ofrece potencia y eficiencia inigualables. Con su motor robusto y 
            tecnología avanzada, es la elección perfecta para excavaciones masivas, movimiento de tierras 
            y demolición. Su cabina ergonómica asegura la comodidad y productividad del operador 
            durante largas jornadas.
          </p>

          <div className="specs-grid">
            <div className="spec-card">
              <div className="spec-icon">⚖️</div>
              <div className="spec-content">
                <strong>Peso Operativo</strong>
                <span>36,000 kg</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">📏</div>
              <div className="spec-content">
                <strong>Capacidad Cucharón</strong>
                <span>1.9 m³</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">⛽</div>
              <div className="spec-content">
                <strong>Cap. Combustible</strong>
                <span>620 L</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">⚡</div>
              <div className="spec-content">
                <strong>Potencia Motor</strong>
                <span>320 HP</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">📐</div>
              <div className="spec-content">
                <strong>Prof. Máx. Excavación</strong>
                <span>7.5 m</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon">🔧</div>
              <div className="spec-content">
                <strong>Fuerza Excavación</strong>
                <span>250 kN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products-section container">
        <h2>Equipos Relacionados</h2>
        <div className="related-grid">
          {relatedProducts.map(relProduct => (
            <Link to={`/product/${relProduct.id}`} key={relProduct.id} className="related-card">
              <div className="related-image">
                <img src={relProduct.images?.[0] ?? '/vite.svg'} alt={relProduct.name} />
              </div>
              <div className="related-info">
                <h3>{relProduct.name}</h3>
                <p>{relProduct.description?.substring(0, 60) ?? 'Maquinaria pesada de alta calidad'}...</p>
                <span className="related-link">Ver Detalles</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
