import { Link } from 'react-router-dom'
import './Header.css'
import { useCart } from '../../../contexts/CartContext'

export default function Header() {
  const { totalCount } = useCart()

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand">
          <svg className="logo-icon" width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Excavadora/Maquinaria */}
            <path d="M8 32h8v4H8z" fill="#FF8A2B"/>
            <circle cx="12" cy="38" r="2" fill="#1a2332"/>
            <circle cx="20" cy="38" r="2" fill="#1a2332"/>
            <rect x="16" y="26" width="8" height="6" rx="1" fill="#FF8A2B"/>
            <path d="M24 28h12l4 4v4H24V28z" fill="#FFB366"/>
            <rect x="28" y="22" width="3" height="6" fill="#FF8A2B"/>
            <path d="M31 16l8-8 2 2-8 8-2-2z" stroke="#FF8A2B" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="39" cy="10" r="3" fill="#FFB366"/>
            <rect x="6" y="28" width="4" height="4" rx="1" fill="#1a2332"/>
          </svg>
          <Link to="/">ARRJ SOLUCIONES S.A.C.</Link>
        </div>
        <nav className="nav-menu">
          <Link to="/">Inicio</Link>
          <Link to="/catalog">Catálogo</Link>
          <Link to="/about">Quiénes Somos</Link>
          <Link to="/contact">Contacto</Link>
        </nav>
        <div className="header-actions">
          <Link to="/cart" className="cart-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="21" r="1" fill="currentColor"/>
              <circle cx="20" cy="21" r="1" fill="currentColor"/>
            </svg>
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
