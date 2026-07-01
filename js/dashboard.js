/* dashboard.js — balance card, monthly summary, charts, insights, recent list */

const Dashboard = {
  currentDate: new Date(),

  init(){
    this.populateMonthPicker();
    document.getElementById('monthPicker').addEventListener('change', (e) => {
      const [y, m] = e.target.value.split('-').map(Number);
      this.currentDate = new Date(y, m, 1);
      this.render();
    });
    this.render();
  },

  populateMonthPicker(){
    const picker = document.getElementById('monthPicker');
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++){
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d);
    }
    picker.innerHTML = months.map(d => {
      const val = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      return `<option value="${val}">${label}</option>`;
    }).join('');
  },

  currency(){
    const settings = DB.getSettings();
    return settings.currency || '₹';
  },

  fmt(n){
    const cur = this.currency();
    return cur + Math.round(n).toLocaleString('en-IN');
  },

  render(){
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const monthTx = Transactions.forMonth(year, month);
    const totals = Transactions.totals(monthTx);

    document.getElementById('totalBalance').textContent = this.fmt(totals.balance);
    document.getElementById('totalIncome').textContent = this.fmt(totals.income);
    document.getElementById('totalExpense').textContent = this.fmt(totals.expense);

    // Category pie (expenses)
    const breakdown = Transactions.categoryBreakdown(monthTx, 'expense');
    Charts.renderCategoryPie('categoryChart', breakdown);

    // Daily trend line for the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyTotals = [];
    for (let d = 1; d <= daysInMonth; d++){
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTotal = monthTx.filter(t => t.date === dateStr && t.type === 'expense')
                               .reduce((s, t) => s + t.amount, 0);
      dailyTotals.push({ label: d, amount: dayTotal });
    }
    Charts.renderTrendLine('trendChart', dailyTotals);

    this.renderInsight(year, month, monthTx, breakdown);
    this.renderRecent();
  },

  // Simple rule-based "AI insight" — compares this month vs last month per category.
  renderInsight(year, month, monthTx, breakdown){
    const insightEl = document.getElementById('insightText');

    if (breakdown.length === 0){
      insightEl.textContent = 'Add a few transactions to see personalized insights.';
      return;
    }

    const prevDate = new Date(year, month - 1, 1);
    const prevTx = Transactions.forMonth(prevDate.getFullYear(), prevDate.getMonth());
    const prevBreakdown = Object.fromEntries(Transactions.categoryBreakdown(prevTx, 'expense'));

    const [topCat, topAmt] = breakdown[0];
    const prevTopAmt = prevBreakdown[topCat] || 0;

    if (prevTopAmt > 0){
      const diffPct = Math.round(((topAmt - prevTopAmt) / prevTopAmt) * 100);
      if (diffPct > 5){
        insightEl.textContent = `You spent ${diffPct}% more on ${topCat} this month compared to last month.`;
        return;
      } else if (diffPct < -5){
        insightEl.textContent = `Nice — your ${topCat} spending dropped ${Math.abs(diffPct)}% compared to last month.`;
        return;
      }
    }

    const total = breakdown.reduce((s, [, amt]) => s + amt, 0);
    const pctOfTotal = Math.round((topAmt / total) * 100);
    const potentialSaving = Math.round(topAmt * 0.15);
    insightEl.textContent = `${topCat} makes up ${pctOfTotal}% of your spending. Cutting it by 15% could save you about ${this.fmt(potentialSaving)} this month.`;
  },

  renderRecent(){
    const list = Transactions.all().slice(0, 6);
    const container = document.getElementById('recentTransactions');

    if (list.length === 0){
      container.innerHTML = '<div class="empty-state">No transactions yet. Tap + to add your first one.</div>';
      return;
    }

    container.innerHTML = list.map(t => this.txRow(t)).join('');

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        Transactions.delete(btn.getAttribute('data-delete'));
        Dashboard.render();
      });
    });
  },

  txRow(t){
    const icon = categoryIcon(t.type, t.category);
    const dateLabel = new Date(t.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `
      <div class="transaction-item">
        <div class="tx-icon">${icon}</div>
        <div class="tx-info">
          <p class="tx-category">${t.category}</p>
          <p class="tx-meta">${dateLabel}${t.note ? ' · ' + t.note : ''}</p>
        </div>
        <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${this.fmt(t.amount)}</div>
        <button class="tx-delete" data-delete="${t.id}" aria-label="Delete">✕</button>
      </div>`;
  }
};
