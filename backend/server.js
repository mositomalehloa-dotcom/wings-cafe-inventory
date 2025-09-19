const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
// customers file etc unchanged

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const getNewId = (items) =>
  items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const initializeFiles = async () => {
  try {
    await fs.access(PRODUCTS_FILE).catch(async () => {
      await fs.writeFile(
        PRODUCTS_FILE,
        JSON.stringify(
          [
            { id: 1, name: 'Wings', quantity: 100, price: 5 },
            { id: 2, name: 'Coffee', quantity: 50, price: 3 },
          ],
          null,
          2
        )
      );
      console.log('✅ Created products.json');
    });
    // customers file init unchanged
  } catch (err) {
    console.error('❌ Error initializing files:', err);
  }
};

initializeFiles();

// Other routes unchanged...

// ====== Fixed sell route ======
app.post('/api/sell', async (req, res) => {
  try {
    const { sales } = req.body;
    console.log('Sell route called. Payload:', sales);

    if (!Array.isArray(sales)) {
      console.log('Invalid sales: not array');
      return res.status(400).json({ error: 'Invalid sales data' });
    }

    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    console.log('Products before sell:', products);

    let anyUpdated = false;

    const updatedProducts = products.map((product) => {
      // Convert sale.id to number to match product.id
      const sale = sales.find((s) => Number(s.id) === Number(product.id));
      if (sale && typeof sale.quantitySold === 'number') {
        anyUpdated = true;
        const newQty = product.quantity - sale.quantitySold;
        console.log(`Updating product ${product.id}: old qty ${product.quantity}, sold ${sale.quantitySold}, new qty ${newQty < 0 ? 0 : newQty}`);
        return {
          ...product,
          quantity: Math.max(newQty, 0),
        };
      }
      return product;
    });

    if (!anyUpdated) {
      console.log('⚠️ No products matched the sales payload');
      // optionally send a different response
    }

    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(updatedProducts, null, 2));
    console.log('Products after sell written:', updatedProducts);

    res.json({ success: true, updated: updatedProducts });
  } catch (err) {
    console.error('Error in /api/sell:', err);
    res.status(500).json({ error: 'Failed to process sale', details: err.message });
  }
});

// rest of server unchanged...

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
