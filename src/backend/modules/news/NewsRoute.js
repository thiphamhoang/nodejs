const express = require('express');
const router = express.Router();
const newsController = require('./controllers/NewsController');
// upload anh 
const multer  = require('multer');
//create folder
const fs = require('fs-extra')

// upload 1 anh 
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // xoa anh cu 
        if(req.body.oldImage != ''){
            if(req.body.deleteImage == 'on'){
                try {
                    fs.unlinkSync(`src/public/img/user/${req.userId}/news/${req.params.id}/${req.body.oldImage}`);
                    console.log('successfully deleted ');
                } catch (err) {
                    // handle the error
                console.log(err);;
                }
            }
        }

        let path = `src/public/img/user/${req.userId}/news/${req.params.id}`;
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

// upload nhieu anh 
let storageMulti = multer.diskStorage({
    destination: function (req, file, cb) {
        // xoa anh cu 
        let path = `src/public/img/user/${req.userId}/news/${req.params.id}`;
        fs.mkdirsSync(path);
        cb(null, path)
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let name_imgMulti = file.fieldname + '-' + Date.now()+ '.' +extension;
        cb(null, name_imgMulti);
    }

})
  
var uploadMulti = multer({ storage: storageMulti });

router.get('/', newsController.show);
// router.get('/create', newsController.create);
router.get('/trash', newsController.trash);
router.post('/store',upload.single('img'), newsController.store);
router.get('/:id/edit', newsController.edit);
router.post('/handle-form-action', newsController.handleFormActions);
router.put('/:id',upload.single('img'), newsController.update);
// router.post('/:id/uploadImages',upload.array('multi-files'), newsController.uploadImages);
router.post('/:id/uploadImages',uploadMulti.array('multi-files'),  (req, res, next) => {
    const files = req.files
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
    }
    //tao array hinh anh 
    const img_name = [];
    for (const [key, file_value] of Object.entries(files)) { 
        path_image = file_value.path;
        path_image = path_image.replace("src/public", "");
        img_name.push(`<img src="${path_image}">`);
    }
    res.send(img_name);
});


router.patch('/:id/restore', newsController.restore);

// xoa vinh vien 
router.delete('/allDestroyTrash', newsController.allDestroyTrash);
// xoa vao thung rac 
router.delete('/:id', newsController.destroy);
//xoa vinh vien
router.delete('/:id/force', newsController.forceDestroy);

// router.get('/:slug', newsController.show);

module.exports = router;