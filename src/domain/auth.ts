export interface LoginDTO { email: string; password: string }

export interface UserProfile {
  id: number; name: string; email: string; phone: string;
  isWorker: boolean; workerId?: number;
}

export interface LoginResponse {
  access_token: string;
  user: UserProfile;
}

export interface RegisterWorkerDTO {
  name: string; password: string; email: string; phone: string;
  jobOccupationIds: number[]; operationCitiesIds: number[]
}

export interface RegisterClientDTO {
  name: string; email: string; phone: string; password: string;
}
