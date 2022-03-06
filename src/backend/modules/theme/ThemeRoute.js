const express = require('express');
const router = express.Router();
const themeController = require('./controllers/ThemeController');
const rowController = require('./controllers/RowController');
const feildController = require('./controllers/FeildController');

// upload anh 
const multer  = require('multer');
//create folder
const fs = require('fs-extra')

// upload nhieu anh 
let storageMulti = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `src/public/img/user/${req.userId}/theme/${req.params.idTheme}/${req.params.idRow}/${req.params.idFeild}`;
        fs.mkdirsSync(path);
        cb(null, path)
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let name_imgMulti = file.fieldname + '-' + Date.now()+ '.' +extension;
        cb(null, name_imgMulti);


        console.log(name_imgMulti)
        if(req.body.img == '' || req.body.img == null){
            req.body.img = [];
        }
       
        req.body.img.push(name_imgMulti);
    }
})
var uploadMulti = multer({ storage: storageMulti });

router.get('/', themeController.show);
// theme
router.get('/theme', themeController.show);
router.get('/theme/create', themeController.create);
router.post('/theme/store', themeController.store);
router.get('/theme/:id/edit', themeController.edit);
router.put('/theme/:id', themeController.update);
router.delete('/theme/:id/force', themeController.forceDestroy);

// row
router.get('/theme/:idTheme/row', rowController.show);
router.get('/theme/:idTheme/row/create', rowController.create);
router.post('/theme/:idTheme/row/store', rowController.store);
router.get('/theme/:idTheme/row/:idRow/edit', rowController.edit);
router.put('/theme/:idTheme/row/:idRow', rowController.update);
//update truong
router.get('/theme/:idTheme/row/:idRow/feild', rowController.editFeild);
router.put('/theme/:idTheme/row/:idRow/feild', rowController.updateFeild);
// xoa  array('feild[multi][value]')
router.delete('/theme/:idTheme/row/:idRow/force', rowController.forceDestroy);


//feild
router.get('/theme/:idTheme/row/:idRow/feild/create', feildController.create);
router.post('/theme/:idTheme/row/:idRow/feild/store', feildController.store);
// sua feild 
router.get('/theme/:idTheme/row/:idRow/feild/:idFeild/edit', feildController.edit);
router.put('/theme/:idTheme/row/:idRow/feild/:idFeild', feildController.update);
// xoa 
router.delete('/theme/:idTheme/row/:idRow/feild/:idFeild/force',  feildController.forceDestroy);
// xoa 1 gia tri anh trong feild 
router.delete('/theme/:idTheme/row/:idRow/feild/:idFeild/:imgName/force',  feildController.forceImageDestroy);
// upaload 
router.post('/theme/:idTheme/row/:idRow/feild/:idFeild/uploadImage',uploadMulti.array('multiFiles'), feildController.uploadImages);
module.exports = router;