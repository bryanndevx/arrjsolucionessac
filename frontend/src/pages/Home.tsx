import { Link } from 'react-router-dom'
import './Home.css'
import { ProductCard } from '../components/common'
import { products } from '../constants'
import heroImage from '../assets/hero-maquinaria.png'

export default function Home() {
  const preview = products.slice(0, 2)

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>La Potencia que tu Proyecto Necesita</h1>
            <p>
              Soluciones integrales en venta y alquiler de maquinaria pesada. Encuentra el equipo adecuado para cualquier trabajo.
            </p>
            <Link to="/catalog" className="btn-cta">Explorar Catálogo</Link>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="catalog-section">
        <div className="container">
          <h2>Nuestro Catálogo de Maquinaria</h2>
          <p className="section-subtitle">
            Descubre nuestra selección de equipos para venta y alquiler. Maquinaria robusta y<br/>
            confiable para garantizar el éxito de tu proyecto.
          </p>
          <div className="products-grid">
            {preview.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="catalog-cta">
            <Link to="/catalog" className="btn-catalog">Explorar Más Equipos</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <div className="container">
          <h2>¿Por Qué Elegirnos?</h2>
          <p className="section-subtitle">
            Ofrecemos más que solo maquinaria. Entregamos confiabilidad, experiencia y un<br/>
            compromiso con el éxito de tu proyecto.
          </p>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3>Amplia Variedad</h3>
              <p>Nuestro extenso catálogo cuenta con maquinaria de marcas líderes para cualquier tipo de trabajo.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Soporte Experto</h3>
              <p>Nuestro equipo está listo para asesorarte en la elección del equipo correcto y brindarte soporte técnico.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3>Precios Competitivos</h3>
              <p>Ofrecemos planes de alquiler y venta flexibles que se ajustan a tu presupuesto sin comprometer la calidad.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
