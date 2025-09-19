import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_BASE = 'https://wings-cafe-inventory-gluw.onrender.com';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get(`${BACKEND_BASE}/api/products`).then((res) => {
      setProducts(res.data);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios
        .put(`${BACKEND_BASE}/api/products/${editingId}`, form)
        .then(() => {
          fetchProducts();
          resetForm();
        });
    } else {
      axios
        .post(`${BACKEND_BASE}/api/products`, form)
        .then(() => {
          fetchProducts();
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: '',
      price: 0,
      quantity: 0,
    });
    setEditingId(null);
  };

  const editProduct = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const deleteProduct = (id) => {
    axios.delete(`${BACKEND_BASE}/api/products/${id}`).then(fetchProducts);
  };

  const sellProduct = (productId) => {
    axios
      .post(`${BACKEND_BASE}/api/sell`, {
        sales: [{ id: productId, quantitySold: 1 }],
      })
      .then(() => fetchProducts())
      .catch((err) => {
        console.error('Failed to sell product', err);
      });
  };

  return (
    <div>
      <h1>Product Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        <button type="button" onClick={resetForm}>
          Cancel
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className={p.quantity < 10 ? 'low-stock' : ''}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
                <button onClick={() => sellProduct(p.id)}>Sell 1</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManagement;
