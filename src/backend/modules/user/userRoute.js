const express = require('express');
const router = express.Router();
const roleController = require('./controllers/roleController');
const userController = require('./controllers/userController');
const groupController = require('./controllers/groupController');

router.get('/', userController.show);
router.get('/searchUserAjax', userController.searchUserAjax);
router.get('/acc', userController.show);
// quyen group 
router.get('/role', roleController.showRole);
router.get('/role/create', roleController.createRole);
router.post('/role/store', roleController.storeRole);
router.get('/role/:id/edit', roleController.editRole);
router.put('/role/:id', roleController.updateRole);
router.delete('/role/:id/force', roleController.forceDestroyRole);

router.get('/group', groupController.show);
router.get('/group/create', groupController.create);
router.post('/group/store', groupController.store);
router.get('/group/:parentId/getListAjax', groupController.getListAjax);
router.get('/group/:id/edit', groupController.edit);
router.put('/group/:id', groupController.update);
router.delete('/group/:id/force', groupController.forceDestroy);
// set quyen group 
router.get('/group/:id/editRole', groupController.editRole);
router.put('/group/:id/editRole', groupController.updateRole);

// get tao user 
router.get('/acc/create', userController.create);
router.post('/acc/store', userController.store);
router.get('/acc/:id/edit', userController.edit);
router.put('/acc/:id', userController.update);
// xoa 
router.delete('/acc/:id/force', userController.forceDestroy);
router.post('/handle-form-action', userController.handleFormActions);


module.exports = router;