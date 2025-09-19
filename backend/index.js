const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory products (replace with DB later)
let products = [
  { id: 3, name: "Baked Croissant", description: "freshly Baked Croissant with vegetable", category: "Snacks", price: 18, quantity: 2, sold: 0 },
  { id: 4, name: "Chicken Wings", description: "spicy Chicken Wing", category: "Food", price: 35, quantity: 22, sold: 0 },
  { id: 5, name: "Mocha Madness Latte", description: "freshly brewed hot coffee", category: "drinks", price: 25, quantity: 4, sold: 0 },
  { id: 6, name: "Hot chocolate", description: "hot chocolate topped with cream", category: "beverage", price: 24, quantity: 11, sold: 0 },
  { id: 7, name: "Milkshake", description: "Vanilla milkshake ", category: "beverage", price: 20, quantity: 4, sold: 0 },
  { id: 8, name: "Cheese Cake Slice", description: "strawberry soft cheesecake slice", category: "beverage", price: 22, quantity: 7, sold: 0 }
];

// Routes
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => String(p.id) === String(id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  products = products.filter(p => String(p.id) !== String(id));
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
