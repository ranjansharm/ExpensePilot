/* reports.js — date-range reports, CSV export, printable PDF export */

const Reports = {
  init(){
    document.getElementById('reportRange').addEventListener('change', () => this.render());
    document.getElementById('exportCsv').addEventListener('click', () => this.exportCsv());
    document.getElementById('exportPdf').addEventListener('click', () => this.exportPdf());
    this.render();
  },

  getRangeTransactions(){
    const range = document.getElementById('reportRange').value;
    const now = new Date();
    const all = Transactions.all();

    if (range === 'month'){
      return Transactions.forMonth(now.getFullYear(), now.getMonth());
    }
    if (range === 'year'){
      return all.filter(t => new Date(t.date + 'T00:00:00').getFullYear() === now.getFullYear());
    }
    return all;
  },

  render(){
    const list = this.getRangeTransactions();
    const breakdown = Transactions.categoryBreakdown(list, 'expense');

    Charts.renderReportBar('reportChart', breakdown);

    const table = document.getElementById('reportTable');
    if (breakdown.length === 0){
      table.innerHTML = '<div class="empty-state">No expenses in this range yet.</div>';
      return;
    }
    table.innerHTML = breakdown.map(([cat, amt]) => `
      <div class="report-row">
        <span class="r-cat">${cat}</span>
        <span class="r-amt">${Dashboard.fmt(amt)}</span>
      </div>`).join('');
  },

  exportCsv(){
    const list = this.getRangeTransactions();
    if (list.length === 0){
      alert('No transactions to export in this range.');
      return;
    }

    const header = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = list.map(t => [t.date, t.type, t.category, t.amount, (t.note || '').replace(/,/g, ' ')]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expensepilot-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportPdf(){
    const list = this.getRangeTransactions();
    const totals = Transactions.totals(list);
    const rangeLabel = document.getElementById('reportRange').selectedOptions[0].textContent;

    const rowsHtml = list.map(t => `
      <tr>
        <td>${t.date}</td>
        <td>${t.type}</td>
        <td>${t.category}</td>
        <td>${t.note || ''}</td>
        <td>${Dashboard.fmt(t.amount)}</td>
      </tr>`).join('');

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>ExpensePilot Report</title>
        <style>
          body{font-family:sans-serif;padding:32px;color:#1F2A24;}
          h1{font-size:20px;margin-bottom:2px;}
          .sub{font-size:12px;color:#5B6660;margin-bottom:20px;}
          table{width:100%;border-collapse:collapse;font-size:12px;}
          th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #E4DCC8;}
          th{color:#5B6660;}
          .totals{margin-top:16px;font-size:13px;}
        </style>
      </head>
      <body>
        <h1>ExpensePilot report</h1>
        <p class="sub">${rangeLabel} · generated ${new Date().toLocaleDateString('en-IN')}</p>
        <table>
          <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Note</th><th>Amount</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="totals">
          <p>Total income: ${Dashboard.fmt(totals.income)}</p>
          <p>Total expense: ${Dashboard.fmt(totals.expense)}</p>
          <p><strong>Net: ${Dashboard.fmt(totals.balance)}</strong></p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }
};
