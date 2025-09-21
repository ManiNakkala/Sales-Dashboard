import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';

interface CategoryChartProps {
  data: Array<{
    category: string;
    revenue: number;
    orders: number;
    products: number;
  }>;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const item = params[0];
        const category = data[item.dataIndex];
        return `
          <div style="font-size: 14px;">
            <strong>${category.category}</strong><br/>
            Revenue: $${item.value.toLocaleString()}<br/>
            Orders: ${category.orders.toLocaleString()}<br/>
            Products: ${category.products.toLocaleString()}
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.category),
      axisLabel: {
        color: theme.palette.text.secondary,
        rotate: 45,
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.divider
        }
      }
    },
    yAxis: {
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
    series: [
      {
        type: 'bar',
        data: data.map((item, index) => ({
          value: item.revenue,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: `${theme.palette.secondary.light}60` },
                { offset: 0.5, color: theme.palette.secondary.main },
                { offset: 1, color: theme.palette.secondary.dark }
              ]
            }
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        animationDelay: (idx: number) => idx * 150,
        animationDuration: 1000,
        animationEasing: 'bounceOut'
      }
    ]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '470px', width: '100%', minWidth: '1000px' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default CategoryChart;