import React, { useState, useEffect, useContext } from 'react';
import './Sales.css';
import './Sales.css';
import { ProductContext } from '../ProductContext'; 

const Sales = () => {
  const { products, updateProduct } = useContext(ProductContext); 
  const [initialQuantities, setInitialQuantities] = useState({});
  const [saleTargets, setSaleTargets] = useState({});
  const [sales, setSales] = useState({});
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {

    const initial = {};
    products.forEach(p => {
      initial[p.id] = p.quantity;
    });
    setInitialQuantities(initial);
  }, [products]); 

  const handleQtyInput = (id, value) => {
    setSaleTargets(prev => ({ ...prev, [id]: value }));
  };

  const formatCurrency = (amount) => `M${amount.toFixed(2)}`;

  const recordSale = (product) => {
    const qty = parseInt(saleTargets[product.id] || '0', 10);
    if (qty <= 0) return setError('Please enter a positive quantity.');
    if (qty > product.quantity) return setError(`Not enough stock for ${product.name}.`);

    const updated = { ...product, quantity: product.quantity - qty };

    fetch(`https://wings-cafe-inventory-gluw.onrender.com/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Updated product from server:', data);
        updateProduct(data); 
        setSales(prev => ({
          ...prev,
          [product.id]: (prev[product.id] || 0) + qty
        }));
        setReceipt({
          product: product.name,
          qty,
          unitPrice: product.price,
          total: qty * product.price,
          time: new Date().toLocaleString(),
        });
        setSaleTargets(prev => ({ ...prev, [product.id]: '' }));
        setError('');
      })
      .catch(err => {
        console.error('Sale error:', err);
        setError('Failed to record sale.');
      });
  };

  const compiledRows = products.map(product => {
    const startQty = initialQuantities[product.id] || product.quantity;
    const soldQty = sales[product.id] || (startQty - product.quantity);
    const remaining = product.quantity;
    const revenue = soldQty * product.price;

    return {
      ...product,
      startQty,
      soldQty,
      remaining,
      revenue
    };
  });

  return (
    <div className="sales-management">
      <h1>SALES MANAGEMENT</h1>

      <section className="inventory-grid">
        {products.map(product => (
          <div key={product.id} className="prod-card">
            <h4>{product.name}</h4>
            <p>Qty: {product.quantity}</p>
            <p>Price: {formatCurrency(product.price)}</p>
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={saleTargets[product.id] || ''}
              onChange={(e) => handleQtyInput(product.id, e.target.value)}
            />
            <button onClick={() => recordSale(product)}>Sell</button>
          </div>
        ))}
      </section>

      {error && <p className="error">{error}</p>}

      {receipt && (
        <div className="receipt">
          <p><strong>Product:</strong> {receipt.product}</p>
          <p><strong>Quantity:</strong> {receipt.qty}</p>
          <p><strong>Unit Price:</strong> {formatCurrency(receipt.unitPrice)}</p>
          <p><strong>Total:</strong> {formatCurrency(receipt.total)}</p>
          <p><strong>Time:</strong> {receipt.time}</p>
          <p className="thanks">Thank you for your purchase!</p>
        </div>
      )}

      <section className="sales-summary">
        <h2>Product Inventory </h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Start of Day</th>
              <th>Sold</th>
              <th>Total (M)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {compiledRows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.startQty}</td>
                <td>{row.soldQty}</td>
                <td>{formatCurrency(row.revenue)}</td>
                <td className={row.remaining < 5 ? 'low-stock' : 'in-stock'}>
                  {row.remaining < 5 ? 'Low Stock' : 'In Stock'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Sales;
