/* calendar.js — monthly calendar grid with expense indicator dots */

const CalendarPage = {
  viewDate: new Date(),
  selectedDate: null,

  init(){
    document.getElementById('calPrev').addEventListener('click', () => {
      this.viewDate.setMonth(this.viewDate.getMonth() - 1);
      this.render();
    });
    document.getElementById('calNext').addEventListener('click', () => {
      this.viewDate.setMonth(this.viewDate.getMonth() + 1);
      this.render();
    });
    this.render();
  },

  render(){
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    document.getElementById('calLabel').textContent =
      this.viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthTx = Transactions.forMonth(year, month);
    const spendDays = new Set(monthTx.filter(t => t.type === 'expense').map(t => t.date));

    const dow = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let html = dow.map(d => `<div class="cal-dow">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++){
      html += `<div class="cal-day empty"></div>`;
    }

    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++){
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const isSelected = this.selectedDate === dateStr;
      const hasSpend = spendDays.has(dateStr);
      html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${dateStr}">
        ${d}${hasSpend ? '<span class="dot"></span>' : ''}
      </div>`;
    }

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = html;

    grid.querySelectorAll('.cal-day[data-date]').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedDate = el.getAttribute('data-date');
        this.render();
        this.renderDayDetail();
      });
    });

    if (this.selectedDate) this.renderDayDetail();
  },

  renderDayDetail(){
    const container = document.getElementById('calendarDayDetail');
    const dayTx = Transactions.forDay(this.selectedDate);
    const dateLabel = new Date(this.selectedDate + 'T00:00:00')
      .toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    if (dayTx.length === 0){
      container.innerHTML = `<p style="font-size:13px;font-weight:600;margin:0 0 6px;">${dateLabel}</p>
        <div class="empty-state">No transactions on this day.</div>`;
      return;
    }

    const rows = dayTx.map(t => Dashboard.txRow(t)).join('');
    container.innerHTML = `<p style="font-size:13px;font-weight:600;margin:0 0 10px;">${dateLabel}</p>${rows}`;

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        Transactions.delete(btn.getAttribute('data-delete'));
        CalendarPage.render();
      });
    });
  }
};
