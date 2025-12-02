import './AdminDashboard.css'

export default function AdminHome() {
  return (
    <>
      <section className="cards-row">
        <div className="card info">
          <h3>Inventario Total</h3>
          <div className="big">248</div>
          <div className="muted">145 disponibles · 103 en uso</div>
        </div>
        <div className="card info green">
          <h3>Alquileres Activos</h3>
          <div className="big">42</div>
          <div className="muted">6 finalizan esta semana</div>
        </div>
        <div className="card info yellow">
          <h3>Ventas del Mes</h3>
          <div className="big">S/ 125K</div>
          <div className="muted">12 transacciones</div>
        </div>
        <div className="card info red">
          <h3>Mantenimiento</h3>
          <div className="big">8</div>
          <div className="muted">3 críticos · 5 programados</div>
        </div>
      </section>

      <section className="panels-row">
        <div className="panel large">
          <h4>Estadísticas Financieras</h4>
          <div className="chart-placeholder">[Gráfica de ingresos por alquiler/venta]</div>
        </div>
        <div className="panel small">
          <h4>Resumen de Ventas Mensuales</h4>
          <div className="mini-cards">
            <div className="mini"> <strong>Ventas</strong><div className="num">18</div></div>
            <div className="mini"> <strong>Ingresos</strong><div className="num">125K</div></div>
            <div className="mini"> <strong>Promedio</strong><div className="num">6.9K</div></div>
          </div>
          <div className="chart-placeholder small">[Mini gráfico]</div>
        </div>
      </section>

      <section className="table-row">
        <div className="panel">
          <h4>Alquileres Activos</h4>
          <table className="table">
            <thead><tr><th>Equipo</th><th>Cliente</th><th>Fin</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td>Excavadora CAT 320</td><td>Constructora López</td><td>25 Oct</td><td><span className="tag active">Activo</span></td></tr>
              <tr><td>Grúa Móvil 50T</td><td>Edificaciones SA</td><td>28 Oct</td><td><span className="tag active">Activo</span></td></tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h4>Alertas de Mantenimiento</h4>
          <ul className="alerts">
            <li className="alert critical">Excavadora CAT 320 — Mantenimiento Preventivo</li>
            <li className="alert warning">Grúa Móvil 50T — Revisión hidráulica</li>
            <li className="alert info">Mezcladora Industrial — Calibración</li>
          </ul>
        </div>
      </section>
    </>
  )
}
