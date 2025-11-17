import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/app.css'
import { Header, Footer } from './components/layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import CartPage from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
