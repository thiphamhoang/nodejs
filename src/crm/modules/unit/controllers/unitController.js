const UnitRequireModel = require('../UnitModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'unit';
const module_name = 'Đơn vị';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'unit_crm_view';
const permiEdit = 'unit_crm_edit';
const layout = 'mainCrm';
const collection = 'Unit';

class UnitController {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const UnitModel = UnitRequireModel.createCon(DBname,collection)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            UnitModel.find({}), 
        ])
            .then(([UnitList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(UnitList),
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
        const UnitModel = UnitRequireModel.createCon(DBname,collection)

        Promise.all( [
            UnitModel.find({}), 
        ])
            .then(([UnitList]) => res.render(folder_view + '/create',{
                title: module_name,
                itemList: multipleMongooseToObject(UnitList),
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
        const UnitModel = UnitRequireModel.createCon(DBname,collection)
        
        const Unit = new UnitModel(req.body);
        // res.json(req.body);return;

        Unit.save() 
            .then((Unit) => { 
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
        const UnitModel = UnitRequireModel.createCon(DBname,collection)

        Promise.all( [
            UnitModel.findById(req.params.id), 
        ])
            .then(([Unit]) => res.render(folder_view + '/edit',{
                title: module_name,
                item: mongooseToObject(Unit),
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
        const UnitModel = UnitRequireModel.createCon(DBname,collection)

        UnitModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
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
        const UnitModel = UnitRequireModel.createCon(DBname,collection)
        
        UnitModel.deleteOne({_id: req.params.id}).then().catch(next)
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

module.exports = new UnitController;