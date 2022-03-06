const CatModel = require('../CatModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const folder_module = 'cat';
const module_name = 'Danh Mục';
const folder_view = 'modules/'+folder_module+'/views';
const admin_path =  process.env.ADMIN_PATH;
const module_path = admin_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');

class CatController {
    show(req, res,next){
        permiUtil.auth(req.userId,'cat_view',res)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            CatModel.find({}).sortable(req), 
            CatModel.countDocumentsDeleted()
        ])
            .then(([catList, deleteCount]) => res.render(folder_view + '/show',{
                deleteCount,
                title: module_name,
                catList: multipleMongooseToObject(catList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                admin_path,
                module_path,
                username: req.username
            }))
            .catch(next);

    }
    //get / cat/ create
    create(req,res,next){
        permiUtil.auth(req.userId,'cat_edit',res)
        CatModel.find({})
        .then(catList => {
            res.render(folder_view + '/create', {
                title: 'Thêm '+ module_name,
                layout: 'mainBackend',
                host: req.headers.host,
                folder_module: folder_module,
                module_name: module_name,
                catList: multipleMongooseToObject(catList),
                username: req.username,
                admin_path,
                module_path,
            })
        })
    }

    store(req,res,next){ 
        permiUtil.auth(req.userId,'cat_edit',res)
        const  formData = req.body;
        const cat  = new CatModel(formData);
        cat.save() 
            .then((cat) => { 
                if(req.body.save == 'saveAndNew') {
                    var linkRedirect = module_path +'/create';
                }
                else if(req.body.save == 'saveAndReview'){
                    var linkRedirect = module_path+'/'+ cat._id + '/edit';
                }else{
                    var linkRedirect = module_path;
                }
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }
 
    //get / cat/ edit
    edit(req,res,next){
        permiUtil.auth(req.userId,'cat_edit',res)
        Promise.all( [
            CatModel.find({}), 
            CatModel.findById(req.params.id)
        ])
            .then(([catList, cat]) => res.render(folder_view + '/edit',{
                title: module_name,
                catList: multipleMongooseToObject(catList),
                cat: mongooseToObject(cat),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_path,
            }))
            .catch(next);
    }

    //put/ cat
    update(req,res,next){
        permiUtil.auth(req.userId,'cat_edit',res)
        CatModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then((cat) => {
                if(req.body.save == 'saveAndNew') {
                    var linkRedirect = module_path+'/create';
                }
                else if(req.body.save == 'saveAndReview'){
                    var linkRedirect = module_path+'/'+req.params.id + '/edit';
                }else{
                    var linkRedirect = module_path;
                }
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,'cat_edit',res)
        deleteUtil.deleteCat(req.params.id)
        res.redirect('back')
    }


    //post action 
    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,'cat_edit',res)
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

module.exports = new CatController;