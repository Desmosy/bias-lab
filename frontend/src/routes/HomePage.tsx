import { useEffect, useState } from 'react'
import { fetchNarratives, NarrativeCluster } from '@/lib/api'
import { Link } from 'react-router-dom'


const cardColors = [
  'bg-gradient-to-br from-orange-400 to-red-500', // Orange gradient like Anthropic
  'bg-gradient-to-br from-blue-400 to-purple-500', // Blue to purple
  'bg-gradient-to-br from-green-400 to-teal-500', // Green gradient
  'bg-gradient-to-br from-purple-400 to-pink-500', // Purple to pink
  'bg-gradient-to-br from-yellow-400 to-orange-500', // Yellow to orange
  'bg-gradient-to-br from-indigo-400 to-blue-500', // Indigo gradient
]


const getCardBackground = (index: number) => {
  if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5) {
    // Use custom images for the first six cards
    return `bg-cover bg-center bg-no-repeat`
  }
  return cardColors[index % cardColors.length]
}


const getBackgroundImage = (index: number) => {
  const images = [
    'url(/gradient-bg.jpg)',                           // Tech Giants card
    'url(/Spectral_20Light_20-_2050.jpg)',            // Climate Summit card
    'url(/Fractal_20Maze_20-_2020.jpg)',              // Third card
    'url(/dark.jpg)',                                  // Fourth card
    'url(/drama.jpeg)',     // Fifth card - Dramatic gradient
    'url(/chas.jpg)',     // Sixth card - Chaotic gradient
  ]
  return images[index] || null
}

function NarrativeCard({ cluster, index, size = 'normal' }: { 
  cluster: NarrativeCluster, 
  index: number, 
  size?: 'small' | 'normal' | 'large' 
}) {
  const cardBackground = getCardBackground(index)
  const backgroundImage = getBackgroundImage(index)
  const sizeClasses = {
    small: 'aspect-square p-6',
    normal: 'aspect-[4/3] p-8',
    large: 'aspect-[3/2] p-10'
  }
  

  const cardHeight = (index === 1) ? 'h-80' : ''

  return (
    <Link to={`/articles/${cluster.top_articles[0]?.id ?? ''}`}>
      <article 
        className={`${cardBackground} ${sizeClasses[size]} ${cardHeight} rounded-2xl group cursor-pointer transition-transform duration-200 hover:scale-105 relative overflow-hidden`}
        style={backgroundImage ? { backgroundImage } : {}}
      >
        {/* Dark overlay for image background readability */}
        {backgroundImage && <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>}

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="text-xs text-white/80 font-medium mb-2 uppercase tracking-wide">
              Analysis
            </div>
            <h2 className="openai-heading text-xl md:text-2xl text-white mb-3 leading-tight">
              {cluster.title}
            </h2>
          </div>

          <div className="text-sm text-white/90">
            <div className="mb-2">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
            <div className="flex items-center text-xs">
              <span className="bg-white/20 rounded-full px-2 py-1">
                {Math.round(cluster.divergence_index * 100)}% divergence
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function HomePage() {
  const [clusters, setClusters] = useState<NarrativeCluster[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNarratives()
      .then(setClusters)
      .catch((e: any) => setError(e?.message ?? 'Failed to load'))
  }, [])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load narratives: {error}</p>
      </div>
    )
  }

  if (!clusters) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-gray-800 aspect-[4/3]"></div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-16 text-center">
        <h1 className="openai-heading text-5xl md:text-6xl text-white mb-6">
          News
        </h1>
        <p className="openai-body text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Explore how different narratives are being covered across news sources, with AI-powered bias detection and transparency insights.
        </p>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {clusters.map((cluster, index) => {
          // Create different sizes for visual interest like Anthropic
          let size: 'small' | 'normal' | 'large' = 'normal'
          if (index === 0) size = 'large' // First card is large
          if (index === 3 || index === 5) size = 'small' // Some cards are small
          
          return (
            <div key={cluster.id} className={`${
              index === 0 ? 'md:col-span-2' : ''
            }`}>
              <NarrativeCard cluster={cluster} index={index} size={size} />
            </div>
          )
        })}
      </div>


      <div className="mt-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="openai-heading text-3xl text-white mb-6">
            Understanding Media Bias
          </h2>
          <p className="openai-body text-lg text-gray-400 leading-relaxed mb-8">
            Our AI-powered analysis identifies five key dimensions of bias: ideological stance, factual grounding, 
            framing choices, emotional tone, and source transparency. Each article is scored and highlighted to 
            make bias patterns visible and understandable.
          </p>
          <Link 
            to="/docs" 
            className="inline-flex items-center openai-button"
          >
            Learn more about our methodology
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}