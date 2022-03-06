const express = require('express');
const router = express.Router();
const catController = require('./controllers/CatController');

router.get('/', catController.show);
router.get('/create', catController.create);
router.post('/store', catController.store);
router.get('/:id/edit', catController.edit);
router.post('/handle-form-action', catController.handleFormActions);
router.put('/:id', catController.update);


//xoa vinh vien
router.delete('/:id/force', catController.forceDestroy);

module.exports = router;