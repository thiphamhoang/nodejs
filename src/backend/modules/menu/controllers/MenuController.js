const MenuModel = require('../MenuModel');
const MenuLocalModel = require('../MenuLocalModel');
const CatModel = require('../../cat/CatModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const orderUtil =  require('../../../../util/orderRecursive');
const deleteUtil =  require('../../../../util/deleteRecursive');
const errorUtil =  require('../../../../util/errorNoti');
const permiUtil =  require('../../../../util/permission');

const folder_module = 'menu';
const function_name = 'local';
const function_sub_name = 'menuList';
const module_name = 'Trình đơn';
const folder_view = 'modules/'+folder_module+'/views/'+function_sub_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+function_name;
const module_path = admin_path+'/'+folder_module;


class MenuController {
   
    // them menu 
    create(req,res,next){ 
        permiUtil.auth(req.userId,'menu_edit',res)
        Promise.all( [
            // menuQuery,
            //chuc nang sortable(req) la goi tron model 
            CatModel.find({}) , 
            MenuLocalModel.findById(req.params.idLocal), 
            MenuModel.find({}), 
        ])
            .then(([catList,menuLocal,menuList]) => res.render(folder_view + '/create',{
                
                title: 'Thêm '+ module_name +'- vị trí '+ menuLocal.name,
                catList: multipleMongooseToObject(catList),
                menuList: multipleMongooseToObject(menuList),
                menuLocal: mongooseToObject(menuLocal),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                module_function_path,
                module_path,
                admin_path,
                function_sub_name
            }))
        .catch(next);

    }
   
    // tao  menu 
    store(req,res,next){
        permiUtil.auth(req.userId,'menu_edit',res)
        const  formData = req.body;
        //  sap xep thu tu 
        
        const menu  = new MenuModel(formData)
        menu.save() 
            .then((menu) => {
                // update cha 
                if(req.body.parentId != 0){
                    MenuModel.updateOne({_id: req.body.parentId}, {
                        childId: menu._id, 
                    }, function(err) {
                       console.log(err);
                    })
                }

                var linkRedirect = '/admin/'+folder_module+'/local/'+ req.params.idLocal+'/menuList';
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
            MenuModel.findById(req.params.idMenu),
            CatModel.find({}) , 
            MenuLocalModel.findById(req.params.idLocal), 
            MenuModel.find({}), 
        ])
            .then(([menu,catList,menuLocal,menuList]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                menu: mongooseToObject(menu),
                catList: multipleMongooseToObject(catList),
                menuList: multipleMongooseToObject(menuList),
                menuLocal: mongooseToObject(menuLocal),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                module_function_path,
                module_path,
                admin_path,
                function_sub_name
            }))
            .catch(next);
    }

    //put/ 
    update(req,res,next){
        permiUtil.auth(req.userId,'menu_edit',res)
        MenuModel.updateOne({_id: req.params.idMenu}, req.body, {runValidators: true})
            .then((menu) => {
                var linkRedirect = '/admin/'+folder_module+'/local/'+ req.params.idLocal+'/menuList';
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
        deleteUtil.deleteMenu(req.params.idMenu)
        res.redirect('back')
    }


    // sap xep menu 
    order(req,res,next){
        permiUtil.auth(req.userId,'menu_edit',res)
        const  formData = req.body;
        //  sap xep thu tu 
        orderUtil.orderRecursive(req.body.list)
      
    }

}

module.exports = new MenuController;