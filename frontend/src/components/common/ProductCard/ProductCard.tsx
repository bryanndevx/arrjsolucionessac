import { Link } from 'react-router-dom'
import type { Product } from '../../../types'
import { useCart } from '../../../contexts/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <article className="product-card">
      <div className="card-media">
        {product.badge && (
          <span className={`badge ${product.badge === 'EN VENTA' ? 'badge-sale' : product.badge === 'EN ALQUILER' ? 'badge-rent' : ''}`}>{product.badge}</span>
        )}
        <Link to={`/product/${product.id}`}>
          <img src={product.images?.[0] ?? '/vite.svg'} alt={product.name} />
        </Link>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        {product.short && <p className="short">{product.short}</p>}
        <p className="price">
          {product.type === 'rent' && product.pricePerDay 
            ? `Desde S/ ${product.pricePerDay.toLocaleString()} por día`
            : `S/ ${product.price.toLocaleString()}`
          }
        </p>
        <div className="actions">
          <button className="btn-add" onClick={() => add(product)}>
            {product.type === 'rent' ? 'Reservar' : 'Añadir'}
          </button>
          <Link to={`/product/${product.id}`} className="details">Ver detalles</Link>
        </div>
      </div>
    </article>
  )
}
