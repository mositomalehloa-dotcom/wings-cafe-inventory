import React, { useState, useEffect } from 'react';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [editProduct, setEditProduct] = useState(null);
  const [transaction, setTransaction] = useState({ productId: '', quantity: '' });

  const BACKEND_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  // fetch all products initially
  useEffect(() => {
    fetch(`${BACKEND_BASE}/api/products`)
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error('Fetch products error:', err));
  }, [BACKEND_BASE]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      quantity: parseInt(newProduct.quantity, 10) || 0,
    };

    fetch(`${BACKEND_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToAdd),
    })
      .then(res => res.json())
      .then(data => {
        setProducts(prev => [...prev, data]);
        setNewProduct({ name: '', description: '', category: '', price: '', quantity: '' });
      })
      .catch(err => console.error('Add product error:', err));
  };

  const handleUpdateProduct = () => {
    if (!editProduct) return;

    fetch(`${BACKEND_BASE}/api/products/${editProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProduct),
    })
      .then(res => res.json())
      .then(data => {
        setProducts(prev => prev.map(p => (p.id === data.id ? data : p)));
        setEditProduct(null);
      })
      .catch(err => console.error('Update error:', err));
  };

  const handleDeleteProduct = () => {
    if (!editProduct) return;

    fetch(`${BACKEND_BASE}/api/products/${editProduct.id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setProducts(prev => prev.filter(p => p.id !== editProduct.id));
          setEditProduct(null);
        }
      })
      .catch(err => console.error('Delete error:', err));
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    const product = products.find(p => String(p.id) === String(transaction.productId));
    if (!product) return alert('Product not found');

    const quantityChange = parseInt(transaction.quantity, 10);
    const updatedProduct = { ...product, quantity: product.quantity + quantityChange };

    if (updatedProduct.quantity < 0) return alert('Quantity cannot be negative.');

    fetch(`${BACKEND_BASE}/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then(res => res.json())
      .then(data => {
        setProducts(prev => prev.map(p => (p.id === data.id ? data : p)));
        setTransaction({ productId: '', quantity: '' });
      })
      .catch(err => console.error('Transaction error:', err));
  };

  return (
    <main className="inventory-container">
      <header>
        <h1>WINGS CAFE INVENTORY SYSTEM</h1>
        <h2>Managing Our Products</h2>
      </header>

      <section className="inventory-card">
        <h3>Product Inventory</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price (M)</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>M{Number(product.price || 0).toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td className={product.quantity > 10 ? 'in-stock' : 'low-stock'}>
                  {product.quantity > 10 ? 'In Stock' : 'Low Stock'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="inventory-card grid-card">
        <h3>Update / Delete</h3>
        <select
          onChange={e => setEditProduct(products.find(p => String(p.id) === String(e.target.value)) || null)}
          value={editProduct?.id || ''}
        >
          <option value="">Select a product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {editProduct && (
          <div className="prod-card">
            <h4>{editProduct.name}</h4>
            <p>Stock: {editProduct.quantity}</p>
            <p>Price: M{Number(editProduct.price || 0).toFixed(2)}</p>
            <div className="button-group">
              <button onClick={handleUpdateProduct}>Update</button>
              <button onClick={handleDeleteProduct} className="delete-button">Delete</button>
            </div>
          </div>
        )}
      </section>

      <section className="inventory-card">
        <h3>Record Stock Transaction</h3>
        <form onSubmit={handleTransaction}>
          <select name="productId" value={transaction.productId} onChange={handleTransactionChange} required>
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <input
            name="quantity"
            value={transaction.quantity}
            onChange={handleTransactionChange}
            placeholder="Quantity to add/deduct"
            type="number"
            required
          />
          <button type="submit">Record Transaction</button>
        </form>
      </section>

      <section className="inventory-card">
        <h3>➕ Add New Product</h3>
        <form onSubmit={handleAddProduct}>
          <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" required />
          <input name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" required />
          <input name="category" value={newProduct.category} onChange={handleInputChange} placeholder="Category" required />
          <input name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price" type="number" step="0.01" required />
          <input name="quantity" value={newProduct.quantity} onChange={handleInputChange} placeholder="Quantity" type="number" required />
          <button type="submit">Add Product</button>
        </form>
      </section>
    </main>
  );
};

export default Inventory;
