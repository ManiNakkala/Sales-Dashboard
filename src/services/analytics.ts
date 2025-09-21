import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Sale, Customer, Product, AnalyticsReport } from '../lib/supabase';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
  topProducts: Array<{
    product: Product;
    revenue: number;
    quantity: number;
    orders: number;
  }>;
  topCustomers: Array<{
    customer: Customer;
    revenue: number;
    orders: number;
    avgOrderValue: number;
  }>;
  regionData: Array<{
    region: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  categoryData: Array<{
    category: string;
    revenue: number;
    orders: number;
    products: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

export class AnalyticsService {
  static async getAnalytics(dateRange: DateRange): Promise<AnalyticsData> {
    if (!isSupabaseConfigured || !supabase) {
      // Return mock data when Supabase is not configured
      return this.getMockAnalytics();
    }

    const { startDate, endDate } = dateRange;
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    try {
      // Get current period data
      const { data: currentSales, error: currentError } = await supabase
        .from('sales')
        .select(`
          *,
          customer:customers(*),
          product:products(*)
        `)
        .gte('sale_date', startISO)
        .lte('sale_date', endISO);

      if (currentError) throw currentError;

      // Get previous period for comparison
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const prevStartDate = new Date(startDate);
      const prevEndDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - daysDiff);

      const { data: previousSales, error: prevError } = await supabase
        .from('sales')
        .select('*')
        .gte('sale_date', prevStartDate.toISOString())
        .lte('sale_date', prevEndDate.toISOString());

      if (prevError) throw prevError;

      // Calculate basic metrics
      const totalRevenue = currentSales?.reduce((sum, sale) => sum + parseFloat(sale.total_amount.toString()), 0) || 0;
      const totalOrders = currentSales?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const uniqueCustomers = new Set(currentSales?.map(sale => sale.customer_id) || []);
      const totalCustomers = uniqueCustomers.size;

      // Calculate growth rates
      const prevRevenue = previousSales?.reduce((sum, sale) => sum + parseFloat(sale.total_amount.toString()), 0) || 0;
      const prevOrders = previousSales?.length || 0;
      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const orderGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;

      // Top products analysis
      const productMap = new Map();
      currentSales?.forEach(sale => {
        const key = sale.product_id;
        if (!productMap.has(key)) {
          productMap.set(key, {
            product: sale.product,
            revenue: 0,
            quantity: 0,
            orders: 0
          });
        }
        const item = productMap.get(key);
        item.revenue += parseFloat(sale.total_amount.toString());
        item.quantity += sale.quantity;
        item.orders += 1;
      });

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Top customers analysis
      const customerMap = new Map();
      currentSales?.forEach(sale => {
        const key = sale.customer_id;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            customer: sale.customer,
            revenue: 0,
            orders: 0,
            avgOrderValue: 0
          });
        }
        const item = customerMap.get(key);
        item.revenue += parseFloat(sale.total_amount.toString());
        item.orders += 1;
        item.avgOrderValue = item.revenue / item.orders;
      });

      const topCustomers = Array.from(customerMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Region analysis
      const regionMap = new Map();
      currentSales?.forEach(sale => {
        const region = sale.customer?.region || 'Unknown';
        if (!regionMap.has(region)) {
          regionMap.set(region, {
            region,
            revenue: 0,
            orders: 0,
            customers: new Set()
          });
        }
        const item = regionMap.get(region);
        item.revenue += parseFloat(sale.total_amount.toString());
        item.orders += 1;
        item.customers.add(sale.customer_id);
      });

      const regionData = Array.from(regionMap.values()).map(item => ({
        region: item.region,
        revenue: item.revenue,
        orders: item.orders,
        customers: item.customers.size
      }));

      // Category analysis
      const categoryMap = new Map();
      currentSales?.forEach(sale => {
        const category = sale.product?.category || 'Unknown';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            revenue: 0,
            orders: 0,
            products: new Set()
          });
        }
        const item = categoryMap.get(category);
        item.revenue += parseFloat(sale.total_amount.toString());
        item.orders += 1;
        item.products.add(sale.product_id);
      });

      const categoryData = Array.from(categoryMap.values()).map(item => ({
        category: item.category,
        revenue: item.revenue,
        orders: item.orders,
        products: item.products.size
      }));

      // Daily revenue trends
      const dailyMap = new Map();
      currentSales?.forEach(sale => {
        const date = sale.sale_date.split('T')[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            revenue: 0,
            orders: 0
          });
        }
        const item = dailyMap.get(date);
        item.revenue += parseFloat(sale.total_amount.toString());
        item.orders += 1;
      });

      const dailyRevenue = Array.from(dailyMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Monthly trends
      const monthlyMap = new Map();
      currentSales?.forEach(sale => {
        const date = new Date(sale.sale_date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, {
            month,
            revenue: 0,
            orders: 0,
            customers: new Set()
          });
        }
        const item = monthlyMap.get(month);
        item.revenue += parseFloat(sale.total_amount.toString());
        item.orders += 1;
        item.customers.add(sale.customer_id);
      });

      const monthlyTrends = Array.from(monthlyMap.values()).map(item => ({
        month: item.month,
        revenue: item.revenue,
        orders: item.orders,
        customers: item.customers.size
      })).sort((a, b) => a.month.localeCompare(b.month));

      return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        totalCustomers,
        revenueGrowth,
        orderGrowth,
        topProducts,
        topCustomers,
        regionData,
        categoryData,
        dailyRevenue,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  static async getSalesData(dateRange: DateRange, limit?: number): Promise<Sale[]> {
    if (!isSupabaseConfigured || !supabase) {
      return this.getMockSalesData();
    }

    const { startDate, endDate } = dateRange;
    
    let query = supabase
      .from('sales')
      .select(`
        *,
        customer:customers(*),
        product:products(*)
      `)
      .gte('sale_date', startDate.toISOString())
      .lte('sale_date', endDate.toISOString())
      .order('sale_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  static async getCustomers(): Promise<Customer[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  private static getMockAnalytics(): AnalyticsData {
    return {
      totalRevenue: 125000,
      totalOrders: 450,
      avgOrderValue: 277.78,
      totalCustomers: 85,
      revenueGrowth: 12.5,
      orderGrowth: 8.3,
      topProducts: [
        {
          product: {
            id: '1',
            name: 'iPhone 14 Pro',
            sku: 'APPL-IPH14P-128',
            category: 'Electronics',
            price: 999,
            cost: 700,
            stock_quantity: 50,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          revenue: 25000,
          quantity: 25,
          orders: 25
        }
      ],
      topCustomers: [
        {
          customer: {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            region: 'North',
            customer_type: 'Enterprise',
            country: 'USA',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          revenue: 15000,
          orders: 12,
          avgOrderValue: 1250
        }
      ],
      regionData: [
        { region: 'North', revenue: 35000, orders: 120, customers: 25 },
        { region: 'South', revenue: 28000, orders: 95, customers: 20 },
        { region: 'East', revenue: 32000, orders: 110, customers: 22 },
        { region: 'West', revenue: 30000, orders: 125, customers: 18 }
      ],
      categoryData: [
        { category: 'Electronics', revenue: 65000, orders: 180, products: 15 },
        { category: 'Clothing', revenue: 35000, orders: 150, products: 25 },
        { category: 'Home & Garden', revenue: 25000, orders: 120, products: 20 }
      ],
      dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 20) + 10
      })),
      monthlyTrends: [
        { month: '2024-01', revenue: 45000, orders: 150, customers: 35 },
        { month: '2024-02', revenue: 52000, orders: 175, customers: 42 },
        { month: '2024-03', revenue: 48000, orders: 160, customers: 38 }
      ]
    };
  }

  private static getMockSalesData(): Sale[] {
    return [
      {
        id: '1',
        customer_id: '1',
        product_id: '1',
        quantity: 2,
        unit_price: 999,
        discount_percent: 5,
        total_amount: 1898.1,
        sale_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        customer: {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          region: 'North',
          customer_type: 'Enterprise',
          country: 'USA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        product: {
          id: '1',
          name: 'iPhone 14 Pro',
          sku: 'APPL-IPH14P-128',
          category: 'Electronics',
          price: 999,
          cost: 700,
          stock_quantity: 50,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ];
  }
}