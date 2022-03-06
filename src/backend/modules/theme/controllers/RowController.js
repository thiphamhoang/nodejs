const rowModel = require('../RowModel');
const themeModel = require('../ThemeModel');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const permiUtil =  require('../../../../util/permission');
const folder_module = 'theme';
const function_sub_name = 'row';
const function_sub_sub_name = 'feild';
const module_name = 'Hàng block';
const folder_view = 'modules/'+folder_module+'/views/'+function_sub_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+ folder_module;
const module_path = admin_path+'/'+folder_module;
const fs = require('fs-extra')

class RowController {
    show(req, res,next){
        permiUtil.auth(req.userId,'theme_view',res)
        Promise.all( [
            // userQuery,
            //chuc nang sortable(req) la goi tron model 
            rowModel.find({themeId: req.params.idTheme}).populate('themeId').sort('order'), 
        ])
            .then(([rowList]) => res.render(folder_view + '/show',{
                title: module_name,
                rowList: multipleMongooseToObject(rowList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                idTheme: req.params.idTheme,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
                function_sub_name
            }))
            .catch(next);

    }
    // them 
    create(req,res,next){ 
        permiUtil.auth(req.userId,'theme_edit',res)
        Promise.all( [
            themeModel.find({}),
        ])
            .then(([themeList]) => res.render(folder_view + '/create',{
                title: 'Thêm '+ module_name,
                themeList: multipleMongooseToObject(themeList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
                function_sub_name,
                idTheme: req.params.idTheme
            }))
        .catch(next);
    }
   
    // tao 
    store(req,res,next){
        permiUtil.auth(req.userId,'theme_edit',res)
        const row  = new rowModel(req.body)
        row.save() 
            .then((row) => {
                // update cha 
                var linkRedirect = module_function_path+'/'+req.body.themeId+'/'+function_sub_name;
                res.redirect(linkRedirect)
            })
            .catch(error => {
                // console.log(error)
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }

     //get /  edit
     edit(req,res,next){
        permiUtil.auth(req.userId,'theme_edit',res)
        Promise.all( [
            rowModel.findById(req.params.idRow),
        ])
            .then(([row]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
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
                idTheme: req.params.idTheme
            }))
            .catch(next);
    }

    //put/ 
    update(req,res,next){
        permiUtil.auth(req.userId,'theme_edit',res)
        rowModel.updateOne({_id: req.params.idRow}, req.body,{runValidators: true} )
            .then((row) => {
                var linkRedirect = module_function_path+'/'+req.body.themeId+'/'+function_sub_name;
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        // res.send('fds');return;
        permiUtil.auth(req.userId,'theme_edit',res)
        rowModel.deleteOne({_id: req.params.idRow}).then().catch(next)
        // xoa anh 
        var dir =  `src/public/img/theme/${req.params.idTheme}/${req.params.idRow}/`;
        if (fs.existsSync(dir)) {
            try {
                fs.rmdir(dir, { recursive: true });
            
                console.log(`${dir} is deleted!`);
            } catch (err) {
                console.error(`Error while deleting ${dir}.`);
            }
        }

        var linkRedirect = module_function_path+'/'+req.params.idTheme+'/'+function_sub_name;
        res.redirect(linkRedirect)
    }

    editFeild(req,res,next) { 
        permiUtil.auth(req.userId,'theme_edit',res)
        Promise.all( [
            rowModel.findById(req.params.idRow),
            rowModel.find({themeId: req.params.idTheme}).populate('themeId').sort('order'), 
        ])
            .then(([row,rowList]) => res.render(folder_view + '/show',{
                title: 'Sửa '+module_name,
                rowList: multipleMongooseToObject(rowList),
                row: mongooseToObject(row),
                idTheme: req.params.idTheme,
                idRow: req.params.idRow,
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
                function_sub_name,
                function_sub_sub_name
            }))
            .catch(next);
    }
    

    updateFeild(req,res,nexts) {
        permiUtil.auth(req.userId,'theme_edit',res)
        // res.json(req.body);  return;
        // var feildForm = req.body;
       
                if(Object.entries(req.body.feild).length === 0 ){
                    res.redirect('back'); return;
                }
                // foreach tat value nhan duoc 
                for (const [key, val] of Object.entries(req.body.feild)) {  
              
                    rowModel.findOneAndUpdate(
                        { _id: req.params.idRow, "feild._id": val.id},
                        { 
                            "$set": {
                                "feild.$.value": val.value
                            }
                        },
                        function(error) {
                            if (error) {
                                errorUtil.messageFlash(error,req.session); 
                                    res.redirect('back'); return;
                            }
                        }
                    );
                    
               }
            res.redirect(module_function_path+'/'+req.params.idTheme+'/'+function_sub_name+'/'+req.params.idRow+'/'+function_sub_sub_name ); 
            return;

          
    }

}

module.exports = new RowController;