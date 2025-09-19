import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        // More robust sold defaulting:
        const initialized = data.map(p => ({
          ...p,
          // Use typeof check to allow sold=0 without override
          sold: typeof p.sold === 'number' ? p.sold : 0,
        }));
        setProducts(initialized);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  const addProduct = (product) => {
    setProducts(prev => [...prev, { ...product, sold: 0 }]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const sellProduct = (productId, quantitySold) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newQuantity = Math.max(p.quantity - quantitySold, 0);
          const newSold = (typeof p.sold === 'number' ? p.sold : 0) + quantitySold;
          return {
            ...p,
            quantity: newQuantity,
            sold: newSold,
          };
        }
        return p;
      })
    );
  };

  const productsWithRevenue = products.map(p => ({
    ...p,
    revenue: (typeof p.sold === 'number' ? p.sold : 0) * (p.price || 0),
  }));

  const totalRevenue = productsWithRevenue.reduce(
    (acc, p) => acc + p.revenue,
    0
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        sellProduct,
        productsWithRevenue,
        totalRevenue,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
