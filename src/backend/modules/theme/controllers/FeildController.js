const rowModel = require('../RowModel');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const permiUtil =  require('../../../../util/permission');
const folder_module = 'theme';
const function_sub_name = 'row';
const function_sub_sub_name = 'feild';
const module_name = 'Hàng block';
const folder_view = 'modules/'+folder_module+'/views/'+function_sub_sub_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+ folder_module;
const module_path = admin_path+'/'+folder_module;
const fs = require('fs-extra')


class FeildController {
    // get
    create(req,res,next){ 
        permiUtil.auth(req.userId,'theme_view',res)
        Promise.all( [
            rowModel.find({themeId: req.params.idTheme}).populate('themeId').sort('order'), 
        ])
            .then(([rowList]) => res.render(folder_view + '/create',{
                title: 'Thêm '+ module_name,
                rowList: multipleMongooseToObject(rowList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
                function_sub_name,
                function_sub_sub_name,
                idTheme: req.params.idTheme,
                idRow: req.params.idRow
            }))
        .catch(next);
    }
   
    // post tao 
    store(req,res,next){

        // res.json(req.body)
        rowModel.findOneAndUpdate(
        { _id: req.params.idRow}, 
        { $push: { feild: req.body.feild  } },
        function (error, success) {
            if (error) {
                errorUtil.messageFlash(error,req.session);
                    res.redirect('back'); 
            } else {
             
                res.redirect(module_function_path+'/'+req.params.idTheme+'/'+function_sub_name+'/'+req.params.idRow+'/'+function_sub_sub_name ); 
            }
        });
  
    }

     //get /  edit
     edit(req,res,next){
        Promise.all( [
            rowModel.findById(req.params.idRow),
        ])
            .then(([row]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                feild: mongooseToObject(row.feild.id(req.params.idFeild)),
                row: mongooseToObject(row),
                idTheme: req.params.idTheme,
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                idTheme: req.params.idTheme,
                admin_path,
                module_function_path,
                module_path,
                function_sub_name,
                function_sub_sub_name,
                idTheme: req.params.idTheme,
                idRow: req.params.idRow,
                idFeild: req.params.feild
            }))
            .catch(next);
    }

    //put/ 
    update(req,res,next){
        // ,{runValidators: true}
        // console.log(req.body);
        // return;
        rowModel.findOneAndUpdate(
            { _id: req.params.idRow, "feild._id": req.params.idFeild},
            { 
                "$set": {
                    "feild.$": req.body.feild
                }
            },
            function(error) {
                if (error) {
                    errorUtil.messageFlash(error,req.session);
                        res.redirect('back'); 
                } else {
                 
                    res.redirect(module_function_path+'/'+req.params.idTheme+'/'+function_sub_name+'/'+req.params.idRow+'/'+function_sub_sub_name ); 
                }
            }
        );

    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        // res.send('fds');
        rowModel.findOneAndUpdate(
            { _id: req.params.idRow, "feild._id": req.params.idFeild},
            { $pull: { feild: { _id: req.params.idFeild} } },
            { new: true },
            function(error) {
                if (error) {
                    errorUtil.messageFlash(error,req.session);
                        res.redirect('back'); 
                } else {
                    // xoa anh 
                    var dir =  `src/public/img/theme/${req.params.idTheme}/${req.params.idRow}/${req.params.idFeild}/`;
                    if (fs.existsSync(dir)) {
                        try {
                            fs.rmdir(dir, { recursive: true });
                        
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    }
                    res.redirect(module_function_path+'/'+req.params.idTheme+'/'+function_sub_name+'/'+req.params.idRow+'/'+function_sub_sub_name ); 
                }
            }
        );
    }

    uploadImages(req,res,next){
        permiUtil.auth(req.userId,'theme_edit',res)
        rowModel.findById(req.params.idRow)
            .then((row) => {
                // res.json(row.feild.id(req.body.feildId).value);return;
                // foreach cac anh 
                for (const imgName of req.body.img) { 
                    row.feild.id(req.body.feildId).value.push(imgName);
                }
                row.save(function (error) {
                    if (error) {
                        errorUtil.messageFlash(error,req.session);
                            res.redirect('back'); 
                    } else {
                     
                        res.redirect(module_function_path+'/'+req.params.idTheme+'/'+function_sub_name+'/'+req.params.idRow+'/'+function_sub_sub_name ); 
                    }
                })
                // res.json(row.feild.id(req.params.idFeild).value[0]);return;

            })


    }

    //xoa vinh vien  1anh trong feild
    forceImageDestroy(req,res,next){
   
        // res.json(req.params.imgName);return;
        
        // res.json(dir);return;

        rowModel.findById(req.params.idRow)
            .then((row) => {
                row.feild.id(req.params.idFeild).value.remove(req.params.imgName);
                // xoa anh 
                var dir =  `src/public/img/theme/${req.params.idTheme}/${req.params.idRow}/${req.params.idFeild}/`;
                if (fs.existsSync(dir)) {
                    try {
                        fs.unlinkSync(dir+'/'+req.params.imgName);
                        console.log(`${dir} is deleted!`);
                    } catch (err) {
                        console.error(`Error while deleting ${dir}.`);
                    }
                }

                row.save(function (error) {
                    if (error) {
                        errorUtil.messageFlash(error,req.session);
                            res.redirect('back'); 
                    } else {
                     
                        res.redirect(module_function_path+'/'+req.params.idTheme+'/'+function_sub_name+'/'+req.params.idRow+'/'+function_sub_sub_name ); 
                    }
                })
                // res.json(row.feild.id(req.params.idFeild).value[0]);return;

            })
    }

   

}

module.exports = new FeildController;