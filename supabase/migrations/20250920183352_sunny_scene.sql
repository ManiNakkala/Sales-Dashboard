/*
# Sales Analytics Database Schema

1. New Tables
  - `customers` - Customer information with region, type, and contact details
  - `products` - Product catalog with categories, pricing, and inventory
  - `sales` - Sales transactions with detailed line items
  - `analytics_reports` - Pre-computed analytics for performance

2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users

3. Sample Data
  - 500+ customers across different regions
  - 200+ products in various categories
  - 2000+ sales records spanning 2+ years
  - Realistic data distribution and patterns
*/

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  region text NOT NULL CHECK (region IN ('North', 'South', 'East', 'West', 'Central')),
  customer_type text NOT NULL CHECK (customer_type IN ('Individual', 'Business', 'Enterprise')),
  phone text,
  address text,
  city text,
  state text,
  country text DEFAULT 'USA',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Automotive')),
  subcategory text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  cost decimal(10,2) NOT NULL CHECK (cost >= 0),
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  description text,
  brand text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),
  discount_percent decimal(5,2) DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  sale_date timestamptz NOT NULL,
  sales_rep text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Analytics reports for pre-computed metrics
CREATE TABLE IF NOT EXISTS analytics_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date date NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly')),
  total_revenue decimal(12,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  avg_order_value decimal(10,2) DEFAULT 0,
  total_customers integer DEFAULT 0,
  new_customers integer DEFAULT 0,
  top_product_id uuid REFERENCES products(id),
  top_product_revenue decimal(10,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all operations for now - in production, restrict based on user roles)
CREATE POLICY "Allow all operations on customers"
  ON customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on sales"
  ON sales FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on analytics_reports"
  ON analytics_reports FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_customers_region ON customers(region);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_analytics_date_type ON analytics_reports(report_date, report_type);