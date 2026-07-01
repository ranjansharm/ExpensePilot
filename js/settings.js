/* settings.js — currency, budget, dark mode toggle, clear data */

const Settings = {
  init(){
    const saved = DB.getSettings();

    const currencySelect = document.getElementById('currencySelect');
    const budgetInput = document.getElementById('budgetSetting');
    const darkCheckbox = document.getElementById('darkModeSetting');

    currencySelect.value = saved.currency || '₹';
    budgetInput.value = saved.budget || '';
    darkCheckbox.checked = !!saved.darkMode;

    currencySelect.addEventListener('change', () => {
      this.update({ currency: currencySelect.value });
      Dashboard.render();
    });

    budgetInput.addEventListener('change', () => {
      this.update({ budget: Number(budgetInput.value) || 0 });
    });

    darkCheckbox.addEventListener('change', () => {
      App.setDarkMode(darkCheckbox.checked);
      this.update({ darkMode: darkCheckbox.checked });
    });

    document.getElementById('clearDataBtn').addEventListener('click', () => {
      if (confirm('This will permanently delete all your transactions. Continue?')){
        DB.saveTransactions([]);
        Dashboard.render();
        CalendarPage.render();
        Reports.render();
        alert('All data cleared.');
      }
    });
  },

  update(patch){
    const current = DB.getSettings();
    DB.saveSettings({ ...current, ...patch });
  }
};
