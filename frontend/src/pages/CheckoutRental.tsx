import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Checkout.css'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function CheckoutRental() {
  const query = useQuery()
  const rentalId = query.get('rentalId')
  const token = query.get('token')
  const navigate = useNavigate()
  const [rental, setRental] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [buyerDetails, setBuyerDetails] = useState({
    address: '',
    paymentMethod: 'bank_transfer',
    notes: ''
  })

  useEffect(() => {
    if (!rentalId) return
    setLoading(true)
    const API = (import.meta.env.VITE_API_URL as string) || '/api'
    fetch(`${API}/rentals/${rentalId}`)
      .then((r) => r.json())
      .then((data) => {
        // rentals GET may return plain rental or { ok:true, rental, tokenExpired, message }
        if (data && data.ok && data.rental) {
          setRental(data.rental)
          if (data.message) setMessage(data.message)
          if (data.tokenExpired && !data.message) setMessage('Reserva expirada')
        } else {
          setRental(data)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [rentalId])

  const [message, setMessage] = useState<string | null>(null)

  if (!rentalId) return <div className="container">Rental ID missing in URL</div>
  if (loading) return <div className="container">Cargando...</div>
  if (!rental) return <div className="container">Reserva no encontrada</div>

  if (message) {
    return (
      <div className="checkout-page container">
        <h1>{message}</h1>
        <p>Esta reserva no puede ser procesada.</p>
      </div>
    )
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const API = (import.meta.env.VITE_API_URL as string) || '/api'
      const payload = {
        buyerDetails: JSON.stringify(buyerDetails),
        status: 'completed',
        notes: buyerDetails.notes || rental.notes || '',
        token
      }
      const res = await fetch(`${API}/rentals/${rentalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      alert('✅ Reserva completada. Gracias.')
      navigate('/cart')
    } catch (err) {
      console.error(err)
      alert('Error al completar la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page container">
      <h1>Confirmar Reserva</h1>
      <section className="sale-summary">
        <h2>Resumen</h2>
        <p><strong>Nombre:</strong> {rental.customerName}</p>
        <p><strong>Email:</strong> {rental.email}</p>
        <p><strong>Teléfono:</strong> {rental.phone}</p>
        <p><strong>Items:</strong></p>
        <ul>
          {(Array.isArray(rental.items) ? rental.items : (() => { try { return JSON.parse(rental.items || '[]') } catch { return [] } })()).map((it: any, i: number) => (
            <li key={i}>{it.name ?? it.productName ?? JSON.stringify(it)} {it.qty ? ` — ${it.qty}` : ''}</li>
          ))}
        </ul>
        <p><strong>Total:</strong> S/ {rental.total ?? '—'}</p>
      </section>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Datos de la reserva</h2>
        <div className="form-group">
          <label>Dirección de entrega</label>
          <input type="text" value={buyerDetails.address} onChange={(e) => setBuyerDetails({...buyerDetails, address: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Método de pago</label>
          <select value={buyerDetails.paymentMethod} onChange={(e) => setBuyerDetails({...buyerDetails, paymentMethod: e.target.value})}>
            <option value="bank_transfer">Transferencia bancaria</option>
            <option value="card">Tarjeta (simulada)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notas adicionales</label>
          <textarea value={buyerDetails.notes} onChange={(e) => setBuyerDetails({...buyerDetails, notes: e.target.value})} />
        </div>

        <div className="actions">
          <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Procesando...' : 'Confirmar Reserva'}</button>
        </div>
      </form>
    </div>
  )
}
