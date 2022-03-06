const express = require('express');
const router = express.Router();
const dashboardController = require('./controllers/DashboardCrmController');

router.get('/', dashboardController.show);

module.exports = router;