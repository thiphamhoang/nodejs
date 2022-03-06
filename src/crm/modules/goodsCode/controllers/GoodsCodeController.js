const GoodsCodeRequireModel = require('../GoodsCodeModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'goodsCode';
const module_name = 'Mã hàng hóa';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'goodsCode_crm_view';
const permiEdit = 'goodsCode_crm_edit';
const layout = 'mainCrm';
const collection = 'GoodsCode';

class GoodsCodeController {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const GoodsCodeModel = GoodsCodeRequireModel.createCon(DBname,collection)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            GoodsCodeModel.find({}), 
        ])
            .then(([GoodsCodeList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(GoodsCodeList),
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
        const GoodsCodeModel = GoodsCodeRequireModel.createCon(DBname,collection)

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
        const GoodsCodeModel = GoodsCodeRequireModel.createCon(DBname,collection)
        
        const GoodsCode = new GoodsCodeModel(req.body);
        GoodsCode.save() 
            .then((GoodsCode) => { 
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
        const GoodsCodeModel = GoodsCodeRequireModel.createCon(DBname,collection)

        Promise.all( [
            GoodsCodeModel.findById(req.params.id), 
        ])
            .then(([GoodsCode]) => res.render(folder_view + '/edit',{
                title: module_name,
                item: mongooseToObject(GoodsCode),
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
        const GoodsCodeModel = GoodsCodeRequireModel.createCon(DBname,collection)

        GoodsCodeModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
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
        const GoodsCodeModel = GoodsCodeRequireModel.createCon(DBname,collection)
        
        GoodsCodeModel.deleteOne({_id: req.params.id}).then().catch(next)
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

module.exports = new GoodsCodeController;