import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Outlet } from 'react-router'

import Header from './components/Header'
import Footer from './components/Footer'
import BasePage from './pages/BasePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BasePage />
      {/* <Header />
      <Outlet />
      <Footer /> */}
    </>
  )
}

export default App
