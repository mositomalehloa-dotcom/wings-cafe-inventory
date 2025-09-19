
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Sales from './components/Sales';
import Reporting from './components/Reporting';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { ProductProvider } from './ProductContext'; // Import the ProductProvider

function AppWrapper() {
  return (
    <ProductProvider> {/* Wrap the entire app with ProductProvider */}
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/reporting">Reporting</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reporting" element={<Reporting />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </ProductProvider>
  );
}

export default AppWrapper;

