export interface LoginDTO {
  email: string
  password: string
}
export interface LoginResponseDTO {
  access_token: string
}

export interface RegisterWorkerDTO {
  name: string
  password: string
  email: string
  phone: string
  jobOccupationIds: number[]
  operationCitiesIds: number[]
}
