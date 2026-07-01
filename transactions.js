/* transactions.js — add, edit, delete, search & filter transactions.
   Talks only to DB (see firebase.js) so storage can be swapped later. */

const CATEGORIES = {
  expense: [
    { key: 'Food', icon: '🍔' },
    { key: 'Transport', icon: '🚌' },
    { key: 'Shopping', icon: '🛍️' },
    { key: 'Bills', icon: '🧾' },
    { key: 'Health', icon: '💊' },
    { key: 'Entertainment', icon: '🎬' },
    { key: 'Grocery', icon: '🛒' },
    { key: 'Other', icon: '📦' }
  ],
  income: [
    { key: 'Salary', icon: '💰' },
    { key: 'Freelance', icon: '💻' },
    { key: 'Gift', icon: '🎁' },
    { key: 'Investment', icon: '📈' },
    { key: 'Other', icon: '📦' }
  ]
};

function categoryIcon(type, name){
  const list = CATEGORIES[type] || CATEGORIES.expense;
  const found = list.find(c => c.key === name);
  return found ? found.icon : '📦';
}

const Transactions = {
  add({ type, amount, category, date, note }){
    const tx = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      type,
      amount: Number(amount),
      category,
      date,
      note: note || '',
      createdAt: new Date().toISOString()
    };
    DB.addTransaction(tx);
    return tx;
  },

  delete(id){
    DB.deleteTransaction(id);
  },

  all(){
    return DB.getTransactions().sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  forMonth(year, month){
    // month is 0-indexed
    return this.all().filter(t => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  forDay(dateStr){
    return this.all().filter(t => t.date === dateStr);
  },

  search(query){
    const q = query.trim().toLowerCase();
    if (!q) return this.all();
    return this.all().filter(t =>
      t.category.toLowerCase().includes(q) ||
      (t.note && t.note.toLowerCase().includes(q))
    );
  },

  filterByType(type){
    return this.all().filter(t => t.type === type);
  },

  totals(list){
    const income = list.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = list.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  },

  categoryBreakdown(list, type = 'expense'){
    const filtered = list.filter(t => t.type === type);
    const totals = {};
    filtered.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }
};
