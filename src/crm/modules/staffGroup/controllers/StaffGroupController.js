const StaffGroupRequireModel = require('../StaffGroupModel');
const StaffGroupRoleRequireModel = require('../StaffGroupRoleModel');
const RoleModel = require('../../../../backend/modules/user/RoleModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const folder_module = 'staffGroup';
const module_name = 'Nhóm nhân sự';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'staff_crm_view';
const permiEdit = 'staff_crm_edit';
const layout = 'mainCrm';
const collection = 'StaffGroup';
const errorUtil =  require('../../../../util/errorNoti');

class Controller {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            StaffGroupModel.find({}), 
        ])
            .then(([StaffGroupList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(StaffGroupList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username
            }))
            .catch(next);

    }
    //get / cat/ create
    create(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)

        Promise.all( [
           
        ])
            .then(() => res.render(folder_view + '/create',{
                title: module_name,
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username
            }))
            .catch(next);

    }

    store(req,res,next){ 
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)
        
        
        const StaffGroup = new StaffGroupModel(req.body);
        StaffGroup.save() 
            .then((StaffGroup) => { 
                res.redirect(module_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }
 
    //get / cat/ edit
    edit(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)

        Promise.all( [
            StaffGroupModel.findById(req.params.id), 
        ])
            .then(([StaffGroup]) => res.render(folder_view + '/edit',{
                title: module_name,
                item: mongooseToObject(StaffGroup),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                crm_path,
                module_path,
            }))
            .catch(next);
    }

    //put/ cat
    update(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)

        StaffGroupModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then(() => {
                res.redirect( module_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)
        
        StaffGroupModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect('back');return;
    }

    editRole(req,res,next){ 
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)
        const StaffGroupRoleModel = StaffGroupRoleRequireModel.createCon(DBname,'StaffGroupRole')
        
        Promise.all( [
            StaffGroupModel.findById(req.params.id),
            RoleModel.find({type:'customer'}),
            StaffGroupRoleModel.find({groupId:req.params.id}),
        ])
            .then(([staffGroup,roleList,staffGroupRoleList]) => res.render(folder_view + '/editRole',{
                title: 'Sửa quyền '+ module_name,
                staffGroup: mongooseToObject(staffGroup),
                roleList: multipleMongooseToObject(roleList),
                staffGroupRoleList: multipleMongooseToObject(staffGroupRoleList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                module_path,
                crm_path
            }))
            .catch(next);
    }

    //put/ 
    updateRole(req,res,next){ 
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,collection)
        const StaffGroupRoleModel = StaffGroupRoleRequireModel.createCon(DBname,'StaffGroupRole')
        // xoa role cu 
        //id = id cua group 
        StaffGroupRoleModel.remove({groupId: req.params.id}) .then() .catch(next)
       

        for (const [key, roleId] of Object.entries(req.body.roles)) {  
            const groupRole  = new StaffGroupRoleModel({groupId: req.params.id, roleId: roleId})
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

    //post action 
    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        switch(req.body.action){
            case 'delete':
                CatModel.delete({_id: {$in: req.body.ids} })
                    .then(() => res.redirect('back'))
                    .catch(next)

                break;
            default:
                res.json({message: 'Hành động không hợp lệ'})
        }
    }


}

module.exports = new Controller;