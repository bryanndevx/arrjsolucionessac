import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface StatusChartProps {
  pending?: number
  quoted?: number
  accepted?: number
  inProgress?: number
  completed?: number
}

export default function StatusChart({ 
  pending = 0, 
  quoted = 0, 
  accepted = 0, 
  inProgress = 0, 
  completed = 0 
}: StatusChartProps) {
  const data = {
    labels: ['Pendiente', 'Cotizado', 'Aceptado', 'En Proceso', 'Completado'],
    datasets: [
      {
        label: 'Órdenes',
        data: [pending, quoted, accepted, inProgress, completed],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(5, 150, 105, 0.8)'
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(5, 150, 105)'
        ],
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 15,
          font: {
            size: 11
          },
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }

  return <Doughnut data={data} options={options} />
}
