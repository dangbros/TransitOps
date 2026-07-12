import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
