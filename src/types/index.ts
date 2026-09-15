export type PaymentMode = 'UPI' | 'Cash' | 'NetBanking' | 'Cheque';
export type PaymentStatus = 'Received' | 'Pending' | 'Partial';

export interface ChandaRecord {
  id: string;
  flatNo: string;
  residentName: string;
  residentType?: 'Owner' | 'Tenant';
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  status: PaymentStatus;
  receiptNo: string;
  notes?: string;
  createdAt: number;
}

export interface ExpenseRecord {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  paymentMode: PaymentMode;
  billUrl?: string; // Data URL for uploaded receipt image
  createdAt: number;
}

export type ExpenseCategory =
  | 'Pandal & Decoration'
  | 'Murti & Flowers'
  | 'Prasadam & Food'
  | 'Sound & Lighting'
  | 'Daily Aarti & Pandit'
  | 'Visarjan Procession'
  | 'Printing & Banners'
  | 'Miscellaneous';

export interface FlatStatus {
  flatNo: string;
  residentName: string;
  contactNumber: string;
  targetAmount: number;
  paidAmount: number;
  status: PaymentStatus;
  lastPaymentDate?: string;
}

export interface PoojaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  coordinator: string;
  phone: string;
  description: string;
  isImportant?: boolean;
}

export interface AppState {
  chandaList: ChandaRecord[];
  expenseList: ExpenseRecord[];
  flatsList: FlatStatus[];
  poojaEvents: PoojaEvent[];
  totalTarget: number;
  lastUpdated: number;
  cloudSyncKey: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}
