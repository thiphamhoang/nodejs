const AttributeRequireModel = require('../AttributeModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const folder_module = 'attribute';
const module_name = 'Thuộc tính';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'attribute_crm_view';
const permiEdit = 'attribute_crm_edit';
const layout = 'mainCrm';
const collection = 'Attribute';
const errorUtil =  require('../../../../util/errorNoti');

class AttributeController {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const AttributeModel = AttributeRequireModel.createCon(DBname,collection)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            AttributeModel.find({}), 
        ])
            .then(([AttributeList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(AttributeList),
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
        const AttributeModel = AttributeRequireModel.createCon(DBname,collection)

        Promise.all( [
            AttributeModel.find({}), 
        ])
            .then(([attributeList]) => res.render(folder_view + '/create',{
                title: module_name,
                itemList: multipleMongooseToObject(attributeList),
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
        const AttributeModel = AttributeRequireModel.createCon(DBname,collection)
        
        const Attribute = new AttributeModel(req.body);
        // res.json(req.body);return;

        Attribute.save() 
            .then((Attribute) => { 
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
        const AttributeModel = AttributeRequireModel.createCon(DBname,collection)

        Promise.all( [
            AttributeModel.findById(req.params.id), 
        ])
            .then(([Attribute]) => res.render(folder_view + '/edit',{
                title: module_name,
                item: mongooseToObject(Attribute),
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
        const AttributeModel = AttributeRequireModel.createCon(DBname,collection)

        AttributeModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
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
        const AttributeModel = AttributeRequireModel.createCon(DBname,collection)
        
        AttributeModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect('back');return;
    }


    //post action 
    selectOption(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const AttributeModel = AttributeRequireModel.createCon(DBname,collection)
    
        AttributeModel.findById(req.params.id)
            .then((attr) =>{
                var option = []
                for (const [key,val] of Object.entries(attr.option) ){
                    option += `<option value="${val.value}">${val.value}</option>`;
                }
                res.send(option);
                return;
            })
            .catch(error => {
                res.send(error); 
            })
    }


}

module.exports = new AttributeController;