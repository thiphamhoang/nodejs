const express = require('express');
const router = express.Router();
const DBController = require('./controllers/DBController');

router.get('/', DBController.show);
router.get('/create', DBController.create);
router.post('/store', DBController.store);
router.get('/:name/edit', DBController.edit);
router.put('/:name', DBController.update);

//xoa vinh vien
router.delete('/:name/force', DBController.forceDestroy);

module.exports = router;