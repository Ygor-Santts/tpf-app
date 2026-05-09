export interface WorkerProfile {
  id: number
  bio?: string
  user: { id: number; name: string; email: string; phone: string }
  jobOccupations: { id: number; name: string; category: { id: number; name: string } }[]
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
