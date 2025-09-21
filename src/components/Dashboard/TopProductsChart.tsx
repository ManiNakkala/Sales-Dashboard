import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';
import { Product } from '../../lib/supabase';

interface TopProductsChartProps {
  data: Array<{
    product: Product;
    revenue: number;
    quantity: number;
    orders: number;
  }>;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const item = params[0];
        const product = data[item.dataIndex];
        return `
          <div style="font-size: 14px;">
            <strong>${product.product.name}</strong><br/>
            Revenue: $${item.value.toLocaleString()}<br/>
            Quantity Sold: ${product.quantity.toLocaleString()}<br/>
            Orders: ${product.orders.toLocaleString()}<br/>
            Category: ${product.product.category}
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: theme.palette.text.secondary,
        formatter: '${value}'
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.divider
        }
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider,
          opacity: 0.5
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.product.name.length > 20 ? item.product.name.substring(0, 20) + '...' : item.product.name),
      axisLabel: {
        color: theme.palette.text.secondary
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.divider
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: data.map((item, index) => ({
          value: item.revenue,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: theme.palette.primary.light },
                { offset: 1, color: theme.palette.primary.main }
              ]
            }
          }
        })),
        emphasis: {
          itemStyle: {
            color: theme.palette.primary.dark
          }
        },
        animationDelay: (idx: number) => idx * 100,
        animationDuration: 800
      }
    ],
    animation: true,
    animationEasing: 'elasticOut'
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '470px', width: '100%', minWidth: '1000px' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default TopProductsChart;