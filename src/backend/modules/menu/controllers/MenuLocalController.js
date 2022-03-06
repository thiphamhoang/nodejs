const MenuModel = require('../MenuModel');
const MenuLocalModel = require('../MenuLocalModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const permiUtil =  require('../../../../util/permission');

const folder_module = 'menu';
const function_name = 'local';
const function_sub_name = 'menuList';
const module_name = 'Vị trí trình đơn';
const folder_view = 'modules/'+folder_module+'/views/'+function_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+function_name;
const module_path = admin_path+'/'+folder_module;

class MenuLocalController {
    show(req, res,next){
        permiUtil.auth(req.userId,'menu_view',res)
        Promise.all( [
            // menuQuery,
            //chuc nang sortable(req) la goi tron model 
            MenuModel.find({menuLocalId:req.params.idLocal}).populate('menuLocalId').sort('order'), 
            MenuLocalModel.find({}).sortable(req), 
            MenuLocalModel.findById(req.params.idLocal), 
        ])
            .then(([menuList, menuLocalList,menuLocal]) => res.render(folder_view + '/show',{
                title: module_name,
                menuList: multipleMongooseToObject(menuList),
                menuLocalList: multipleMongooseToObject(menuLocalList),
                menuLocal: mongooseToObject(menuLocal),
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
        permiUtil.auth(req.userId,'menu_edit',res)
        MenuModel.find({})
        .then(menuList => {
            res.render(folder_view + '/create', {
                title: 'Thêm '+ module_name,
                layout: 'mainBackend',
                host: req.headers.host,
                folder_module: folder_module,
                module_name: module_name,
                menuList: multipleMongooseToObject(menuList),
                username: req.username,
                admin_path,
                module_function_path,
                module_path
            })
        })
    }
    // tao vi tri menu 
    store(req,res,next){
        permiUtil.auth(req.userId,'menu_edit',res)
        const  formData = req.body;
        const menuLocal  = new MenuLocalModel(formData);
        menuLocal.save() 
            .then((menuLocal) => { 
                var linkRedirect = '/admin/'+folder_module+'/local/'+ menuLocal._id+'/menuList';
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }
 
    //get /  edit
    edit(req,res,next){
        permiUtil.auth(req.userId,'menu_edit',res)
        Promise.all( [
            MenuLocalModel.findById(req.params.id)
        ])
            .then(([MenuLocal]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                MenuLocal: mongooseToObject(MenuLocal),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path
            }))
            .catch(next);
    }

    //put/ 
    update(req,res,next){
        permiUtil.auth(req.userId,'menu_edit',res)
        MenuLocalModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then((menuLocal) => {
                var linkRedirect = '/admin/'+folder_module+'/local/'+ req.params.id+'/menuList';
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){ 
        permiUtil.auth(req.userId,'menu_edit',res)
        // xoa menu 
        MenuModel.remove({menuLocalId: req.params.id}) .then() .catch(next)
         // xoa vi tri menu 
        MenuLocalModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect('/admin/menu')
    }
}

module.exports = new MenuLocalController;