import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rkjoggqexqdcpjstcuwu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJram9nZ3FleHFkY3Bqc3RjdXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MjI0MjAsImV4cCI6MjA3Mzk5ODQyMH0.z7prr0QwAzwmLFL5p73zzZ44wp9w76sUyU7WqfW3JxQ';

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig = supabaseUrl !== 'https://rkjoggqexqdcpjstcuwu.supabase.co' && 
                               supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJram9nZ3FleHFkY3Bqc3RjdXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MjI0MjAsImV4cCI6MjA3Mzk5ODQyMH0.z7prr0QwAzwmLFL5p73zzZ44wp9w76sUyU7WqfW3JxQ' &&
                               supabaseUrl.startsWith('https://') &&
                               supabaseUrl.includes('.supabase.co');

export const supabase = hasValidSupabaseConfig ? 
  createClient(supabaseUrl, supabaseAnonKey) : 
  null;

export const isSupabaseConfigured = hasValidSupabaseConfig;

// Database types
export interface Customer {
  id: string;
  name: string;
  email: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  customer_type: 'Individual' | 'Business' | 'Enterprise';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Electronics' | 'Clothing' | 'Home & Garden' | 'Sports' | 'Books' | 'Beauty' | 'Automotive';
  subcategory?: string;
  price: number;
  cost: number;
  stock_quantity: number;
  description?: string;
  brand?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  total_amount: number;
  sale_date: string;
  sales_rep?: string;
  notes?: string;
  created_at: string;
  customer?: Customer;
  product?: Product;
}

export interface AnalyticsReport {
  id: string;
  report_date: string;
  report_type: 'daily' | 'weekly' | 'monthly';
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  total_customers: number;
  new_customers: number;
  top_product_id?: string;
  top_product_revenue: number;
  metadata: Record<string, any>;
  created_at: string;
}