export interface LoginDTO { email: string; password: string }

export interface UserProfile {
  id: number; name: string; email: string; phone: string;
  // Missing on sessions saved before email confirmation existed.
  emailVerified?: boolean;
  isWorker: boolean; workerId?: number;
}

export interface LoginResponse {
  access_token: string;
  user: UserProfile;
}

export interface ActivateWorkerDTO {
  jobOccupationIds: number[]; operationCitiesIds: number[]
}

export interface RegisterWorkerDTO extends ActivateWorkerDTO {
  name: string; password: string; email: string; phone: string;
}

export type AppMode = 'client' | 'worker'

export interface RegisterClientDTO {
  name: string; email: string; phone: string; password: string;
}
