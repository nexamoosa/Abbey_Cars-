import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import Home from './legacy-pages/Home'
import About from './legacy-pages/About'
import Fleet from './legacy-pages/Fleet'
import Services from './legacy-pages/Services'
import Faq from './legacy-pages/Faq'
import Areas from './legacy-pages/Areas'
import Blogs from './legacy-pages/Blogs'
import Contact from './legacy-pages/Contact'
import Booking from './legacy-pages/Booking'
import Login from './legacy-pages/Login'
import Admin from './legacy-pages/Admin'
import ErrorBouncing from './legacy-pages/ErrorBouncing'

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
