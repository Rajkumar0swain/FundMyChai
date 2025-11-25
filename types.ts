export interface Creator {
  id: string;
  name: string;
  handle: string;
  upiId: string;
  bio: string;
  category: string;
  avatarUrl?: string;
}

export interface PaymentState {
  amount: number;
  message: string;
  fromName: string;
}

export interface Transaction {
  id: string;
  fromName: string;
  amount: number;
  message: string;
  date: string; // ISO string
  status: 'success' | 'pending';
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  GENERATING_QR = 'GENERATING_QR',
  READY_TO_PAY = 'READY_TO_PAY',
  SUCCESS = 'SUCCESS'
}