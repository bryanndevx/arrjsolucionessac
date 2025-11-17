import { Link } from 'react-router-dom'
import './About.css'
import heroImage from '../assets/hero-maquinaria.png'

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Sobre ARRJ SOLUCIONES S.A.C.</h1>
            <p>
              Su socio confiable en alquiler y venta de maquinaria pesada.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section container">
        <div className="history-layout">
          <div className="history-content">
            <div className="section-label">NUESTRA EMPRESA</div>
            <h2>Expertos en alquiler y venta de maquinaria pesada</h2>
            <p>
              ARRJ Soluciones S.A.C. (RUC: 20607929521) es una empresa peruana especializada en el 
              alquiler y venta de maquinaria pesada para el sector construcción, minería e industria. 
              Con años de experiencia en el mercado, nos hemos consolidado como un aliado estratégico 
              para empresas constructoras, compañías industriales y sectores independientes que demandan 
              soluciones eficientes en maquinaria pesada.
            </p>
            <p>
              Contamos con una amplia flota de equipos modernos y bien mantenidos, que incluyen excavadoras, 
              cargadores, grúas, bulldozers, compactadoras y retroexcavadoras de las marcas más reconocidas 
              del mercado. Nuestro compromiso es brindar servicios confiables, rápidos y transparentes, 
              respaldados por certificaciones de calidad como ISO 9001.
            </p>
          </div>

          <div className="mission-values">
            <div className="mv-item">
              <div className="mv-icon mission-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" stroke="#4A90E2" strokeWidth="2" fill="none"/>
                  <circle cx="16" cy="16" r="4" fill="#4A90E2"/>
                </svg>
              </div>
              <div className="mv-content">
                <h3>Misión</h3>
                <p>
                  Proveer soluciones integrales de alquiler y venta de maquinaria pesada de alta calidad, 
                  con mantenimiento preventivo y correctivo, garantizando la satisfacción de nuestros clientes 
                  mediante servicios rápidos, confiables y transparentes que impulsen el éxito de sus proyectos 
                  de construcción e industriales.
                </p>
              </div>
            </div>

            <div className="mv-item">
              <div className="mv-icon vision-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C10 8 5 12 2 16C5 20 10 24 16 24C22 24 27 20 30 16C27 12 22 8 16 8Z" stroke="#4A90E2" strokeWidth="2" fill="none"/>
                  <circle cx="16" cy="16" r="4" stroke="#4A90E2" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="mv-content">
                <h3>Visión</h3>
                <p>
                  Ser reconocidos como la empresa líder en el Perú en alquiler y venta de maquinaria pesada, 
                  destacándonos por nuestra innovación tecnológica, excelencia en el servicio al cliente, 
                  gestión eficiente de inventarios en tiempo real y compromiso con la seguridad y calidad en 
                  cada operación que realizamos.
                </p>
              </div>
            </div>

            <div className="mv-item">
              <div className="mv-icon values-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="20" height="20" rx="2" stroke="#4A90E2" strokeWidth="2" fill="none"/>
                  <path d="M12 16L15 19L20 13" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="mv-content">
                <h3>Valores</h3>
                <p>
                  <strong>Compromiso:</strong> Dedicación total con nuestros clientes y sus proyectos.<br/>
                  <strong>Confiabilidad:</strong> Equipos certificados y en óptimas condiciones.<br/>
                  <strong>Transparencia:</strong> Información clara y precios justos.<br/>
                  <strong>Seguridad:</strong> Cumplimiento riguroso de normas de seguridad.<br/>
                  <strong>Innovación:</strong> Tecnología de punta en gestión y equipos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para empezar su próximo proyecto?</h2>
          <p>
            Nuestra flota de maquinaria pesada y nuestro equipo de expertos están a su disposición 
            para asegurar el éxito de su obra.
          </p>
          <Link to="/catalog" className="btn-cta-orange">Explorar Nuestro Catálogo</Link>
        </div>
      </section>
    </div>
  )
}
