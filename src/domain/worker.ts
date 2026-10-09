export interface WorkerProfile {
  id: number
  bio?: string
  /** Paid Destaque end date, only while it is active. */
  featuredUntil?: string | null
  user: { id: number; name: string; email: string; phone: string }
  jobOccupations: { id: number; name: string; pending?: boolean; category: { id: number; name: string } }[]
  operationCities: { id: number; name: string }[]
  averageRating?: number
  ratingCount?: number
}

export interface PortfolioItem {
  id: number
  type: 'image' | 'video'
  url: string
  caption?: string
  createdAt: string
}

export interface Rating {
  id: number
  score: number
  comment?: string
  createdAt: string
  authorName?: string
}

export interface RatingSummary {
  average: number
  count: number
}
