const express = require('express');
const router = express.Router();
const menuLocalController = require('./controllers/MenuLocalController');
const menuController = require('./controllers/MenuController');

router.get('/', menuLocalController.show);
// vi tri 
router.get('/local/create', menuLocalController.create);
router.post('/local/store', menuLocalController.store);
router.get('/local/:id/edit', menuLocalController.edit);
router.put('/local/:id', menuLocalController.update);
router.delete('/local/:id/force', menuLocalController.forceDestroy);

router.get('/local/:idLocal/menuList', menuLocalController.show);
// get tao menu 
router.get('/local/:idLocal/menuList/create', menuController.create);
router.post('/local/:idLocal/menuList/store', menuController.store);
router.get('/local/:idLocal/menuList/:idMenu/edit', menuController.edit);
router.put('/local/:idLocal/menuList/:idMenu', menuController.update);
// xoa 
router.delete('/local/:idLocal/menuList/:idMenu/force', menuController.forceDestroy);
//sap xep thu tu menu
router.post('/local/:idLocal/menuList/order', menuController.order);


module.exports = router;