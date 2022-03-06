const userModel = require('../UserModel');
const roleModel = require('../RoleModel');
const errorUtil =  require('../../../../util/errorNoti');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const dotenv = require('dotenv');
const permiUtil =  require('../../../../util/permission');
dotenv.config();

const folder_module = 'user';
const function_name = 'role';
const module_name = 'Phân quyền';
const folder_view = 'modules/'+folder_module+'/views/'+function_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+function_name;
const module_path = admin_path+'/'+folder_module;

class RoleController {
    showRole(req, res,next){
        permiUtil.auth(req.userId,'permi_view',res)
        Promise.all( [
            // userQuery,
            //chuc nang sortable(req) la goi tron model 
            roleModel.find({}).sortable(req), 
        ])
            .then(([roleList]) => res.render(folder_view + '/show',{
                title: module_name,
                roleList: multipleMongooseToObject(roleList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                module_path,
                module_function_path,
                username: req.username,
                admin_path
            }))
            .catch(next);

    }
    //get /  create
    createRole(req,res,next){ 
        permiUtil.auth(req.userId,'permi_edit',res)
        res.render(folder_view + '/create', {
            title: 'Thêm '+ module_name,
            layout: 'mainBackend',
            host: req.headers.host,
            folder_module: folder_module,
            module_name: module_name,
            module_path,
            module_function_path,
            username: req.username,
            admin_path
        })
    }
    // tao vi tri user 
    storeRole(req,res,next){
        const  formData = req.body;
        const role  = new roleModel(formData);
        role.save() 
            .then((role) => { 
                var linkRedirect = module_function_path+'/create';
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }
 
    //get /  edit
    editRole(req,res,next){
        permiUtil.auth(req.userId,'permi_edit',res)
        Promise.all( [
            roleModel.findById(req.params.id)
        ])
            .then(([role]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                role: mongooseToObject(role),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                module_path,
                module_function_path,
                username: req.username,
                admin_path
            }))
            .catch(next);
    }

    //put/ 
    updateRole(req,res){
        permiUtil.auth(req.userId,'permi_edit',res)
        roleModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then((role) => {
                var linkRedirect = '/admin/'+folder_module+'/role';
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroyRole(req,res,next){ 
        permiUtil.auth(req.userId,'permi_edit',res)
        // xoa user cua quyen nay
        // userModel.remove({roles: req.params.id}) .then() .catch(next)
         // xoa role  user 
        roleModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect('/admin/user/Role')
    }
}

module.exports = new RoleController;