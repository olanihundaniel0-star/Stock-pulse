import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;
const DB_PATH = './stockpulse.db';

// Database Initialization
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function query(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function run(sql: string, params: any[] = []): Promise<{ lastID: number, changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

async function initializeDatabase() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'STAFF',
        status TEXT NOT NULL DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        image TEXT,
        cost_price REAL NOT NULL,
        selling_price REAL NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        reorder_level INTEGER NOT NULL DEFAULT 10,
        supplier_name TEXT,
        unit TEXT DEFAULT 'pcs',
        status TEXT DEFAULT 'Published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER REFERENCES products(id),
        product_name TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL,
        unit_cost REAL,
        reason TEXT,
        customer TEXT,
        supplier TEXT,
        notes TEXT,
        date TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        user_name TEXT NOT NULL
    );
  `;

  try {
    await new Promise((resolve, reject) => {
      db.exec(schema, (err) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    // Seed admin if not exists
    const admin = await get('SELECT * FROM users WHERE email = ?', ['admin@stockpulse.com']);
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        ['Admin User', 'admin@stockpulse.com', hashedPassword, 'ADMIN']);
      console.log('Admin user seeded');
    }
  } catch (err) {
    console.error('Database initialization failed', err);
  }
}

app.use(cors());
app.use(express.json());

// --- Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Product Routes ---
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM products ORDER BY name ASC');
    // Map snake_case to camelCase if needed, but for now just return
    const products = rows.map(r => ({
      ...r,
      costPrice: r.cost_price,
      sellingPrice: r.selling_price,
      reorderLevel: r.reorder_level,
      supplierName: r.supplier_name
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const { name, sku, category, description, image, costPrice, sellingPrice, quantity, reorderLevel, supplierName, unit, status } = req.body;
  try {
    const { lastID } = await run(
      `INSERT INTO products (name, sku, category, description, image, cost_price, selling_price, quantity, reorder_level, supplier_name, unit, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, category, description, image, costPrice, sellingPrice, quantity, reorderLevel, supplierName, unit, status]
    );
    const newProduct = await get('SELECT * FROM products WHERE id = ?', [lastID]);
    res.status(201).json({
      ...newProduct,
      costPrice: newProduct.cost_price,
      sellingPrice: newProduct.selling_price,
      reorderLevel: newProduct.reorder_level,
      supplierName: newProduct.supplier_name
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, sku, category, description, image, costPrice, sellingPrice, quantity, reorderLevel, supplierName, unit, status } = req.body;
  try {
    await run(
      `UPDATE products SET name=?, sku=?, category=?, description=?, image=?, cost_price=?, selling_price=?, quantity=?, reorder_level=?, supplier_name=?, unit=?, status=?
       WHERE id=?`,
      [name, sku, category, description, image, costPrice, sellingPrice, quantity, reorderLevel, supplierName, unit, status, id]
    );
    const updatedProduct = await get('SELECT * FROM products WHERE id = ?', [id]);
    res.json({
      ...updatedProduct,
      costPrice: updatedProduct.cost_price,
      sellingPrice: updatedProduct.selling_price,
      reorderLevel: updatedProduct.reorder_level,
      supplierName: updatedProduct.supplier_name
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await run('DELETE FROM products WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Transaction Routes ---
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM transactions ORDER BY date DESC LIMIT 100');
    const transactions = rows.map(r => ({
      ...r,
      productId: r.product_id,
      productName: r.product_name,
      unitPrice: r.unit_price,
      unitCost: r.unit_cost,
      userId: r.user_id,
      userName: r.user_name
    }));
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { productId, productName, type, quantity, unitPrice, unitCost, reason, customer, supplier, notes, date } = req.body;
  
  try {
    await run('BEGIN TRANSACTION');
    
    // Insert transaction
    const { lastID } = await run(
      `INSERT INTO transactions (product_id, product_name, type, quantity, unit_price, unit_cost, reason, customer, supplier, notes, date, user_id, user_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, productName, type, quantity, unitPrice, unitCost, reason, customer, supplier, notes, date, (req as any).user.id, (req as any).user.name || 'User']
    );

    // Update product quantity
    const delta = type === 'STOCK_IN' ? quantity : -quantity;
    await run(
      'UPDATE products SET quantity = quantity + ? WHERE id = ?',
      [delta, productId]
    );

    await run('COMMIT');
    const newTx = await get('SELECT * FROM transactions WHERE id = ?', [lastID]);
    res.status(201).json({
      ...newTx,
      productId: newTx.product_id,
      productName: newTx.product_name,
      unitPrice: newTx.unit_price,
      unitCost: newTx.unit_cost,
      userId: newTx.user_id,
      userName: newTx.user_name
    });
  } catch (err) {
    await run('ROLLBACK');
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Dashboard Stats ---
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const productsStats = await get('SELECT COUNT(*) as total_items, SUM(cost_price * quantity) as inventory_value FROM products');
    const lowStockStats = await get('SELECT COUNT(*) as low_stock FROM products WHERE quantity < reorder_level');
    
    const today = new Date().toISOString().split('T')[0];
    const salesStats = await get(
      "SELECT COUNT(*) as count, SUM(unit_price * quantity) as value FROM transactions WHERE date LIKE ? AND type = 'STOCK_OUT'",
      [`${today}%`]
    );

    res.json({
      totalItems: productsStats.total_items || 0,
      inventoryValue: productsStats.inventory_value || 0,
      lowStockItems: lowStockStats.low_stock || 0,
      todaySalesValue: salesStats.value || 0,
      todaySalesCount: salesStats.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
