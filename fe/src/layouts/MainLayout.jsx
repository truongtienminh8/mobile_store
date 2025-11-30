import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import FloatingButtons from '../components/FloatingButtons/FloatingButtons'
import './MainLayout.css'

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}

export default MainLayout