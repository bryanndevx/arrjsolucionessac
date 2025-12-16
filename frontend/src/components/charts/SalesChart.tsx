import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface SalesChartProps {
  data?: {
    labels: string[]
    sales: number[]
    rentals: number[]
  }
}

export default function SalesChart({ data }: SalesChartProps) {
  const defaultData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    sales: [85000, 92000, 78000, 105000, 98000, 112000, 125000, 108000, 95000, 118000, 132000, 141600],
    rentals: [42000, 48000, 52000, 45000, 58000, 62000, 55000, 60000, 68000, 72000, 65000, 70000]
  }

  const chartData = data || defaultData

  const config = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Ventas',
        data: chartData.sales,
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Alquileres',
        data: chartData.rentals,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += 'S/ ' + context.parsed.y.toLocaleString('es-PE')
            }
            return label
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'S/ ' + (value / 1000).toFixed(0) + 'K'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return <Line data={config} options={options} />
}
