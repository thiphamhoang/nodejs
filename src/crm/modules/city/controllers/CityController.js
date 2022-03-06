const CityRequireModel = require('../CityModel');
const DistrictRequireModel = require('../CityModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const folder_module = 'city';
const module_name = 'Tỉnh - thành phố';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'city_crm_view';
const permiEdit = 'city_crm_edit';
const layout = 'mainCrm';
const collection = 'City';

class Controller {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const CityModel = CityRequireModel.createCon(DBname,collection)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            CityModel.find({}), 
        ])
            .then(([CityList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(CityList),
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
        const CityModel = CityRequireModel.createCon(DBname,collection)

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
        const CityModel = CityRequireModel.createCon(DBname,collection)
        
        const City = new CityModel(req.body);
        City.save() 
            .then((City) => { 
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
        const CityModel = CityRequireModel.createCon(DBname,collection)

        Promise.all( [
            CityModel.findById(req.params.id), 
        ])
            .then(([City]) => res.render(folder_view + '/edit',{
                title: module_name,
                item: mongooseToObject(City),
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
        const CityModel = CityRequireModel.createCon(DBname,collection)

        CityModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
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
        const CityModel = CityRequireModel.createCon(DBname,collection)
        
        CityModel.deleteOne({_id: req.params.id}).then().catch(next)
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