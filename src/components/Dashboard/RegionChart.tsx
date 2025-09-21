import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';

interface RegionChartProps {
  data: Array<{
    region: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

const RegionChart: React.FC<RegionChartProps> = ({ data }) => {
  const theme = useTheme();

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const item = data[params.dataIndex];
        return `
          <div style="font-size: 14px;">
            <strong>${params.name}</strong><br/>
            Revenue: $${item.revenue.toLocaleString()}<br/>
            Orders: ${item.orders.toLocaleString()}<br/>
            Customers: ${item.customers.toLocaleString()}<br/>
            Share: ${params.percent}%
          </div>
        `;
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      textStyle: {
        color: theme.palette.text.primary
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: theme.palette.background.paper,
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            color: theme.palette.text.primary
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          value: item.revenue,
          name: item.region,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[index % colors.length] },
                { offset: 1, color: `${colors[index % colors.length]}80` }
              ]
            }
          }
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200
      }
    ]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '420px', width: '100%', minWidth: '800px' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default RegionChart;