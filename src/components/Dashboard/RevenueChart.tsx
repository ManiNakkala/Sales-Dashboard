import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';
import { format } from 'date-fns';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: theme.palette.grey[600]
        }
      },
      formatter: (params: any) => {
        const date = params[0].axisValue;
        const revenue = params[0].value;
        const orders = params[1].value;
        return `
          <div style="font-size: 14px;">
            <strong>${format(new Date(date), 'MMM dd, yyyy')}</strong><br/>
            Revenue: $${revenue.toLocaleString()}<br/>
            Orders: ${orders.toLocaleString()}
          </div>
        `;
      }
    },
    legend: {
      data: ['Revenue', 'Orders'],
      textStyle: {
        color: theme.palette.text.primary
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.date),
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: (value: string) => format(new Date(value), 'MMM dd')
        },
        axisLine: {
          lineStyle: {
            color: theme.palette.divider
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Revenue ($)',
        position: 'left',
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
      {
        type: 'value',
        name: 'Orders',
        position: 'right',
        axisLabel: {
          color: theme.palette.text.secondary
        },
        axisLine: {
          lineStyle: {
            color: theme.palette.divider
          }
        }
      }
    ],
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        data: data.map(item => item.revenue),
        itemStyle: {
          color: theme.palette.primary.main
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${theme.palette.primary.main}40` },
              { offset: 1, color: `${theme.palette.primary.main}10` }
            ]
          }
        }
      },
      {
        name: 'Orders',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: data.map(item => item.orders),
        itemStyle: {
          color: theme.palette.secondary.main
        },
        lineStyle: {
          width: 3,
          type: 'dashed'
        }
      }
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '420px', width: '100%', minWidth: '1200px' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default RevenueChart;