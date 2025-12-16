import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Checkout.css'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Checkout() {
  const query = useQuery()
  const saleId = query.get('saleId')
  const token = query.get('token')
  const navigate = useNavigate()
  const [sale, setSale] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [buyerDetails, setBuyerDetails] = useState({
    address: '',
    paymentMethod: 'bank_transfer',
    notes: ''
  })

  useEffect(() => {
    if (!saleId) return
    setLoading(true)
    const API = (import.meta.env.VITE_API_URL as string) || '/api'
    fetch(`${API}/sales/${saleId}`)
      .then((r) => r.json())
      .then((data) => setSale(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [saleId])

  if (!saleId) return <div className="container">Sale ID missing in URL</div>
  if (loading) return <div className="container">Cargando...</div>
  if (!sale) return <div className="container">Venta no encontrada</div>

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const API = (import.meta.env.VITE_API_URL as string) || '/api'
      const payload = {
        buyerDetails: JSON.stringify(buyerDetails),
        status: 'completed',
        notes: buyerDetails.notes || sale.notes || '',
        token
      }
      const res = await fetch(`${API}/sales/${saleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      alert('✅ Compra completada. Gracias por su compra.')
      navigate('/cart')
    } catch (err) {
      console.error(err)
      alert('Error al completar la compra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page container">
      <h1>Confirmar Compra</h1>
      <section className="sale-summary">
        <h2>Resumen</h2>
        <p><strong>Nombre:</strong> {sale.customerName}</p>
        <p><strong>Email:</strong> {sale.email}</p>
        <p><strong>Teléfono:</strong> {sale.phone}</p>
        <p><strong>Items:</strong></p>
        <ul>
          {(Array.isArray(sale.items) ? sale.items : (() => { try { return JSON.parse(sale.items || '[]') } catch { return [] } })()).map((it: any, i: number) => (
            <li key={i}>{it.name ?? it.productName ?? JSON.stringify(it)} {it.qty ? ` — ${it.qty}` : ''}</li>
          ))}
        </ul>
        <p><strong>Total:</strong> S/ {sale.total ?? '—'}</p>
      </section>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Datos de la compra</h2>
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
          <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Procesando...' : 'Confirmar Compra'}</button>
        </div>
      </form>
    </div>
  )
}
