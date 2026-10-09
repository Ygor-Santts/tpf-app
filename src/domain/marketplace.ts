// pending: added by this worker and still waiting for the team's review.
export interface JobCategory { id: number; name: string; pending?: boolean }
export interface JobOccupation { id: number; name: string; categoryId: number; pending?: boolean }
export interface State { code: string; name: string }
export interface City { id: number; name: string; stateCode: string }
export interface WorkerSummary { id: number; name: string; email?: string; phone?: string; occupations?: string[]; cities?: string[]; featured?: boolean }
