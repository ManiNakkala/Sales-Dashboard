import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Chip,
  Avatar,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { AnalyticsService, DateRange } from '../../services/analytics';
import { Sale } from '../../lib/supabase';

interface SalesTableProps {
  dateRange: DateRange;
}

const SalesTable: React.FC<SalesTableProps> = ({ dateRange }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const salesData = await AnalyticsService.getSalesData(dateRange, 100);
        setSales(salesData);
      } catch (err) {
        console.error('Error fetching sales:', err);
        setError('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [dateRange]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Electronics': '#1976d2',
      'Clothing': '#9c27b0',
      'Home & Garden': '#4caf50',
      'Sports': '#ff9800',
      'Books': '#f44336',
      'Beauty': '#e91e63',
      'Automotive': '#607d8b'
    };
    return colors[category] || '#757575';
  };

  const paginatedSales = sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Unit Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Discount</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSales.map((sale) => (
              <TableRow 
                key={sale.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover' 
                  },
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'action.selected'
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2">
                    {format(new Date(sale.sale_date), 'MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(sale.sale_date), 'HH:mm')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      sx={{ 
                        mr: 1, 
                        width: 32, 
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem'
                      }}
                    >
                      {sale.customer?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {sale.customer?.name || 'Unknown Customer'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sale.customer?.region} | {sale.customer?.customer_type}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {sale.product?.name || 'Unknown Product'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SKU: {sale.product?.sku}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={sale.product?.category || 'Unknown'}
                    size="small"
                    sx={{
                      bgcolor: `${getCategoryColor(sale.product?.category || '')}20`,
                      color: getCategoryColor(sale.product?.category || ''),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {sale.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    ${parseFloat(sale.unit_price.toString()).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color={sale.discount_percent > 0 ? 'error.main' : 'text.primary'}>
                    {sale.discount_percent}%
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    ${parseFloat(sale.total_amount.toString()).toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sales.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'grey.50'
        }}
      />
    </Paper>
  );
};

export default SalesTable;