import type { AppState } from '../types';

export const GITHUB_PAGES_LIVE_URL = 'https://bandlakamesh.github.io/rs-towers-ganesh-tracker/index.html?v=2';

export const generateWhatsAppBroadcastText = (state: AppState): string => {
  const totalCollected = state.chandaList
    .filter((c) => c.status === 'Received')
    .reduce((acc, c) => acc + c.amount, 0);

  const totalSpent = state.expenseList.reduce((acc, e) => acc + e.amount, 0);
  const netBalance = totalCollected - totalSpent;

  const totalFlats = state.flatsList.length;
  const paidFlats = state.flatsList.filter((f) => f.status === 'Received').length;
  const partialFlats = state.flatsList.filter((f) => f.status === 'Partial').length;

  const topExpenses = state.expenseList
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map((e) => `• ${e.description} (${e.category}): ₹${e.amount.toLocaleString('en-IN')}`)
    .join('\n');

  return `🚩 *R.S TOWERS GANESH UTSAV 2026* 🚩
*Live Income & Expense Transparency Update*
---------------------------------------------
💰 *Total Chanda Collected*: ₹${totalCollected.toLocaleString('en-IN')}
💸 *Total Expenses Paid*: ₹${totalSpent.toLocaleString('en-IN')}
💵 *Net Balance in Hand*: ₹${netBalance.toLocaleString('en-IN')}
---------------------------------------------
🏢 *Flat Contribution Status*:
✅ Fully Paid: ${paidFlats} / ${totalFlats} Flats
⏳ Partial Paid: ${partialFlats} Flats
---------------------------------------------
📌 *Major Expenses Paid*:
${topExpenses || '• No major expenses recorded yet.'}
---------------------------------------------
🙏 *Thank you RS Towers Residents for your generous support!*`;
};

export const generateWhatsAppReminderText = (flatNo: string, residentName: string, pendingAmount: number): string => {
  return `🚩 *R.S TOWERS GANESH UTSAV 2026* 🚩
Dear ${residentName} (Flat ${flatNo}),

Greetings! 🙏 This is a gentle reminder regarding the Ganesh Utsav 2026 Chanda contribution.

📌 *Pending Amount*: ₹${pendingAmount.toLocaleString('en-IN')}
💳 *Payment Methods*: GPay / PhonePe / Paytm / Cash to Committee Treasurer.

Please click below to track live income & expenses for RS Towers:
🔗 ${GITHUB_PAGES_LIVE_URL}

Thank you for your valuable support! 🙏
- RS Towers Ganesh Utsav Committee`;
};

export const generateWhatsAppEventReminderText = (event: { title: string; date: string; time: string; location: string; coordinator: string; phone: string; description: string }): string => {
  return `🪔 *R.S TOWERS GANESH UTSAV 2026 - EVENT REMINDER* 🪔

🚩 *${event.title}*

📅 *Date & Time*: ${event.date} • ${event.time}
📍 *Venue*: ${event.location}
👤 *Coordinator*: ${event.coordinator} (${event.phone})

📝 *Details*: ${event.description}

🙏 All RS Towers residents & family members are cordially invited!
Ganpati Bappa Morya! 🌺`;
};

export const openWhatsAppShareLink = (text: string): void => {
  const encoded = encodeURIComponent(text);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
};
