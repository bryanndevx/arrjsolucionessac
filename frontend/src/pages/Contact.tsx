import { useEffect, useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    motivo: '',
    mensaje: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    try {
      const API = (import.meta.env.VITE_API_URL as string) || '/api'
      const payload = {
        name: formData.nombre,
        email: formData.email,
        phone: formData.telefono,
        subject: formData.motivo,
        message: formData.mensaje
      }

      const res = await fetch(`${API}/mail/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      setStatus('success')
      setFormData({ nombre: '', telefono: '', email: '', motivo: '', mensaje: '' })
      alert('✅ ¡Mensaje enviado exitosamente! Te responderemos pronto.')
    } catch (error) {
      console.error('Error al enviar email via backend:', error)
      setStatus('error')
      alert('❌ Error al enviar el mensaje. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Inicializar emailjs al montar por si alguna parte del flujo lo requiere
  useEffect(() => {
    // Nothing to init on client anymore; emails are sent via backend SMTP
  }, [])

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Póngase en Contacto con Nosotros</h1>
          <p>
            Complete el formulario o utilice nuestros datos de contacto directo. Nuestro equipo de 
            expertos le responderá a la brevedad.
          </p>
        </div>
      </section>

      <div className="contact-container container">
        {/* Contact Form */}
        <div className="contact-form-section">
          <form onSubmit={submit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Introduzca su nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  placeholder="+34 123 456 789"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="email@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="motivo">Motivo de contacto</label>
              <select
                id="motivo"
                value={formData.motivo}
                onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                required
              >
                <option value="">Seleccione un motivo</option>
                <option value="alquiler">Consulta sobre Alquiler</option>
                <option value="venta">Consulta sobre Venta</option>
                <option value="soporte">Soporte Técnico</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                rows={5}
                placeholder="Escriba su mensaje aquí..."
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Enviando...' : 'Enviar Mensaje'}
            </button>
            
            {status === 'success' && (
              <div style={{color: 'green', marginTop: '1rem', textAlign: 'center'}}>
                ✅ ¡Mensaje enviado exitosamente!
              </div>
            )}
            {status === 'error' && (
              <div style={{color: 'red', marginTop: '1rem', textAlign: 'center'}}>
                ❌ Error al enviar. Intenta nuevamente.
              </div>
            )}
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <aside className="contact-info-sidebar">
          <h2>Nuestra Información</h2>

          <div className="info-item">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#2b5d8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="#2b5d8a" strokeWidth="2"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>Dirección</h3>
              <p>Lima, Perú</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22 20.49 21.54 20.99 20.97 21C9.43 21.47 2.53 14.57 3 3.03C3.01 2.46 3.51 2 4.08 2H7.08C7.65 2 8.13 2.46 8.16 3.03C8.23 4.42 8.5 5.77 9 7.04C9.15 7.41 9.04 7.85 8.72 8.13L6.79 9.64C8.38 12.93 11.07 15.62 14.36 17.21L15.87 15.28C16.15 14.96 16.59 14.85 16.96 15C18.23 15.5 19.58 15.77 20.97 15.84C21.54 15.87 22 16.35 22 16.92Z" stroke="#2b5d8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>Teléfono</h3>
              <p>+51 987 654 321</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="#2b5d8a" strokeWidth="2"/>
                <path d="M3 7L12 13L21 7" stroke="#2b5d8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>Email</h3>
              <p>contacto@arrjsoluciones.com</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#2b5d8a" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="#2b5d8a" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>Horario</h3>
              <p>Lunes a Viernes: 08:00 - 18:00</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="map-placeholder">
            <img src="https://via.placeholder.com/300x200/e5e8eb/718096?text=Mapa" alt="Ubicación" />
          </div>
        </aside>
      </div>
    </div>
  )
}
