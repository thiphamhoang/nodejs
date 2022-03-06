const express = require('express');
const router = express.Router();
const Controller = require('./controllers/attributeController');

router.get('/', Controller.show);
router.get('/create', Controller.create);
router.post('/store', Controller.store);
router.get('/:id/edit', Controller.edit);
router.put('/:id', Controller.update);
//xoa vinh vien
router.delete('/:id/force', Controller.forceDestroy);
// get select option cua attribute 
router.get('/:id/selectOption', Controller.selectOption);


module.exports = router;