-- Drop tables if they exist (for clean migration)
-- Note: CASCADE will also drop indexes and constraints
DROP TABLE IF EXISTS order_product_map CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Drop old uppercase tables if they exist
DROP TABLE IF EXISTS "OrderProductMap" CASCADE;
DROP TABLE IF EXISTS "ORDERS" CASCADE;
DROP TABLE IF EXISTS "PRODUCTS" CASCADE;

-- Create products table
CREATE TABLE products (
    id INT PRIMARY KEY,
    uid VARCHAR(13) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(13) UNIQUE NOT NULL,
    order_description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create order_product_map table (junction table for many-to-many relationship)
CREATE TABLE order_product_map (
    id SERIAL PRIMARY KEY,
    order_uid VARCHAR(13) NOT NULL,
    product_uid VARCHAR(13) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_uid) REFERENCES orders(uid) ON DELETE CASCADE,
    FOREIGN KEY (product_uid) REFERENCES products(uid) ON DELETE CASCADE,
    UNIQUE(order_uid, product_uid)
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_uid ON orders(uid);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_products_uid ON products(uid);
CREATE INDEX idx_order_product_map_order_uid ON order_product_map(order_uid);
CREATE INDEX idx_order_product_map_product_uid ON order_product_map(product_uid);

-- Add comments for documentation
COMMENT ON TABLE orders IS 'Stores customer orders';
COMMENT ON TABLE products IS 'Stores product catalog';
COMMENT ON TABLE order_product_map IS 'Junction table mapping orders to products (many-to-many relationship)';
COMMENT ON COLUMN orders.uid IS 'Unique 13-character alphanumeric identifier used for relationships';
COMMENT ON COLUMN products.uid IS 'Unique 13-character alphanumeric identifier used for relationships';
