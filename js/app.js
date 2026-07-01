/* app.js — app start, navigation between pages, dark mode toggle.
   This is the file that boots everything else, in order. */

const App = {
  currentType: 'expense',

  init(){
    this.registerServiceWorker();
    this.setupNav();
    this.setupAddForm();
    this.setupDarkToggle();

    // Restore dark mode preference
    const saved = DB.getSettings();
    if (saved.darkMode) this.setDarkMode(true);

    // Boot each page module
    Dashboard.init();
    CalendarPage.init();
    Reports.init();
    Settings.init();

    // Default date on add-transaction form
    document.getElementById('tx-date').value = new Date().toISOString().slice(0, 10);
    this.populateCategoryOptions();
  },

  registerServiceWorker(){
    if ('serviceWorker' in navigator){
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
  },

  setupNav(){
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-nav');
        this.goTo(target);
      });
    });
  },

  goTo(pageKey){
    // "transactions-all" is a shortcut used by the dashboard's "See all" link
    const key = pageKey === 'transactions-all' ? 'dashboard' : pageKey;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${key}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const navBtn = document.querySelector(`.nav-btn[data-nav="${key}"]`);
    if (navBtn) navBtn.classList.add('active');

    if (key === 'calendar') CalendarPage.render();
    if (key === 'reports') Reports.render();
  },

  setupAddForm(){
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentType = btn.getAttribute('data-type');
        this.populateCategoryOptions();
      });
    });

    document.getElementById('transactionForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('tx-amount').value;
      const category = document.getElementById('tx-category').value;
      const date = document.getElementById('tx-date').value;
      const note = document.getElementById('tx-note').value;

      if (!amount || Number(amount) <= 0) return;

      Transactions.add({ type: this.currentType, amount, category, date, note });

      document.getElementById('tx-amount').value = '';
      document.getElementById('tx-note').value = '';

      Dashboard.render();
      CalendarPage.render();
      Reports.render();
      this.goTo('dashboard');
    });
  },

  populateCategoryOptions(){
    const select = document.getElementById('tx-category');
    const list = CATEGORIES[this.currentType] || CATEGORIES.expense;
    select.innerHTML = list.map(c => `<option value="${c.key}">${c.icon} ${c.key}</option>`).join('');
  },

  setupDarkToggle(){
    document.getElementById('darkToggleBtn').addEventListener('click', () => {
      const isDark = document.getElementById('dark-mode-sheet').disabled === false;
      this.setDarkMode(!isDark);
      Settings.update({ darkMode: !isDark });
      const checkbox = document.getElementById('darkModeSetting');
      if (checkbox) checkbox.checked = !isDark;
    });
  },

  setDarkMode(on){
    document.getElementById('dark-mode-sheet').disabled = !on;
    document.getElementById('darkToggleBtn').textContent = on ? '☀️' : '🌙';
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
