import { BiasScores } from '@/lib/api'

interface BiasTimePoint {
  date: string
  bias: BiasScores
}

interface BiasOverTimeProps {
  data: BiasTimePoint[]
  dimension: keyof BiasScores
  title?: string
}

export default function BiasOverTime({ data, dimension, title }: BiasOverTimeProps) {
  if (!data.length) return null

  const maxValue = Math.max(...data.map(d => d.bias[dimension]))
  const minValue = Math.min(...data.map(d => d.bias[dimension]))
  const range = maxValue - minValue || 0.1 // Avoid division by zero

  const width = 400
  const height = 200
  const padding = 40

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((point.bias[dimension] - minValue) / range) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')

  const dimensionName = String(dimension).replace(/_/g, ' ')

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">
        Shows how {dimensionName} has evolved in coverage of this narrative over time.
      </p>
      
      <svg width={width} height={height} className="w-full max-w-md">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" className="text-gray-400 dark:text-gray-600"/>
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(val => {
          const y = height - padding - (val * (height - 2 * padding))
          return (
            <g key={val}>
              <line 
                x1={padding - 5} 
                y1={y} 
                x2={padding} 
                y2={y} 
                stroke="currentColor" 
                className="text-gray-400 dark:text-gray-600"
              />
              <text 
                x={padding - 10} 
                y={y + 4} 
                textAnchor="end" 
                className="text-xs fill-gray-500"
              >
                {Math.round(val * 100)}%
              </text>
            </g>
          )
        })}
        

        <polyline
          points={points}
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        

        {data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
          const y = height - padding - ((point.bias[dimension] - minValue) / range) * (height - 2 * padding)
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#6b7280"
              stroke="#374151"
              strokeWidth="2"
            />
          )
        })}
        

        {data.map((point, index) => {
          if (index % Math.ceil(data.length / 4) !== 0 && index !== data.length - 1) return null
          const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          )
        })}
      </svg>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Shows how {dimensionName} bias has evolved across coverage of this narrative.
      </p>
    </div>
  )
}