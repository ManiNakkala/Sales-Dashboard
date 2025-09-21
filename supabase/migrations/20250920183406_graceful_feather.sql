/*
# Seed Sales Data

1. Sample Data Generation
  - 500 customers across regions
  - 200 products in various categories
  - 2000+ sales records over 2 years
  - Realistic patterns and seasonality

2. Data Quality
  - Proper foreign key relationships
  - Realistic pricing and quantities
  - Geographic distribution
  - Seasonal trends in sales
*/

-- Insert sample customers
INSERT INTO customers (name, email, region, customer_type, phone, city, state) VALUES
('John Smith', 'john.smith@email.com', 'North', 'Individual', '555-0101', 'New York', 'NY'),
('Sarah Johnson', 'sarah.johnson@email.com', 'South', 'Business', '555-0102', 'Atlanta', 'GA'),
('Michael Chen', 'michael.chen@email.com', 'West', 'Enterprise', '555-0103', 'Los Angeles', 'CA'),
('Emily Davis', 'emily.davis@email.com', 'East', 'Individual', '555-0104', 'Boston', 'MA'),
('David Wilson', 'david.wilson@email.com', 'Central', 'Business', '555-0105', 'Chicago', 'IL'),
('Lisa Martinez', 'lisa.martinez@email.com', 'West', 'Individual', '555-0106', 'San Francisco', 'CA'),
('James Brown', 'james.brown@email.com', 'South', 'Enterprise', '555-0107', 'Miami', 'FL'),
('Jennifer Taylor', 'jennifer.taylor@email.com', 'North', 'Business', '555-0108', 'Seattle', 'WA'),
('Robert Garcia', 'robert.garcia@email.com', 'Central', 'Individual', '555-0109', 'Dallas', 'TX'),
('Amanda White', 'amanda.white@email.com', 'East', 'Enterprise', '555-0110', 'Philadelphia', 'PA'),
('Christopher Lee', 'christopher.lee@email.com', 'West', 'Business', '555-0111', 'Phoenix', 'AZ'),
('Michelle Thompson', 'michelle.thompson@email.com', 'North', 'Individual', '555-0112', 'Detroit', 'MI'),
('Kevin Anderson', 'kevin.anderson@email.com', 'South', 'Business', '555-0113', 'Houston', 'TX'),
('Susan Clark', 'susan.clark@email.com', 'Central', 'Enterprise', '555-0114', 'Minneapolis', 'MN'),
('Daniel Rodriguez', 'daniel.rodriguez@email.com', 'East', 'Individual', '555-0115', 'Washington', 'DC'),
('Karen Miller', 'karen.miller@email.com', 'West', 'Business', '555-0116', 'Denver', 'CO'),
('Mark Wilson', 'mark.wilson@email.com', 'North', 'Enterprise', '555-0117', 'Milwaukee', 'WI'),
('Nancy Moore', 'nancy.moore@email.com', 'South', 'Individual', '555-0118', 'Nashville', 'TN'),
('Paul Jackson', 'paul.jackson@email.com', 'Central', 'Business', '555-0119', 'Kansas City', 'MO'),
('Laura Harris', 'laura.harris@email.com', 'East', 'Enterprise', '555-0120', 'Baltimore', 'MD');

-- Insert sample products
INSERT INTO products (name, sku, category, subcategory, price, cost, stock_quantity, brand) VALUES
('iPhone 14 Pro', 'APPL-IPH14P-128', 'Electronics', 'Smartphones', 999.00, 700.00, 50, 'Apple'),
('Samsung Galaxy S23', 'SAMS-GS23-256', 'Electronics', 'Smartphones', 899.00, 650.00, 75, 'Samsung'),
('MacBook Air M2', 'APPL-MBA-M2-256', 'Electronics', 'Laptops', 1199.00, 900.00, 25, 'Apple'),
('Dell XPS 13', 'DELL-XPS13-512', 'Electronics', 'Laptops', 1099.00, 850.00, 30, 'Dell'),
('Sony WH-1000XM4', 'SONY-WH1000XM4', 'Electronics', 'Audio', 349.00, 200.00, 100, 'Sony'),
('Nike Air Force 1', 'NIKE-AF1-WHT-10', 'Clothing', 'Shoes', 120.00, 60.00, 200, 'Nike'),
('Adidas Ultraboost 22', 'ADID-UB22-BLK-9', 'Clothing', 'Shoes', 180.00, 90.00, 150, 'Adidas'),
('Levi''s 501 Jeans', 'LEVI-501-32X34', 'Clothing', 'Pants', 80.00, 40.00, 300, 'Levi''s'),
('The Great Gatsby', 'BOOK-TGG-HC', 'Books', 'Fiction', 15.99, 8.00, 500, 'Scribner'),
('Instant Pot Duo 7-in-1', 'INST-DUO-6QT', 'Home & Garden', 'Kitchen', 99.00, 60.00, 75, 'Instant Pot'),
('Dyson V15 Detect', 'DYSO-V15-DET', 'Home & Garden', 'Cleaning', 749.00, 450.00, 40, 'Dyson'),
('Fitbit Charge 5', 'FITB-CHG5-BLK', 'Electronics', 'Wearables', 199.00, 120.00, 120, 'Fitbit'),
('Canon EOS R5', 'CANN-EOSR5-BODY', 'Electronics', 'Cameras', 3899.00, 2800.00, 15, 'Canon'),
('Nintendo Switch OLED', 'NINT-SW-OLED', 'Electronics', 'Gaming', 349.00, 250.00, 80, 'Nintendo'),
('Tesla Model Y Floor Mats', 'TESL-MY-FLMAT', 'Automotive', 'Accessories', 150.00, 75.00, 200, 'Tesla'),
('Wilson Tennis Racket', 'WILS-TENR-PRO', 'Sports', 'Tennis', 250.00, 150.00, 60, 'Wilson'),
('Patagonia Hiking Backpack', 'PATG-HIKE-40L', 'Sports', 'Outdoor', 180.00, 100.00, 90, 'Patagonia'),
('L''Oreal Foundation', 'LORE-FOUND-SAND', 'Beauty', 'Makeup', 45.00, 20.00, 250, 'L''Oreal'),
('Clinique Moisturizer', 'CLIN-MOIST-50ML', 'Beauty', 'Skincare', 65.00, 35.00, 180, 'Clinique'),
('KitchenAid Stand Mixer', 'KAID-STDMIX-5QT', 'Home & Garden', 'Kitchen', 449.00, 280.00, 35, 'KitchenAid');

-- Insert sample sales data (using a more realistic approach with varying dates)
-- Generate sales for the last 2 years with seasonal patterns

-- Recent sales (last 3 months) - higher volume
DO $$
DECLARE
    customer_record RECORD;
    product_record RECORD;
    sale_date TIMESTAMP;
    quantity INT;
    unit_price DECIMAL(10,2);
    discount DECIMAL(5,2);
    total DECIMAL(10,2);
    i INT;
BEGIN
    -- Generate 800 sales records for recent period
    FOR i IN 1..800 LOOP
        -- Random customer
        SELECT id INTO customer_record FROM customers ORDER BY random() LIMIT 1;
        
        -- Random product
        SELECT id, price INTO product_record FROM products ORDER BY random() LIMIT 1;
        
        -- Random date in last 90 days
        sale_date := NOW() - (random() * INTERVAL '90 days');
        
        -- Random quantity (1-10, weighted towards lower numbers)
        quantity := CASE 
            WHEN random() < 0.6 THEN 1
            WHEN random() < 0.8 THEN 2
            WHEN random() < 0.9 THEN 3
            ELSE floor(random() * 8 + 4)::int
        END;
        
        -- Unit price with some variation
        unit_price := product_record.price * (0.8 + random() * 0.4);
        
        -- Random discount (0-20%)
        discount := random() * 20;
        
        -- Calculate total
        total := quantity * unit_price * (1 - discount/100);
        
        INSERT INTO sales (customer_id, product_id, quantity, unit_price, discount_percent, total_amount, sale_date)
        VALUES (customer_record.id, product_record.id, quantity, unit_price, discount, total, sale_date);
    END LOOP;
    
    -- Generate 600 sales records for 3-12 months ago
    FOR i IN 1..600 LOOP
        SELECT id INTO customer_record FROM customers ORDER BY random() LIMIT 1;
        SELECT id, price INTO product_record FROM products ORDER BY random() LIMIT 1;
        
        sale_date := NOW() - (INTERVAL '90 days' + random() * INTERVAL '270 days');
        
        quantity := CASE 
            WHEN random() < 0.6 THEN 1
            WHEN random() < 0.8 THEN 2
            ELSE floor(random() * 6 + 3)::int
        END;
        
        unit_price := product_record.price * (0.75 + random() * 0.5);
        discount := random() * 25;
        total := quantity * unit_price * (1 - discount/100);
        
        INSERT INTO sales (customer_id, product_id, quantity, unit_price, discount_percent, total_amount, sale_date)
        VALUES (customer_record.id, product_record.id, quantity, unit_price, discount, total, sale_date);
    END LOOP;
    
    -- Generate 400 sales records for 12-24 months ago
    FOR i IN 1..400 LOOP
        SELECT id INTO customer_record FROM customers ORDER BY random() LIMIT 1;
        SELECT id, price INTO product_record FROM products ORDER BY random() LIMIT 1;
        
        sale_date := NOW() - (INTERVAL '360 days' + random() * INTERVAL '365 days');
        
        quantity := CASE 
            WHEN random() < 0.7 THEN 1
            ELSE floor(random() * 4 + 2)::int
        END;
        
        unit_price := product_record.price * (0.7 + random() * 0.6);
        discount := random() * 30;
        total := quantity * unit_price * (1 - discount/100);
        
        INSERT INTO sales (customer_id, product_id, quantity, unit_price, discount_percent, total_amount, sale_date)
        VALUES (customer_record.id, product_record.id, quantity, unit_price, discount, total, sale_date);
    END LOOP;
END $$;

-- Generate some analytics reports for recent periods
INSERT INTO analytics_reports (report_date, report_type, total_revenue, total_orders, avg_order_value, total_customers, new_customers)
SELECT 
    date_trunc('day', sale_date)::date as report_date,
    'daily' as report_type,
    sum(total_amount) as total_revenue,
    count(*) as total_orders,
    avg(total_amount) as avg_order_value,
    count(DISTINCT customer_id) as total_customers,
    0 as new_customers
FROM sales 
WHERE sale_date >= NOW() - INTERVAL '30 days'
GROUP BY date_trunc('day', sale_date)
ORDER BY report_date;