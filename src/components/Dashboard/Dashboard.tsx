import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Refresh, TrendingUp, TrendingDown, Assessment } from '@mui/icons-material';
import { subDays, startOfMonth, endOfMonth } from 'date-fns';

import { AnalyticsService, DateRange, AnalyticsData } from '../../services/analytics';
import { isSupabaseConfigured } from '../../lib/supabase';
import MetricsCard from './MetricsCard';
import RevenueChart from './RevenueChart';
import TopProductsChart from './TopProductsChart';
import RegionChart from './RegionChart';
import CategoryChart from './CategoryChart';
import SalesTable from './SalesTable';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfMonth(subDays(new Date(), 30)),
    endDate: endOfMonth(new Date())
  });
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const data = await AnalyticsService.getAnalytics(dateRange);
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | null) => {
    if (date) {
      setDateRange(prev => ({
        ...prev,
        [field]: date
      }));
    }
  };

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" action={
          <Fab size="small" color="primary" onClick={handleRefresh}>
            <Refresh />
          </Fab>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!analytics) return null;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Supabase Configuration Warning */}
      {!isSupabaseConfigured && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Demo Mode:</strong> Connect to Supabase to use real data. Currently showing sample data for demonstration.
          </Typography>
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          <Assessment sx={{ mr: 2, verticalAlign: 'middle', fontSize: 'inherit' }} />
          Sales Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive insights into your sales performance and trends
        </Typography>
      </Box>

      {/* Date Range Selector */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={handleDateChange('startDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={handleDateChange('endDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Fab
                  variant="extended"
                  color="primary"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{ 
                    minWidth: 120,
                    boxShadow: theme.shadows[8]
                  }}
                >
                  {refreshing ? <CircularProgress size={20} sx={{ mr: 1 }} /> : <Refresh sx={{ mr: 1 }} />}
                  Refresh
                </Fab>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Revenue"
            value={`$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            growth={analytics.revenueGrowth}
            icon={<TrendingUp />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Orders"
            value={analytics.totalOrders.toLocaleString()}
            growth={analytics.orderGrowth}
            icon={<Assessment />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Average Order Value"
            value={`$${analytics.avgOrderValue.toFixed(2)}`}
            growth={analytics.revenueGrowth - analytics.orderGrowth}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Customers"
            value={analytics.totalCustomers.toLocaleString()}
            growth={0}
            icon={<Assessment />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Trend */}
        <Grid item xs={12}>
          <Card sx={{ 
            height: '500px', 
            boxShadow: theme.shadows[8],
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.divider}20`
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main,
                mb: 3,
                display: 'flex',
                alignItems: 'center'
              }}>
                <TrendingUp sx={{ mr: 1, fontSize: '1.5rem' }} />
                Revenue Trend
              </Typography>
              <RevenueChart data={analytics.dailyRevenue} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Region Chart - Full Width */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ 
            height: '500px', 
            boxShadow: theme.shadows[8],
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.divider}20`
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700, 
                color: theme.palette.secondary.main,
                mb: 3,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Assessment sx={{ mr: 1, fontSize: '1.5rem' }} />
                Sales by Region
              </Typography>
              <RegionChart data={analytics.regionData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products and Categories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ 
            height: '550px', 
            boxShadow: theme.shadows[8],
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.divider}20`
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700, 
                color: theme.palette.success.main,
                mb: 3,
                display: 'flex',
                alignItems: 'center'
              }}>
                <TrendingUp sx={{ mr: 1, fontSize: '1.5rem' }} />
                Top Products by Revenue
              </Typography>
              <TopProductsChart data={analytics.topProducts} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Chart - Full Width */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ 
            height: '550px', 
            boxShadow: theme.shadows[8],
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.divider}20`
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700, 
                color: theme.palette.warning.main,
                mb: 3,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Assessment sx={{ mr: 1, fontSize: '1.5rem' }} />
                Sales by Category
              </Typography>
              <CategoryChart data={analytics.categoryData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Table */}
      <Card sx={{ 
        boxShadow: theme.shadows[8],
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: `1px solid ${theme.palette.divider}20`
      }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 700, 
            color: theme.palette.info.main,
            mb: 3,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Assessment sx={{ mr: 1, fontSize: '1.5rem' }} />
            Recent Sales
          </Typography>
          <SalesTable dateRange={dateRange} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;