const { loadConfig } = require('../../config/loadConfig');
const { createDashboardServer } = require('./server');

function runDashboardFeature() {
  const config = loadConfig();
  const app = createDashboardServer({ config });
  const PORT = process.env.PORT || 3010;

  app.listen(PORT, () => {
    console.log('===============================================');
    console.log(`🌐 Server is running on port ${PORT}`);
    console.log(`👉 View Dashboard: http://localhost:${PORT}/histories.html`);
    console.log('===============================================');
  });
}

module.exports = { runDashboardFeature };
