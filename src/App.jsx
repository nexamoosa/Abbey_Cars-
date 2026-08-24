import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import Home from './pages/Home'
import About from './pages/About'
import Fleet from './pages/Fleet'
import Services from './pages/Services'
import Faq from './pages/Faq'
import Areas from './pages/Areas'
import Blogs from './pages/Blogs'
import Contact from './pages/Contact'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ErrorBouncing from './pages/ErrorBouncing'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-fleet" element={<Fleet />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/areas-we-cover" element={<Areas />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/error-bouncing" element={<ErrorBouncing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
