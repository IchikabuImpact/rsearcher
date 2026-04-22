const express = require('express');
const path = require('path');
const { createDashboardApiRouter } = require('./api');

function createDashboardServer({ config, publicDir = path.join(process.cwd(), 'public') }) {
  const app = express();
  app.use(express.static(publicDir));
  app.use('/api', createDashboardApiRouter(config));
  return app;
}

module.exports = { createDashboardServer };
