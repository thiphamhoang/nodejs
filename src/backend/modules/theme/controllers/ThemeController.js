const RowModel = require('../RowModel');
const ThemeModel = require('../ThemeModel');
const errorUtil =  require('../../../../util/errorNoti');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');

const folder_module = 'theme';
const function_name = 'theme';
const function_sub_name = 'row';
const module_name = 'Giao diện';
const folder_view = 'modules/'+folder_module+'/views/'+function_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+function_name;
const module_path = admin_path+'/'+folder_module;

class ThemeController {
    show(req, res,next){
        Promise.all( [
            // userQuery,
            //chuc nang sortable(req) la goi tron model 
            ThemeModel.find({}).sortable(req),
        ])
            .then(([themeList]) => res.render(folder_view + '/show',{
                title: module_name,
                themeList: multipleMongooseToObject(themeList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
                function_sub_name
            }))
            .catch(next);

    }
    //get /  create
    create(req,res,next){ 
        res.render(folder_view + '/create', {
            title: 'Thêm '+ module_name,
            layout: 'mainBackend',
            host: req.headers.host,
            folder_module: folder_module,
            module_name: module_name,
            username: req.username,
            admin_path,
            module_function_path,
            module_path
        })
    }
    // tao vi tri row 
    store(req,res,next){
        const  formData = req.body;
        const theme  = new ThemeModel(formData);
        theme.save() 
            .then((theme) => { 
                res.redirect(module_function)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }
 
    //get /  edit
    edit(req,res,next){
        Promise.all( [
            ThemeModel.findById(req.params.id)
        ])
            .then(([theme]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                theme: mongooseToObject(theme),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
                function_sub_name
            }))
            .catch(next);
    }

    //put/ 
    update(req,res){
        ThemeModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then((theme) => {
                res.redirect(module_function)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){ 
        // xoa row cua quyen nay
        // RowModel.remove({roles: req.params.id}) .then() .catch(next)
         // xoa theme  row 
        ThemeModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect(module_path)
    }
}

module.exports = new ThemeController;