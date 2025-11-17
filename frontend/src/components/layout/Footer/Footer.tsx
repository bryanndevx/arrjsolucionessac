import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="site-footer-dark">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="col branding">
            <h4>ARRJ SOLUCIONES S.A.C.</h4>
            <p className="company-description">
              Empresa dedicada al alquiler y venta de maquinaria pesada para el sector 
              construcción, brindando servicios con certificaciones de calidad.
            </p>
            <div className="certifications">
              <span className="cert-badge">✓ Certificado ISO 9001</span>
              <span className="cert-badge">✓ RUC: 20607929521</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="col links">
            <h5>Navegación</h5>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalog">Catálogo</Link></li>
              <li><Link to="/about">Quiénes Somos</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col contact">
            <h5>Contáctanos</h5>
            <div className="contact-item">
              <span className="icon">📍</span>
              <span>Lima, Perú</span>
            </div>
            <div className="contact-item">
              <span className="icon">📞</span>
              <div>
                <a href="tel:+51987654321">+51 987 654 321</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <a href="mailto:contacto@arrjsoluciones.com">contacto@arrjsoluciones.com</a>
            </div>
            <div className="contact-item">
              <span className="icon">🕐</span>
              <span>Lun - Sáb: 7:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} ARRJ SOLUCIONES S.A.C. Todos los derechos reservados.
            </p>
            <div className="legal-links">
              <a href="#privacidad">Política de Privacidad</a>
              <span className="divider">|</span>
              <a href="#terminos">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
