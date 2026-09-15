import type { AppState, FlatStatus, ChandaRecord, ExpenseRecord, PoojaEvent } from '../types';

export const INITIAL_FLATS: FlatStatus[] = [
  { flatNo: '101', residentName: 'Bobby', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '102', residentName: 'Tenant', contactNumber: '', targetAmount: 3000, paidAmount: 0, status: 'Pending' },
  { flatNo: '103', residentName: 'Balaji', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '201', residentName: 'Naveen Varma', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '202', residentName: 'Satya Nimmakayala', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '203', residentName: 'Harshavardhan', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '301', residentName: 'Yugandhar', contactNumber: '', targetAmount: 3000, paidAmount: 5500, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '302', residentName: 'Kamesh', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '303', residentName: 'Sharath Babu', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '401', residentName: 'Arun', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '402', residentName: 'Ujwala', contactNumber: '', targetAmount: 3000, paidAmount: 3500, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '403', residentName: 'Ravi Shankar', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '501', residentName: 'Srikanth', contactNumber: '', targetAmount: 3000, paidAmount: 3000, status: 'Received', lastPaymentDate: '2026-09-14' },
  { flatNo: '502', residentName: 'Prasanna', contactNumber: '', targetAmount: 3000, paidAmount: 0, status: 'Pending' },
  { flatNo: '503', residentName: 'Owner', contactNumber: '', targetAmount: 3000, paidAmount: 0, status: 'Pending' },
];

export const INITIAL_CHANDA: ChandaRecord[] = [
  { id: 'chanda-101', flatNo: '101', residentName: 'Bobby', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-101', notes: 'Owner Contribution', createdAt: 1789400000000 },
  { id: 'chanda-103', flatNo: '103', residentName: 'Balaji', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-103', notes: 'Owner Contribution', createdAt: 1789400000001 },
  { id: 'chanda-201', flatNo: '201', residentName: 'Naveen Varma', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-201', notes: 'Owner Contribution', createdAt: 1789400000002 },
  { id: 'chanda-202', flatNo: '202', residentName: 'Satya Nimmakayala', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-202', notes: 'Tenant Contribution', createdAt: 1789400000003 },
  { id: 'chanda-203', flatNo: '203', residentName: 'Harshavardhan', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-203', notes: 'Owner Contribution', createdAt: 1789400000004 },
  { id: 'chanda-301', flatNo: '301', residentName: 'Yugandhar', amount: 5500, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-301', notes: 'Paid Ganesh Idol ₹5,500', createdAt: 1789400000005 },
  { id: 'chanda-302', flatNo: '302', residentName: 'Kamesh', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-302', notes: 'Owner Contribution', createdAt: 1789400000006 },
  { id: 'chanda-303', flatNo: '303', residentName: 'Sharath Babu', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-303', notes: 'Owner Contribution', createdAt: 1789400000007 },
  { id: 'chanda-401', flatNo: '401', residentName: 'Arun', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-401', notes: 'Owner Contribution', createdAt: 1789400000008 },
  { id: 'chanda-402', flatNo: '402', residentName: 'Ujwala', amount: 3500, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-402', notes: 'Tenant Contribution', createdAt: 1789400000009 },
  { id: 'chanda-403', flatNo: '403', residentName: 'Ravi Shankar', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-403', notes: 'Owner Contribution', createdAt: 1789400000010 },
  { id: 'chanda-501', flatNo: '501', residentName: 'Srikanth', amount: 3000, date: '2026-09-14', paymentMode: 'UPI', status: 'Received', receiptNo: 'RSG-501', notes: 'Owner Contribution', createdAt: 1789400000011 },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  { id: 'exp-1789469180100', category: 'Pandal & Decoration', description: 'Banana Tree', amount: 50, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469180100 },
  { id: 'exp-1789469150502', category: 'Miscellaneous', description: 'Ropes', amount: 150, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469150502 },
  { id: 'exp-1789469134042', category: 'Pandal & Decoration', description: 'Decoration Thornalu', amount: 300, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469134042 },
  { id: 'exp-1789469115779', category: 'Daily Aarti & Pandit', description: 'Pancha', amount: 300, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469115779 },
  { id: 'exp-1789469101132', category: 'Miscellaneous', description: 'BLUE mat', amount: 800, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469101132 },
  { id: 'exp-1789469082228', category: 'Daily Aarti & Pandit', description: 'Jaggery/wood apple', amount: 23, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469082228 },
  { id: 'exp-1789469055709', category: 'Miscellaneous', description: 'chain/key', amount: 320, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469055709 },
  { id: 'exp-1789469033487', category: 'Daily Aarti & Pandit', description: 'Kalash', amount: 269, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469033487 },
  { id: 'exp-1789469010758', category: 'Pandal & Decoration', description: 'LED focus light', amount: 256, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789469010758 },
  { id: 'exp-1789468988296', category: 'Daily Aarti & Pandit', description: 'Premidalu', amount: 140, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789468988296 },
  { id: 'exp-1789468964332', category: 'Pandal & Decoration', description: 'curtains', amount: 561, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789468964332 },
  { id: 'exp-1789468700488', category: 'Daily Aarti & Pandit', description: 'Pooja Items', amount: 632, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-15', paymentMode: 'UPI', billUrl: '', createdAt: 1789468700488 },
  { id: 'exp-real-1', category: 'Murti & Flowers', description: 'Ganesh idol', amount: 5500, paidBy: 'Flat 301 - Yugandhar', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000100 },
  { id: 'exp-real-2', category: 'Prasadam & Food', description: 'Food (60 plates * ₹230 per plate)', amount: 13800, paidBy: 'Vendor', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000101 },
  { id: 'exp-real-3', category: 'Daily Aarti & Pandit', description: 'Pooja Items - Rice', amount: 104, paidBy: 'Flat 302 - Kamesh', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000102 },
  { id: 'exp-real-4', category: 'Daily Aarti & Pandit', description: 'Pooja Items - Sugar', amount: 22, paidBy: 'Flat 302 - Kamesh', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000103 },
  { id: 'exp-real-5', category: 'Miscellaneous', description: 'Green Mat', amount: 600, paidBy: 'Flat 302 - Kamesh', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000104 },
  { id: 'exp-real-6', category: 'Sound & Lighting', description: 'Electrical - Lights', amount: 112, paidBy: 'Flat 302 - Kamesh', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000105 },
  { id: 'exp-real-7', category: 'Sound & Lighting', description: 'Electrical - Socket Wire', amount: 120, paidBy: 'Flat 302 - Kamesh', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000106 },
  { id: 'exp-real-8', category: 'Miscellaneous', description: 'Pins and Double Plaster', amount: 50, paidBy: 'Flat 302 - Kamesh', date: '2026-09-14', paymentMode: 'UPI', createdAt: 1789400000107 },
];

export const INITIAL_EVENTS: PoojaEvent[] = [
  { id: 'evt-1', title: 'Ganesh Sthapana & Grand Aarti', date: '2026-09-15', time: '09:30 AM', location: 'RS Towers Main Pandal Ground', coordinator: 'Kamesh', phone: 'Flat 302', description: 'Welcoming Lord Ganesha with Dhol Tasha, Prana Pratishtha Pooja & Morning Grand Aarti.', isImportant: true },
  { id: 'evt-2', title: 'Daily Morning & Evening Aarti', date: '2026-09-16', time: '07:30 AM / 07:00 PM', location: 'Pandal Stage', coordinator: 'Yugandhar / Balaji', phone: 'Flat 301 / 103', description: 'Daily prayers & Panchamrut prasadam distribution.' },
  { id: 'evt-3', title: 'Maha Prasadam Food Distribution', date: '2026-09-17', time: '01:00 PM', location: 'RS Towers Dining Area', coordinator: 'RS Towers Committee', phone: 'All Members', description: '60 plates catering for all residents & family members.', isImportant: true },
  { id: 'evt-4', title: 'Grand Visarjan Shobhayatra', date: '2026-09-18', time: '04:00 PM', location: 'RS Towers Main Gate', coordinator: 'Committee Members', phone: 'Flat 302', description: 'Final Aarti, Dhol Tasha procession, Gulal celebration, and eco-visarjan.', isImportant: true },
];

export const INITIAL_APP_STATE: AppState = {
  chandaList: INITIAL_CHANDA,
  expenseList: INITIAL_EXPENSES,
  flatsList: INITIAL_FLATS,
  poojaEvents: INITIAL_EVENTS,
  totalTarget: 45000, // 15 flats @ 3000 each
  lastUpdated: 1789469180100, // Fixed baseline timestamp corresponding to Yugandhar's edits
  cloudSyncKey: 'rs-towers-ganesh-2026-default-key',
};
