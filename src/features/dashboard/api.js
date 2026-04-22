const express = require('express');
const { fetchHistoriesForDashboard } = require('../../db/historyRepository');

function createDashboardApiRouter(config) {
  const router = express.Router();

  router.get('/histories', async (req, res) => {
    try {
      const rows = await fetchHistoriesForDashboard(config);
      res.json(rows);
    } catch (error) {
      console.error('MySQL query error:', error);
      res.status(500).json({ error: 'Failed to fetch histories from database' });
    }
  });

  return router;
}

module.exports = { createDashboardApiRouter };
