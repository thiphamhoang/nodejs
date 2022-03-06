const express = require('express');
const router = express.Router();
const Controller = require('./controllers/setupController');

router.get('/', Controller.show);
router.put('/', Controller.update);
router.put('/ajax', Controller.updateAjax);

module.exports = router;