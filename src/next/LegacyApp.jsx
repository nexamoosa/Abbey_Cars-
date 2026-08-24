'use client'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../Layout'
import Home from '../legacy-pages/Home'
import About from '../legacy-pages/About'
import Fleet from '../legacy-pages/Fleet'
import Services from '../legacy-pages/Services'
import ServiceDetail from '../legacy-pages/ServiceDetail'
import Faq from '../legacy-pages/Faq'
import Areas from '../legacy-pages/Areas'
import Blogs from '../legacy-pages/Blogs'
import Contact from '../legacy-pages/Contact'
import Booking from '../legacy-pages/Booking'
import Login from '../legacy-pages/Login'
import Admin from '../legacy-pages/Admin'
import ErrorBouncing from '../legacy-pages/ErrorBouncing'
import CategoryPage from '../legacy-pages/CategoryPage'
import ScrollToTop from '../components/ScrollToTop'

export default function LegacyApp() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/error-bouncing" element={<ErrorBouncing />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-fleet" element={<Fleet />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/areas-we-cover" element={<Areas />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/:category/:slug" element={<CategoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
