import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './styles/app.css'
import { Header, Footer } from './components/layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import CartPage from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import CheckoutRental from './pages/CheckoutRental'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import AdminHome from './pages/AdminHome'
import AdminInventory from './pages/AdminInventory'
import AdminOrders from './pages/AdminOrders'
import AdminMaintenance from './pages/AdminMaintenance'
import AdminReports from './pages/AdminReports'
import AdminSettings from './pages/AdminSettings'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppLayout() {
  const location = useLocation()
  const hideShell = location.pathname.startsWith('/admin')

  return (
    <>
      {!hideShell && <Header />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-rental" element={<CheckoutRental />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<AdminHome />} />
            <Route path="inventario" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="mantenimiento" element={<AdminMaintenance />} />
            <Route path="reportes" element={<AdminReports />} />
            <Route path="configuracion" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </>
  )
}

export default App
