import React, { useContext, useState } from 'react';
import { ProductContext } from '../ProductContext';
import './Reporting.css';

const Reporting = () => {
  const {
    productsWithRevenue: rows,
    loading,
    error,
    totalRevenue,
    salesHistory = [], // ✅ NEW: sales history list from context
  } = useContext(ProductContext);

  const [showLowStockList, setShowLowStockList] = useState(false);

  const totalAvailable = rows.reduce((sum, r) => sum + r.quantity, 0);
  const lowStockProducts = rows.filter(r => r.quantity < 5);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const toggleLowStockList = () => setShowLowStockList(prev => !prev);

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '2rem' }}>
      <div className="reporting-card" style={{ marginBottom: '1.5rem' }}>
        <h2>Daily Sales Report</h2>

        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Total Revenue:</strong> M{totalRevenue.toFixed(2)}</p>
          <p><strong>Total Products Available:</strong> {totalAvailable}</p>
          <p>
            <strong>Low Stock Products:</strong> {lowStockProducts.length}{' '}
            <button onClick={toggleLowStockList}>
              {showLowStockList ? 'Hide' : 'Show'}
            </button>
          </p>
        </div>

        {showLowStockList && (
          <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: 8, marginBottom: '1.5rem' }}>
            <h4>Low Stock Products (Less than 5)</h4>
            {lowStockProducts.length === 0 ? (
              <p>No products are low in stock.</p>
            ) : (
              <ul>
                {lowStockProducts.map(p => (
                  <li key={p.id}>
                    {p.name} - {p.quantity} left
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="reporting-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
          <thead style={{ backgroundColor: '#e2efe6ff' }}>
            <tr>
              <th style={thTdStyle}>Product Name</th>
              <th style={thTdStyle}>Qty</th>
              <th style={thTdStyle}>Sold</th>
              <th style={thTdStyle}>Revenue (M)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={thTdStyle}>{r.name}</td>
                <td style={thTdStyle}>{r.quantity}</td>
                <td style={thTdStyle}>{r.sold}</td>
                <td style={thTdStyle}>M{r.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ ...thTdStyle, fontWeight: 'bold' }}>Total Revenue</td>
              <td style={{ ...thTdStyle, fontWeight: 'bold' }}>M{totalRevenue.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ✅ NEW: Sales History Section */}
      <div className="reporting-card" style={{ marginTop: '2rem' }}>
        <h3>Sales History</h3>
        {salesHistory.length === 0 ? (
          <p>No sales have been recorded today.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th style={thTdStyle}>Time</th>
                <th style={thTdStyle}>Product</th>
                <th style={thTdStyle}>Quantity</th>
                <th style={thTdStyle}>Total (M)</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.map((sale, index) => (
                <tr key={index}>
                  <td style={thTdStyle}>{sale.time}</td>
                  <td style={thTdStyle}>{sale.productName}</td>
                  <td style={thTdStyle}>{sale.quantity}</td>
                  <td style={thTdStyle}>M{sale.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thTdStyle = {
  border: '1px solid #17702fff',
  padding: '1rem',
  textAlign: 'center',
};

export default Reporting;

