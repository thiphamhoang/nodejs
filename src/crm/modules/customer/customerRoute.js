const express = require('express');
const router = express.Router();
const Controller = require('./controllers/customerController');
// upload anh 
const multer  = require('multer');
//create folder
const fs = require('fs-extra')

// upload 1 anh 
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // xoa anh cu 
        let path = `src/public/img/user/${req.userId}/customer`;
        fs.mkdirsSync(path);
        cb(null, path)
    },
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      let name_img = file.fieldname + '-' + Date.now()+ '.' +extension;
      cb(null, name_img);
      req.body.img = name_img;
    }
})
  
var upload = multer({ storage: storage });



router.get('/', Controller.show);
router.get('/searchAjax', Controller.searchAjax);
// them hang hoa 
router.get('/create', Controller.create);
router.post('/store',upload.single('img'), Controller.store);
router.get('/:id/edit', Controller.edit);
router.put('/:id/update',upload.single('img'), Controller.update);

//xoa vinh vien
router.delete('/:id/force', Controller.forceDestroy);
router.post('/handle-form-action', Controller.handleFormActions);
module.exports = router;