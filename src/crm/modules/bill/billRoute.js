const express = require('express');
const router = express.Router();
const Controller = require('./controllers/BillController');


router.get('/', Controller.show);
router.get('/searchAjax', Controller.searchAjax);
router.post('/:orderId/store', Controller.store); //new
router.get('/:id/edit', Controller.edit);
router.put('/:id/update', Controller.update);

//xoa vinh vien
router.delete('/:id/force', Controller.forceDestroy);
router.post('/handle-form-action', Controller.handleFormActions);
module.exports = router;