export type PaymentStatus = 'PAID' | 'UNPAID'
export interface BillingSummary {
  paidCount: number
  unpaidCount: number
  paidAmount: number
  unpaidAmount: number
}
export interface Transaction {
  id: number
  workerName?: string
  customerName?: string
  description?: string
  amount: number
  status: PaymentStatus
  createdAt: string
}
