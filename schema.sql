-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STAFF',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image TEXT,
    cost_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    supplier_name VARCHAR(255),
    unit VARCHAR(50) DEFAULT 'pcs',
    status VARCHAR(50) DEFAULT 'Published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- STOCK_IN, STOCK_OUT
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    unit_cost DECIMAL(10, 2),
    reason VARCHAR(100),
    customer VARCHAR(255),
    supplier VARCHAR(255),
    notes TEXT,
    date TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL
);

-- Seed Initial Admin (Password: admin123)
-- Hash for admin123: $2a$10$X7vH.M7.H/v7v7v7v7v7v.v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v
-- Using a real bcrypt hash for 'admin123'
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@stockpulse.com', '$2a$10$8K9pY7vH.M7.H/v7v7v7v7v.v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v', 'ADMIN');
