/* charts.js — all Chart.js rendering lives here.
   Uses the Chart.js UMD build loaded via CDN in index.html. */

const Charts = {
  _categoryChart: null,
  _trendChart: null,
  _reportChart: null,

  palette: ['#2F6F62', '#C9A227', '#B54834', '#5B6660', '#4FA88F', '#E0B93A', '#8B958E', '#9C7B14'],

  renderCategoryPie(canvasId, breakdown){
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (this._categoryChart) this._categoryChart.destroy();

    if (breakdown.length === 0){
      this._categoryChart = null;
      return;
    }

    this._categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: breakdown.map(([cat]) => cat),
        datasets: [{
          data: breakdown.map(([, amt]) => amt),
          backgroundColor: this.palette,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });
  },

  renderTrendLine(canvasId, dailyTotals){
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (this._trendChart) this._trendChart.destroy();

    this._trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dailyTotals.map(d => d.label),
        datasets: [{
          data: dailyTotals.map(d => d.amount),
          borderColor: '#2F6F62',
          backgroundColor: 'rgba(47,111,98,0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  },

  renderReportBar(canvasId, breakdown){
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (this._reportChart) this._reportChart.destroy();

    this._reportChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: breakdown.map(([cat]) => cat),
        datasets: [{
          data: breakdown.map(([, amt]) => amt),
          backgroundColor: '#2F6F62',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#E4DCC8' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
};
