const express = require('express');
const router = express.Router();
const Controller = require('./controllers/GoodsController');


// upload anh 
const multer  = require('multer');
//create folder
const fs = require('fs-extra')

// upload nhieu anh 
let storageMulti = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `src/public/img/user/${req.userId}/goods/`;
        fs.mkdirsSync(path);
        cb(null, path)
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let name_imgMulti = file.fieldname + '-' + Date.now()+ '.' +extension;
        cb(null, name_imgMulti);

        if(req.body.img == '' || req.body.img == null){
            req.body.img = [];
        }
       
        req.body.img.push(name_imgMulti);
    }
})
var uploadMulti = multer({ storage: storageMulti });


router.get('/', Controller.show);
router.get('/searchOrderAjax', Controller.searchOrderAjax);
router.get('/searchAjax', Controller.searchAjax);
router.get('/paginateAjax', Controller.paginateAjax );
// them hang hoa 
router.get('/create/:typeOfGoods', Controller.createGoods);
router.post('/store/:typeOfGoods',uploadMulti.array('multi-files'), Controller.storeGoods);
router.get('/:id/edit/:typeOfGoods', Controller.editGoods);
router.put('/:id/update/:typeOfGoods',uploadMulti.array('multi-files'), Controller.updateGoods);

//xoa anh  
router.get('/:id/deleteImg/:imgName', Controller.imageDestroy);
//xoa vinh vien
router.delete('/:id/force', Controller.forceDestroy);
router.post('/handle-form-action', Controller.handleFormActions);
module.exports = router;