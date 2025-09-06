export interface JobCategory { id: number; name: string }
export interface JobOccupation { id: number; name: string; categoryId: number }
export interface State { code: string; name: string }
export interface City { id: number; name: string; stateCode: string }
export interface WorkerSummary { id: number; name: string; email?: string; phone?: string; occupations?: string[]; cities?: string[] }
