const express = require('express');
const router = express.Router();
const Controller = require('./controllers/StaffGroupController');

router.get('/', Controller.show);
router.get('/create', Controller.create);
router.post('/store', Controller.store);
router.get('/:id/edit', Controller.edit);
router.put('/:id', Controller.update);
// set quyen group 
router.get('/:id/editRole', Controller.editRole);
router.put('/:id/editRole', Controller.updateRole);

//xoa vinh vien
router.delete('/:id/force', Controller.forceDestroy);

module.exports = router;