import { useState, useEffect } from 'react'
import './AdminDashboard.css'

export default function AdminReports() {
  const [reportType, setReportType] = useState<'sales' | 'rentals' | 'inventory'>('sales')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Establecer fechas por defecto (primer día del mes hasta hoy)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    setDateFrom(startOfMonth.toISOString().split('T')[0])
    setDateTo(now.toISOString().split('T')[0])
  }, [])

  const generateReport = async () => {
    if (!dateFrom || !dateTo) {
      alert('Por favor selecciona un rango de fechas')
      return
    }

    setLoading(true)
    try {
      const API = (import.meta.env.VITE_API_URL as string) || '/api'
      const res = await fetch(`${API}/orders/reports/${reportType}?dateFrom=${dateFrom}&dateTo=${dateTo}`)
      const data = await res.json()
      if (data.success) {
        setReportData(data.data)
      } else {
        alert('Error al generar el reporte')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // Generar reporte automáticamente cuando cambian las fechas
  useEffect(() => {
    if (dateFrom && dateTo) {
      generateReport()
    }
  }, [reportType, dateFrom, dateTo])

  const exportToExcel = () => {
    alert('📥 Exportando a Excel...')
  }

  const exportToPDF = () => {
    alert('📄 Exportando a PDF...')
  }

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 style={{marginBottom: '1.5rem'}}>Reportes y Análisis</h2>

      {/* Selector de tipo de reporte */}
      <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem'}}>Generar Reporte</h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem'}}>
          <button
            onClick={() => setReportType('sales')}
            style={{
              padding: '1rem',
              background: reportType === 'sales' ? '#7c3aed' : 'white',
              color: reportType === 'sales' ? 'white' : '#374151',
              border: '2px solid',
              borderColor: reportType === 'sales' ? '#7c3aed' : '#e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            💰 Ventas
          </button>
          <button
            onClick={() => setReportType('rentals')}
            style={{
              padding: '1rem',
              background: reportType === 'rentals' ? '#10b981' : 'white',
              color: reportType === 'rentals' ? 'white' : '#374151',
              border: '2px solid',
              borderColor: reportType === 'rentals' ? '#10b981' : '#e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            🏗️ Alquileres
          </button>
          <button
            onClick={() => setReportType('inventory')}
            style={{
              padding: '1rem',
              background: reportType === 'inventory' ? '#f59e0b' : 'white',
              color: reportType === 'inventory' ? 'white' : '#374151',
              border: '2px solid',
              borderColor: reportType === 'inventory' ? '#f59e0b' : '#e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            📦 Inventario
          </button>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem', marginBottom: '1rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
              Fecha Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
              Fecha Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
            />
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: '0.5rem'}}>
            <button
              onClick={generateReport}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.6rem 1.2rem',
                background: loading ? '#9ca3af' : '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              {loading ? '⏳ Generando...' : '📊 Actualizar'}
            </button>
            <button
              onClick={exportToExcel}
              disabled={!reportData}
              style={{
                padding: '0.6rem 1rem',
                background: reportData ? '#10b981' : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: reportData ? 'pointer' : 'not-allowed'
              }}
            >
              📥 Excel
            </button>
            <button
              onClick={exportToPDF}
              disabled={!reportData}
              style={{
                padding: '0.6rem 1rem',
                background: reportData ? '#ef4444' : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: reportData ? 'pointer' : 'not-allowed'
              }}
            >
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      {reportData && reportType === 'sales' && reportData.summary && (
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '1rem'}}>Resumen de Ventas</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem'}}>
            <div style={{padding: '1rem', background: '#fef3c7', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem'}}>Total Ventas</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#92400e'}}>
                S/ {(reportData.summary.total || 0).toLocaleString('es-PE', {minimumFractionDigits: 2})}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#dbeafe', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem'}}>Total Transacciones</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#1e40af'}}>
                {reportData.summary.count || 0}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#dcfce7', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem'}}>Promedio/Venta</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#166534'}}>
                S/ {((reportData.summary.average || 0)/1000).toFixed(1)}K
              </div>
            </div>
          </div>

          {/* Desglose por estado */}
          {reportData.byStatus && (
            <>
              <h4 style={{marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem'}}>Estado de las Ventas</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem'}}>
                <div style={{padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem'}}>Pendientes</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 700, color: '#92400e'}}>
                    {reportData.byStatus.pending || 0}
                  </div>
                </div>
                <div style={{padding: '0.75rem', background: '#dbeafe', borderRadius: '6px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem'}}>Cotizadas</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 700, color: '#1e40af'}}>
                    {reportData.byStatus.quoted || 0}
                  </div>
                </div>
                <div style={{padding: '0.75rem', background: '#dcfce7', borderRadius: '6px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: '#166534', marginBottom: '0.25rem'}}>Aceptadas</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 700, color: '#166534'}}>
                    {reportData.byStatus.accepted || 0}
                  </div>
                </div>
                <div style={{padding: '0.75rem', background: '#e0e7ff', borderRadius: '6px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: '#3730a3', marginBottom: '0.25rem'}}>En Proceso</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 700, color: '#3730a3'}}>
                    {reportData.byStatus.in_progress || 0}
                  </div>
                </div>
                <div style={{padding: '0.75rem', background: '#d1fae5', borderRadius: '6px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: '#065f46', marginBottom: '0.25rem'}}>Completadas</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 700, color: '#065f46'}}>
                    {reportData.byStatus.completed || 0}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {reportData && reportType === 'rentals' && reportData.summary && (
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '1rem'}}>Resumen de Alquileres</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
            <div style={{padding: '1rem', background: '#dcfce7', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem'}}>Activos</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#166534'}}>
                {reportData.summary.active || 0}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#dbeafe', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem'}}>Completados</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#1e40af'}}>
                {reportData.summary.completed || 0}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#e0e7ff', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#3730a3', marginBottom: '0.5rem'}}>Equipos en Uso</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#3730a3'}}>
                {reportData.summary.equipmentInUse || 0}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#fef3c7', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem'}}>Total Ingresos</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#92400e'}}>
                S/ {((reportData.summary.total || 0)/1000).toFixed(1)}K
              </div>
            </div>
          </div>
        </div>
      )}

      {reportData && reportType === 'inventory' && reportData.summary && (
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '1rem'}}>Resumen de Inventario</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
            <div style={{padding: '1rem', background: '#dbeafe', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem'}}>Total Unidades</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#1e40af'}}>
                {reportData.summary.totalUnits || 0}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#dcfce7', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem'}}>Tipos de Equipos</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#166534'}}>
                {reportData.summary.totalProducts || 0}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#fef3c7', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem'}}>Con Stock</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#92400e'}}>
                {reportData.summary.withStock || 0}
              </div>
            </div>
            <div style={{padding: '1rem', background: '#fee2e2', borderRadius: '8px'}}>
              <div style={{fontSize: '0.875rem', color: '#991b1b', marginBottom: '0.5rem'}}>Stock Bajo</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#991b1b'}}>
                {reportData.summary.lowStock || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa de tabla de datos */}
      <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginTop: 0, marginBottom: '1rem'}}>
          {reportData ? 'Detalle de Datos' : 'Vista Previa de Datos'}
        </h3>
        
        {!reportData && (
          <div style={{padding: '2rem', background: '#f9fafb', borderRadius: '8px', textAlign: 'center', color: '#9ca3af'}}>
            📊 Selecciona fechas para generar el reporte
          </div>
        )}

        {reportData && reportType === 'sales' && reportData.orders && reportData.orders.length > 0 && (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>ID</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Cliente</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Fecha</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Total</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reportData.orders.map((order: any) => (
                  <tr key={order.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                    <td style={{padding: '0.75rem'}}>#{order.id}</td>
                    <td style={{padding: '0.75rem'}}>{order.customer}</td>
                    <td style={{padding: '0.75rem'}}>{new Date(order.date).toLocaleDateString('es-PE')}</td>
                    <td style={{padding: '0.75rem', fontWeight: 600}}>S/ {Number(order.total).toLocaleString('es-PE', {minimumFractionDigits: 2})}</td>
                    <td style={{padding: '0.75rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: 
                          order.status === 'completed' ? '#dcfce7' : 
                          order.status === 'accepted' ? '#d1fae5' :
                          order.status === 'in_progress' ? '#e0e7ff' :
                          order.status === 'quoted' ? '#dbeafe' : '#fef3c7',
                        color: 
                          order.status === 'completed' ? '#166534' : 
                          order.status === 'accepted' ? '#065f46' :
                          order.status === 'in_progress' ? '#3730a3' :
                          order.status === 'quoted' ? '#1e40af' : '#92400e'
                      }}>
                        {
                          order.status === 'completed' ? 'Completado' : 
                          order.status === 'accepted' ? 'Aceptado' :
                          order.status === 'in_progress' ? 'En Proceso' :
                          order.status === 'quoted' ? 'Cotizado' :
                          order.status === 'pending' ? 'Pendiente' : order.status
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportData && reportType === 'rentals' && reportData.orders && reportData.orders.length > 0 && (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>ID</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Cliente</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Equipo</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Fecha</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Total</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reportData.orders.map((order: any) => (
                  <tr key={order.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                    <td style={{padding: '0.75rem'}}>#{order.id}</td>
                    <td style={{padding: '0.75rem'}}>{order.customer}</td>
                    <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{order.equipment}</td>
                    <td style={{padding: '0.75rem'}}>{new Date(order.date).toLocaleDateString('es-PE')}</td>
                    <td style={{padding: '0.75rem', fontWeight: 600}}>S/ {Number(order.total).toLocaleString('es-PE', {minimumFractionDigits: 2})}</td>
                    <td style={{padding: '0.75rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: order.status === 'in_progress' ? '#dbeafe' : order.status === 'completed' ? '#dcfce7' : '#fef3c7',
                        color: order.status === 'in_progress' ? '#1e40af' : order.status === 'completed' ? '#166534' : '#92400e'
                      }}>
                        {order.status === 'in_progress' ? 'En Progreso' : order.status === 'completed' ? 'Completado' : order.status === 'accepted' ? 'Aceptado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportData && reportType === 'inventory' && reportData.items && reportData.items.length > 0 && (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>ID Producto</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Stock Actual</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Stock Mínimo</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Ubicación</th>
                  <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: 600}}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reportData.items.map((item: any) => (
                  <tr key={item.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                    <td style={{padding: '0.75rem'}}>#{item.productId}</td>
                    <td style={{padding: '0.75rem', fontWeight: 600}}>{item.stock}</td>
                    <td style={{padding: '0.75rem'}}>{item.minStock}</td>
                    <td style={{padding: '0.75rem'}}>{item.location || 'N/A'}</td>
                    <td style={{padding: '0.75rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: item.status === 'low' ? '#fee2e2' : '#dcfce7',
                        color: item.status === 'low' ? '#991b1b' : '#166534'
                      }}>
                        {item.status === 'low' ? '⚠️ Stock Bajo' : '✓ OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportData && ((reportType === 'sales' && (!reportData.orders || reportData.orders.length === 0)) ||
                        (reportType === 'rentals' && (!reportData.orders || reportData.orders.length === 0)) ||
                        (reportType === 'inventory' && (!reportData.items || reportData.items.length === 0))) && (
          <div style={{padding: '2rem', background: '#f9fafb', borderRadius: '8px', textAlign: 'center', color: '#9ca3af'}}>
            No hay datos disponibles para el período seleccionado
          </div>
        )}
      </div>
    </div>
  )
}
