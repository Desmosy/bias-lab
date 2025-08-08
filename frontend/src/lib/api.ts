import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
})

export type BiasScores = {
  ideological_stance: number
  factual_grounding: number
  framing_choices: number
  emotional_tone: number
  source_transparency: number
}

export type ArticleSummary = {
  id: string
  title: string
  source: string
  date: string
  bias: BiasScores
  excerpt?: string
}

export type Highlight = {
  start: number
  end: number
  dimension: keyof BiasScores
  note?: string
}

export type PrimarySource = { title: string; url: string }

export type ArticleDetail = ArticleSummary & {
  content: string
  highlights: Highlight[]
  primary_sources: PrimarySource[]
}

export type ClusterArticle = { id: string; title: string }

export type NarrativeCluster = {
  id: string
  title: string
  description: string
  divergence_index: number
  top_articles: ClusterArticle[]
}

export async function fetchArticles(): Promise<ArticleSummary[]> {
  const { data } = await api.get<ArticleSummary[]>('/articles')
  return data
}

export async function fetchArticle(id: string): Promise<ArticleDetail> {
  const { data } = await api.get<ArticleDetail>(`/articles/${id}`)
  return data
}

export async function fetchNarratives(): Promise<NarrativeCluster[]> {
  const { data } = await api.get<NarrativeCluster[]>('/narratives')
  return data
}