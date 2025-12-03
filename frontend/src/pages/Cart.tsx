import { Link } from 'react-router-dom'
import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './Cart.css'
import { useCart } from '../contexts/CartContext'

export default function CartPage() {
  const { items, remove, updateQuantity, clear } = useCart()
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    comentarios: ''
  })
  
  // Calculate subtotal
  const subtotal = items.reduce((s, i) => {
    const itemPrice = i.product.type === 'rent' && i.product.pricePerDay
      ? i.product.pricePerDay * i.quantity
      : i.product.price * i.quantity
    return s + itemPrice
  }, 0)
  
  // Calculate IGV (18%)
  const igv = subtotal * 0.18
  
  // Calculate total
  const total = subtotal + igv

  return (
    <div className="cart-page">
      <div className="cart-container container">
        <div className="cart-main">
          <h1 className="cart-title">Resumen de tu Reserva</h1>

          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío.</p>
              <Link to="/catalog" className="btn-catalog">Ir al Catálogo</Link>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => {
                const isRent = item.product.type === 'rent'
                const itemTotal = isRent && item.product.pricePerDay
                  ? item.product.pricePerDay * item.quantity
                  : item.product.price * item.quantity

                return (
                  <div key={item.product.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.product.images?.[0] ?? '/vite.svg'} alt={item.product.name} />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.product.name}</h3>
                      <p className="item-price">
                        {isRent && item.product.pricePerDay
                          ? `S/ ${item.product.pricePerDay.toLocaleString('es-PE')} por día`
                          : `S/ ${item.product.price.toLocaleString('es-PE')}`
                        }
                      </p>
                      
                      {/* Selector de cantidad/días */}
                      <div className="quantity-selector">
                        <label>
                          {isRent ? 'Días de alquiler:' : 'Cantidad:'}
                        </label>
                        <div className="quantity-controls">
                          <button 
                            className="btn-qty"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              if (val > 0) updateQuantity(item.product.id, val)
                            }}
                            className="qty-input"
                          />
                          <button 
                            className="btn-qty"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="item-right">
                      <div className="item-total">
                        S/ {itemTotal.toLocaleString('es-PE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </div>
                      <button 
                        className="btn-remove"
                        onClick={() => remove(item.product.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <aside className="cart-summary">
            <div className="summary-card">
              <h2>Resumen de Costos</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-value">
                  S/ {subtotal.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

              <div className="summary-row">
                <span>IGV (18%)</span>
                <span className="summary-value">
                  S/ {igv.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total Estimado</span>
                <span className="total-value">
                  S/ {total.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

              <p className="summary-note">
                <strong>Proceso de Cotización:</strong><br/>
                1. Envía tu solicitud con los equipos seleccionados<br/>
                2. Recibirás una cotización formal detallada por correo<br/>
                3. Nuestro equipo te contactará para coordinar contrato y pago<br/>
                4. Se programa la entrega/inicio del servicio
              </p>

              <button 
                className="btn-request-quote"
                onClick={() => setShowQuoteForm(true)}
              >
                📧 Solicitar Cotización Formal
              </button>

              <Link to="/catalog" className="btn-back-catalog">
                Volver al Catálogo
              </Link>

              <p className="contact-info">
                ¿Tienes dudas? Llámanos al <strong>+51 987 654 321</strong>
              </p>
            </div>
          </aside>
        )}
      </div>

      {/* Modal de Formulario de Cotización */}
      {showQuoteForm && (
        <div className="modal-overlay" onClick={() => setShowQuoteForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQuoteForm(false)}>✕</button>
            
            <h2>Solicitar Cotización</h2>
            <p className="modal-subtitle">
              Complete sus datos para recibir una cotización formal detallada
            </p>

            <form 
              className="quote-form"
              onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)

                try {
                  // Configuración EmailJS
                  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
                  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_QUOTE_ID
                  const EMAIL_DESTINO = import.meta.env.VITE_EMAIL_DESTINO

                  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
                    console.error('Faltan variables de EmailJS:', { PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID })
                    alert('❌ Configuración de EmailJS incompleta. Revisa las variables de entorno.')
                    setLoading(false)
                    return
                  }

                  // Lista de productos para el email
                  const productsList = items.map(item =>
                    `- ${item.product.name} (${item.quantity} ${item.product.type === 'rent' ? 'días' : 'unidades'})`
                  ).join('\n')

                  // Enviar email con EmailJS
                  await emailjs.send(
                    SERVICE_ID,
                    TEMPLATE_ID,
                    {
                      from_name: formData.nombre,
                      from_email: formData.email,
                      phone: formData.telefono,
                      company: formData.empresa || 'No especificada',
                      message: `Productos solicitados:\n${productsList}\n\nComentarios: ${formData.comentarios || 'Sin comentarios'}\n\nSubtotal: S/ ${subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\nIGV (18%): S/ ${igv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\nTotal: S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
                      to_email: EMAIL_DESTINO || formData.email,
                    },
                    PUBLIC_KEY
                  )

                  alert(`✅ ¡Cotización enviada exitosamente!\n\n📧 Se envió a: ${EMAIL_DESTINO}\n\nRecibirás una respuesta dentro de las próximas 24 horas.\n\nTotal: S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`)
                  setShowQuoteForm(false)
                  clear()
                  setFormData({ nombre: '', empresa: '', telefono: '', email: '', comentarios: '' })
                } catch (error) {
                  console.error('Error al enviar cotización:', error)
                  alert('❌ Error al enviar la cotización. Por favor intenta nuevamente.')
                } finally {
                  setLoading(false)
                }
              }}
            >
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                  placeholder="Ej: Constructora ABC S.A.C."
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  placeholder="+51 987 654 321"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="comentarios">Comentarios adicionales</label>
                <textarea
                  id="comentarios"
                  rows={3}
                  value={formData.comentarios}
                  onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                  placeholder="Indique fechas deseadas, detalles del proyecto, o cualquier requerimiento especial..."
                />
              </div>

              <div className="quote-summary">
                <strong>Resumen de su solicitud:</strong>
                <p>{items.length} equipo(s) seleccionado(s)</p>
                <p className="quote-total">Total estimado: S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowQuoteForm(false)} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? '⏳ Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
