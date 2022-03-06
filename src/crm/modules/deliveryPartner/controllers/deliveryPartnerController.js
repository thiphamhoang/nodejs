const DeliveryPartnerRequireModel = require('../deliveryPartnerModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'deliveryPartner';
const module_name = 'Đối tác giao hàng';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'deliveryPartner_crm_view';
const permiEdit = 'deliveryPartner_crm_edit';
const layout = 'mainCrm';
const collection = 'DeliveryPartner';

class Controller {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const DeliveryPartnerModel = DeliveryPartnerRequireModel.createCon(DBname,collection)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            DeliveryPartnerModel.find({}), 
        ])
            .then(([DeliveryPartnerList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(DeliveryPartnerList),
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
        const DeliveryPartnerModel = DeliveryPartnerRequireModel.createCon(DBname,collection)

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
        const DeliveryPartnerModel = DeliveryPartnerRequireModel.createCon(DBname,collection)
        
        const DeliveryPartner = new DeliveryPartnerModel(req.body);
        DeliveryPartner.save() 
            .then((DeliveryPartner) => { 
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
        const DeliveryPartnerModel = DeliveryPartnerRequireModel.createCon(DBname,collection)

        Promise.all( [
            DeliveryPartnerModel.findById(req.params.id), 
        ])
            .then(([DeliveryPartner]) => res.render(folder_view + '/edit',{
                title: module_name,
                item: mongooseToObject(DeliveryPartner),
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
        const DeliveryPartnerModel = DeliveryPartnerRequireModel.createCon(DBname,collection)

        DeliveryPartnerModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
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
        const DeliveryPartnerModel = DeliveryPartnerRequireModel.createCon(DBname,collection)
        
        DeliveryPartnerModel.deleteOne({_id: req.params.id}).then().catch(next)
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