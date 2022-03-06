const StaffRequireModel = require('../StaffModel');
const StaffGroupRequireModel = require('../../staffGroup/StaffGroupModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const folder_module = 'staff';
const module_name = 'Nhân viên';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'staff_crm_view';
const permiEdit = 'staff_crm_edit';
const layout = 'mainCrm';
const collection = 'Staff';
const errorUtil =  require('../../../../util/errorNoti');
const bcrypt = require('bcrypt');

class Controller {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffModel = StaffRequireModel.createCon(DBname,collection)
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,'staffGroup')
        Promise.all( [
            StaffModel.find({}).populate({path: 'groupId', model: StaffGroupModel})
        ])
            .then(([StaffList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(StaffList),
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
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,'staffGroup')

        Promise.all( [
            StaffGroupModel.find({})
        ])
            .then(([StaffGroupList]) => res.render(folder_view + '/create',{
                staffGroupList: multipleMongooseToObject(StaffGroupList),
                title: module_name,
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
                DBname,
            }))
            .catch(next);

    }

    store(req,res,next){ 
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffModel = StaffRequireModel.createCon(DBname,collection)
        if(typeof req.body.password !== 'undefined'){
            req.body.password = bcrypt.hashSync(req.body.password, 8)
        } 
        if(req.body.groupId == process.env.ID_CUSTOMER_GROUP){
            req.body.slug = req.body.username;
        }

        const  formData = req.body;
        
        const Staff = new StaffModel(formData);
        Staff.save() 
            .then((Staff) => { 
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
        const StaffModel = StaffRequireModel.createCon(DBname,collection)
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,'staffGroup')
        Promise.all( [
            StaffModel.findById(req.params.id), 
            StaffGroupModel.find({}), 
        ])
            .then(([Staff,StaffGroupList]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                item: mongooseToObject(Staff),
                staffGroupList: multipleMongooseToObject(StaffGroupList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                crm_path,
                module_path,
                DBname
            }))
            .catch(next);
    }

    //put/ cat
    update(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const StaffModel = StaffRequireModel.createCon(DBname,collection)

        StaffModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
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
        const StaffModel = StaffRequireModel.createCon(DBname,collection)
        
        StaffModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect('back');return;
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