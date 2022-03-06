const express = require('express');
const router = express.Router();
const Controller = require('./controllers/OrderController');


router.get('/', Controller.show);
router.get('/searchAjax', Controller.searchAjax);
// them hang hoa 
router.get('/create', Controller.create);
router.get('/createTemporary', Controller.createTemporary);
router.get('/:id/deleteTemporary', Controller.deleteTemporary);
router.get('/:id/edit', Controller.edit);
router.put('/:id/update', Controller.update);

//xoa vinh vien
router.delete('/:id/force', Controller.forceDestroy);
router.post('/handle-form-action', Controller.handleFormActions);
module.exports = router;