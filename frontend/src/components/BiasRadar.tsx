import { BiasScores } from '@/lib/api'

const DIMENSIONS: Array<keyof BiasScores> = [
  'ideological_stance',
  'factual_grounding', 
  'framing_choices',
  'emotional_tone',
  'source_transparency',
]

const DIMENSION_LABELS: Record<keyof BiasScores, string> = {
  ideological_stance: 'Ideological',
  factual_grounding: 'Factual',
  framing_choices: 'Framing',
  emotional_tone: 'Emotional',
  source_transparency: 'Transparency',
}

const COLORS: Record<keyof BiasScores, string> = {
  ideological_stance: '#6b7280', // Muted gray-purple
  factual_grounding: '#6b7280',  // Muted gray-green
  framing_choices: '#6b7280',    // Muted gray-amber
  emotional_tone: '#6b7280',     // Muted gray-red
  source_transparency: '#6b7280', // Muted gray-blue
}

function polarToCartesian(radius: number, angle: number) {
  return [radius * Math.cos(angle), radius * Math.sin(angle)]
}

export default function BiasRadar({ scores, size = 280 }: { scores: BiasScores; size?: number }) {
  const center = size / 2
  const radius = center - 60 // More padding for labels
  const step = (Math.PI * 2) / DIMENSIONS.length

  const points = DIMENSIONS.map((key, i) => {
    const angle = -Math.PI / 2 + step * i
    const r = radius * (scores[key] ?? 0)
    const [x, y] = polarToCartesian(r, angle)
    return `${center + x},${center + y}`
  }).join(' ')

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

        <g transform={`translate(${center}, ${center})`}>
          {[0.2, 0.4, 0.6, 0.8, 1].map((t) => (
            <circle
              key={t}
              cx={0}
              cy={0}
              r={radius * t}
              fill="none"
              stroke="#374151"
              strokeWidth={0.5}
              opacity={0.15}
            />
          ))}
          

          {DIMENSIONS.map((_, i) => {
            const angle = -Math.PI / 2 + step * i
            const [x, y] = polarToCartesian(radius, angle)
            return (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke="#374151"
                strokeWidth={0.5}
                opacity={0.15}
              />
            )
          })}
        </g>


        <polygon 
          points={points} 
          fill="rgba(255, 255, 255, 0.02)" 
          stroke="rgba(255, 255, 255, 0.3)" 
          strokeWidth={1.5}
        />


        {DIMENSIONS.map((key, i) => {
          const angle = -Math.PI / 2 + step * i
          const r = radius * (scores[key] ?? 0)
          const [x, y] = polarToCartesian(r, angle)
          return (
            <circle 
              key={key} 
              cx={center + x} 
              cy={center + y} 
              r={3} 
              fill={COLORS[key]}
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={1.5}
            />
          )
        })}


        <g transform={`translate(${center}, ${center})`}>
          {DIMENSIONS.map((key, i) => {
            const angle = -Math.PI / 2 + step * i
            const labelRadius = radius + 30
            const [x, y] = polarToCartesian(labelRadius, angle)
            const label = DIMENSION_LABELS[key]
            
            return (
              <text 
                key={key} 
                x={x} 
                y={y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="text-xs font-medium fill-gray-300"
                style={{ fontSize: '11px' }}
              >
                {label}
              </text>
            )
          })}
        </g>


        <g transform={`translate(${center}, ${center})`}>
          {[0.5, 1].map((scale) => (
            <text
              key={scale}
              x={-10}
              y={-radius * scale + 3}
              className="text-xs fill-gray-600"
              style={{ fontSize: '9px' }}
              textAnchor="end"
            >
              {Math.round(scale * 100)}%
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}