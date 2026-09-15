import type { AppState, FlatStatus, ChandaRecord, ExpenseRecord, PoojaEvent } from '../types';

export const INITIAL_FLATS: FlatStatus[] = [
  { flatNo: '101', residentName: 'Ramesh Sharma', contactNumber: '9876543210', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-10' },
  { flatNo: '102', residentName: 'Kamesh Bandla', contactNumber: '9876543211', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-11' },
  { flatNo: '103', residentName: 'Suresh Kumar', contactNumber: '9876543212', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-12' },
  { flatNo: '201', residentName: 'Venkatesh Rao', contactNumber: '9876543213', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-12' },
  { flatNo: '202', residentName: 'Anand Verma', contactNumber: '9876543214', targetAmount: 2500, paidAmount: 1500, status: 'Partial', lastPaymentDate: '2026-09-13' },
  { flatNo: '203', residentName: 'Rajesh Patel', contactNumber: '9876543215', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-13' },
  { flatNo: '301', residentName: 'Praveen Reddy', contactNumber: '9876543216', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '302', residentName: 'Srinivas Murthy', contactNumber: '9876543217', targetAmount: 2500, paidAmount: 0, status: 'Pending' },
  { flatNo: '303', residentName: 'Vijay Kulkarni', contactNumber: '9876543218', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '401', residentName: 'Dinesh Joshi', contactNumber: '9876543219', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '402', residentName: 'Subba Rao', contactNumber: '9876543220', targetAmount: 2500, paidAmount: 0, status: 'Pending' },
  { flatNo: '403', residentName: 'Mahesh Agarwal', contactNumber: '9876543221', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-15' },
  { flatNo: '501', residentName: 'Narayana Swamy', contactNumber: '9876543222', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-15' },
  { flatNo: '502', residentName: 'Kishore Babu', contactNumber: '9876543223', targetAmount: 2500, paidAmount: 1000, status: 'Partial', lastPaymentDate: '2026-09-15' },
  { flatNo: '503', residentName: 'Satish Chandra', contactNumber: '9876543224', targetAmount: 2500, paidAmount: 2500, status: 'Received', lastPaymentDate: '2026-09-15' },
];

export const INITIAL_CHANDA: ChandaRecord[] = [
  { id: 'chanda-1', flatNo: '101', residentName: 'Ramesh Sharma', amount: 2500, date: '2026-09-10', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-001', notes: 'GPay UPI', createdAt: 1789000000000 },
  { id: 'chanda-2', flatNo: '102', residentName: 'Kamesh Bandla', amount: 2500, date: '2026-09-11', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-002', notes: 'PhonePe', createdAt: 1789086400000 },
  { id: 'chanda-3', flatNo: '103', residentName: 'Suresh Kumar', amount: 2500, date: '2026-09-12', paymentMode: 'Cash', status: 'Received', receiptNo: 'RSG-2026-003', notes: 'Cash handed to Treasurer', createdAt: 1789172800000 },
  { id: 'chanda-4', flatNo: '201', residentName: 'Venkatesh Rao', amount: 2500, date: '2026-09-12', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-004', notes: 'Paytm UPI', createdAt: 1789200000000 },
  { id: 'chanda-5', flatNo: '202', residentName: 'Anand Verma', amount: 1500, date: '2026-09-13', paymentMode: 'Cash', status: 'Received', receiptNo: 'RSG-2026-005', notes: 'Partial (₹1000 pending)', createdAt: 1789250000000 },
  { id: 'chanda-6', flatNo: '203', residentName: 'Rajesh Patel', amount: 2500, date: '2026-09-13', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-006', notes: 'GPay', createdAt: 1789300000000 },
  { id: 'chanda-7', flatNo: '301', residentName: 'Praveen Reddy', amount: 2500, date: '2026-09-14', paymentMode: 'NetBanking', status: 'Received', receiptNo: 'RSG-2026-007', notes: 'HDFC NEFT', createdAt: 1789350000000 },
  { id: 'chanda-8', flatNo: '303', residentName: 'Vijay Kulkarni', amount: 2500, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-008', notes: 'UPI Direct', createdAt: 1789400000000 },
  { id: 'chanda-9', flatNo: '401', residentName: 'Dinesh Joshi', amount: 2500, date: '2026-09-14', paymentMode: 'Cash', status: 'Received', receiptNo: 'RSG-2026-009', notes: 'Cash', createdAt: 1789410000000 },
  { id: 'chanda-10', flatNo: '403', residentName: 'Mahesh Agarwal', amount: 2500, date: '2026-09-15', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-010', notes: 'GPay', createdAt: 1789450000000 },
  { id: 'chanda-11', flatNo: '501', residentName: 'Narayana Swamy', amount: 2500, date: '2026-09-15', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-011', notes: 'PhonePe', createdAt: 1789460000000 },
  { id: 'chanda-12', flatNo: '502', residentName: 'Kishore Babu', amount: 1000, date: '2026-09-15', paymentMode: 'Cash', status: 'Received', receiptNo: 'RSG-2026-012', notes: 'Partial payment', createdAt: 1789470000000 },
  { id: 'chanda-13', flatNo: '503', residentName: 'Satish Chandra', amount: 2500, date: '2026-09-15', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-2026-013', notes: 'Amazon Pay UPI', createdAt: 1789480000000 },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  { id: 'exp-1', category: 'Murti & Flowers', description: 'Ganesh Idol Advance Deposit (4ft Clay Idol)', amount: 6500, paidBy: 'Kamesh Bandla', date: '2026-09-08', paymentMode: 'UPI', createdAt: 1788900000000 },
  { id: 'exp-2', category: 'Pandal & Decoration', description: 'Mandap Setup & Fabric Tent Booking Advance', amount: 8000, paidBy: 'Ramesh Sharma', date: '2026-09-09', paymentMode: 'Cash', createdAt: 1788950000000 },
  { id: 'exp-3', category: 'Sound & Lighting', description: 'LED Decorative Lights & Sound System Rental', amount: 4500, paidBy: 'Suresh Kumar', date: '2026-09-10', paymentMode: 'UPI', createdAt: 1789010000000 },
  { id: 'exp-4', category: 'Printing & Banners', description: 'Welcome Arch Banner & Sponsor flex boards', amount: 1200, paidBy: 'Kamesh Bandla', date: '2026-09-11', paymentMode: 'UPI', createdAt: 1789100000000 },
  { id: 'exp-5', category: 'Daily Aarti & Pandit', description: 'Pandit Ji Sthapana & Pooja Samagri Kit', amount: 3500, paidBy: 'Venkatesh Rao', date: '2026-09-14', paymentMode: 'Cash', createdAt: 1789360000000 },
  { id: 'exp-6', category: 'Prasadam & Food', description: 'Modak Prasad & Laddu Distribution (Day 1)', amount: 2200, paidBy: 'Rajesh Patel', date: '2026-09-15', paymentMode: 'UPI', createdAt: 1789465000000 },
];

export const INITIAL_EVENTS: PoojaEvent[] = [
  { id: 'evt-1', title: 'Ganesh Sthapana & Grand Aarti', date: '2026-09-15', time: '09:30 AM', location: 'RS Towers Main Pandal Ground', coordinator: 'Kamesh Bandla', phone: '9876543211', description: 'Welcoming Lord Ganesha with Dhol Tasha, Prana Pratishtha Pooja & Morning Grand Aarti.', isImportant: true },
  { id: 'evt-2', title: 'Daily Morning Aarti & Archana', date: '2026-09-16', time: '07:30 AM', location: 'Pandal Stage', coordinator: 'Ramesh Sharma', phone: '9876543210', description: 'Daily morning prayers & Panchamrut prasadam distribution.' },
  { id: 'evt-3', title: 'Children Cultural Program & Modak Contest', date: '2026-09-17', time: '06:30 PM', location: 'RS Towers Clubhouse Hall', coordinator: 'Praveen Reddy', phone: '9876543216', description: 'Drawing competition, fancy dress, and homemade Modak tasting event.' },
  { id: 'evt-4', title: 'Maha Annadanam (Community Feast)', date: '2026-09-18', time: '01:00 PM', location: 'Pandal Dining Area', coordinator: 'Venkatesh Rao', phone: '9876543213', description: 'Grand lunch feast for all RS Towers residents, family & guests.', isImportant: true },
  { id: 'evt-5', title: 'Grand Visarjan Shobhayatra & Immersion', date: '2026-09-19', time: '04:00 PM', location: 'RS Towers Main Gate to Lake', coordinator: 'Committee Members', phone: '9876543211', description: 'Final Aarti, Dhol Tasha procession, Gulal celebration, and eco-visarjan.', isImportant: true },
];

export const INITIAL_APP_STATE: AppState = {
  chandaList: INITIAL_CHANDA,
  expenseList: INITIAL_EXPENSES,
  flatsList: INITIAL_FLATS,
  poojaEvents: INITIAL_EVENTS,
  totalTarget: 37500,
  lastUpdated: Date.now(),
  cloudSyncKey: 'rs-towers-ganesh-2026-default-key',
};
