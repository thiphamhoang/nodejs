const userModel = require('../userModel');
const groupModel = require('../GroupModel');
const roleModel = require('../RoleModel');
const groupRoleModel = require('../GroupRoleModel');
const bcrypt = require('bcrypt');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const permiUtil =  require('../../../../util/permission');
const dotenv = require('dotenv');
dotenv.config();

const folder_module = 'user';
const function_name = 'group';
const module_name = 'Nhóm tài khoản';
const folder_view = 'modules/'+folder_module+'/views/'+function_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+function_name;
const module_path = admin_path+'/'+folder_module;


class GroupController {
    getListAjax(req, res,next){
        groupModel.find({parentId: req.params.parentId})
            .then((group)=>{
                var div = []
                for (const [key,val] of Object.entries(group)){
                    div += val.name+'<br>';
                }
                res.send(div);
                return;
            })
            .catch(next);
    }
    show(req, res,next){
        permiUtil.auth(req.userId,'user_view',res)
        const filter = {};
        Promise.all( [
            groupModel.find(filter),
        ])
            .then(([ groupList]) => res.render(folder_view + '/show',{
                title: module_name,
                groupList: multipleMongooseToObject(groupList),
                layout: 'mainBackend',
                folder_module,
                module_name,
                module_path,
                module_function_path,
                username: req.username,
                admin_path
            }))
            .catch(next);

    }
    // them user 
    create(req,res,next){ 
        permiUtil.auth(req.userId,'user_edit',res)
        Promise.all( [
            groupModel.find({parentId:0}),
        ])
            .then(([groupList]) => res.render(folder_view + '/create',{
                title: 'Thêm '+ module_name,
                groupList: multipleMongooseToObject(groupList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                module_path,
                module_function_path,
                admin_path
            }))
        .catch(next);
    }
   
    // tao   
    store(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)
        const group  = new groupModel(req.body)
        group.save() 
            .then(() => {
                res.redirect(module_function_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }

     //get /  edit
     edit(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)
        Promise.all( [
            groupModel.findById(req.params.id),
            groupModel.find({parentId:0}),
        ])
            .then(([group,groupList]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                group: mongooseToObject(group),
                groupList: multipleMongooseToObject(groupList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                module_path,
                module_function_path,
                admin_path
            }))
            .catch(next);
    }

    //put/ 
    update(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)
        groupModel.updateOne({_id: req.params.id}, req.body,{runValidators: true} )
            .then(() => {
                res.redirect(module_function_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)
        groupModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect(module_function_path)
    }

   
    editRole(req,res,next){ 
        permiUtil.auth(req.userId,'user_edit',res)
        Promise.all( [
            groupModel.findById(req.params.id),
            roleModel.find({type:'admin'}),
            roleModel.find({type:'customer'}),
            roleModel.find({type:'agency'}),
            groupRoleModel.find({groupId:req.params.id})
        ])
            .then(([group,roleAdminList,roleCustomerList,roleAgencyList,groupRoleList]) => res.render(folder_view + '/editRole',{
                title: 'Sửa quyền '+ module_name,
                group: mongooseToObject(group),
                roleAdminList: multipleMongooseToObject(roleAdminList),
                roleCustomerList: multipleMongooseToObject(roleCustomerList),
                roleAgencyList: multipleMongooseToObject(roleAgencyList),
                groupRoleList: multipleMongooseToObject(groupRoleList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                module_path,
                module_function_path,
                admin_path
            }))
            .catch(next);
    }

    //put/ 
    updateRole(req,res,next){ 
        permiUtil.auth(req.userId,'user_edit',res)
        // xoa role cu 
        //id = id cua group 
        groupRoleModel.remove({groupId: req.params.id}) .then() .catch(next)

        for (const [key, roleId] of Object.entries(req.body.roles)) {  
            const groupRole  = new groupRoleModel({groupId: req.params.id, roleId: roleId})
                 groupRole.save() 
                    .then(() => {
                        res.redirect(module_function_path)
                    })
                    .catch(error => {
                        // errorUtil.messageFlash(error,req.session);
                  
                    })
                ;
        }
        res.redirect('back'); 
    }
}

module.exports = new GroupController;