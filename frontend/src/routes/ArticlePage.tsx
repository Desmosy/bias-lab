import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArticleDetail, fetchArticle } from '@/lib/api'
import BiasRadar from '@/components/BiasRadar'
import BiasOverTime from '@/components/BiasOverTime'

const DIMENSION_COLORS: Record<string, string> = {
  ideological_stance: 'bg-purple-500/20 border-purple-500/40',
  factual_grounding: 'bg-green-500/20 border-green-500/40',
  framing_choices: 'bg-yellow-500/20 border-yellow-500/40',
  emotional_tone: 'bg-red-500/20 border-red-500/40',
  source_transparency: 'bg-blue-500/20 border-blue-500/40',
}

function highlightContent(content: string, highlights: ArticleDetail['highlights']) {
  if (!highlights?.length) return [content]
  const sorted = [...highlights].sort((a, b) => a.start - b.start)
  const nodes: Array<string | JSX.Element> = []
  let cursor = 0
  sorted.forEach((h, idx) => {
    if (h.start > cursor) nodes.push(content.slice(cursor, h.start))
    const phrase = content.slice(h.start, h.end)
    const colorClass = DIMENSION_COLORS[h.dimension] || 'bg-gray-500/20 border-gray-500/40'
    nodes.push(
      <span
        key={`${h.start}-${h.end}-${idx}`}
        className={`inline border rounded px-1 py-0.5 cursor-help transition-all duration-200 ${colorClass}`}
        title={`${h.dimension.replace(/_/g, ' ').toUpperCase()}${h.note ? `: ${h.note}` : ''}`}
      >
        {phrase}
      </span>,
    )
    cursor = h.end
  })
  if (cursor < content.length) nodes.push(content.slice(cursor))
  return nodes
}

function BiasScore({ dimension, score }: { dimension: string; score: number }) {
  const percentage = Math.round(score * 100)
  const barColor = percentage > 70 ? 'bg-gray-500' : percentage > 40 ? 'bg-gray-600' : 'bg-gray-400'
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300 capitalize">
          {dimension.replace(/_/g, ' ')}
        </span>
        <span className="text-sm font-semibold text-white">
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function ArticlePage() {
  const { id } = useParams()
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mockTimeData = useMemo(() => [
    { date: '2024-10-20', bias: { ideological_stance: 0.2, factual_grounding: 0.7, framing_choices: 0.3, emotional_tone: 0.1, source_transparency: 0.6 } },
    { date: '2024-10-22', bias: { ideological_stance: 0.25, factual_grounding: 0.65, framing_choices: 0.35, emotional_tone: 0.15, source_transparency: 0.55 } },
    { date: '2024-10-24', bias: { ideological_stance: 0.3, factual_grounding: 0.6, framing_choices: 0.4, emotional_tone: 0.2, source_transparency: 0.5 } },
    { date: '2024-10-26', bias: { ideological_stance: 0.35, factual_grounding: 0.65, framing_choices: 0.45, emotional_tone: 0.25, source_transparency: 0.55 } },
  ], [])

  useEffect(() => {
    if (!id) return
    fetchArticle(id)
      .then(setArticle)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
  }, [id])

  const contentNodes = useMemo(() => {
    if (!article) return null
    return highlightContent(article.content, article.highlights)
  }, [article])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load article: {error}</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="animate-pulse py-8">
        <div className="h-12 w-3/4 bg-gray-800 rounded mb-6"></div>
        <div className="h-4 w-1/2 bg-gray-800 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-800 rounded"></div>
          <div className="h-4 w-full bg-gray-800 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[2fr_1fr]">
        <article className="max-w-none bg-gradient-to-b from-gray-950/50 to-transparent rounded-3xl p-8 -m-8">
          <h1 className="openai-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-12">
            <span className="font-medium">{article.source}</span>
            <span>•</span>
            <time>{new Date(article.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</time>
          </div>

          {article.excerpt && (
            <div className="openai-card p-6 mb-12">
              <p className="openai-body text-lg text-gray-300 italic leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          )}

          <div className="openai-body text-lg text-gray-200 leading-relaxed space-y-6">
            <p>{contentNodes}</p>
          </div>

          {article.highlights?.length > 0 && (
            <div className="openai-card p-8 mt-12">
              <h3 className="openai-heading text-xl text-white mb-6">
                Bias Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(DIMENSION_COLORS).map(([dimension, colorClass]) => (
                  <div key={dimension} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border ${colorClass}`}></div>
                    <span className="text-sm text-gray-300 capitalize">
                      {dimension.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Hover over highlighted phrases to see detailed bias analysis.
              </p>
            </div>
          )}
        </article>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="space-y-8">
            <div className="openai-card p-8">
              <h2 className="openai-heading text-xl text-white mb-6">
                Bias Analysis
              </h2>
              <BiasRadar scores={article.bias} />
              
              <div className="mt-8 space-y-6">
                {Object.entries(article.bias).map(([dimension, score]) => (
                  <BiasScore key={dimension} dimension={dimension} score={score} />
                ))}
              </div>
            </div>

            {article.primary_sources?.length > 0 && (
              <div className="openai-card p-8">
                <h3 className="openai-heading text-xl text-white mb-6">
                  Primary Sources
                </h3>
                <ul className="space-y-4">
                  {article.primary_sources.map((source) => (
                    <li key={source.url}>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group"
                      >
                        <span className="openai-body">{source.title}</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="openai-card p-8">
              <h3 className="openai-heading text-xl text-white mb-6">
                Bias Trend Analysis
              </h3>
              <BiasOverTime 
                data={mockTimeData} 
                dimension="ideological_stance"
                title="Ideological Stance Over Time"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}