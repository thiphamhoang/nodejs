const DistrictRequireModel = require('../DistrictModel');
const CityequireModel = require('../DistrictModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'district';
const module_name = 'Quận huyện';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'district_crm_view';
const permiEdit = 'district_crm_edit';
const layout = 'mainCrm';
const collection = 'District';

class Controller {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const DistrictModel = DistrictRequireModel.createCon(DBname,collection)
        const CityModel = DistrictRequireModel.createCon(DBname,'City')
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            DistrictModel.find({}).populate({path:'cityId',model: CityModel}), 
            CityModel.find({}), 
        ])
            .then(([DistrictList,CityList]) => res.render(folder_view + '/show',{
                title: module_name,
                itemList: multipleMongooseToObject(DistrictList),
                CityList: multipleMongooseToObject(CityList),
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
        const DistrictModel = DistrictRequireModel.createCon(DBname,collection)
        const CityModel = DistrictRequireModel.createCon(DBname,'City')

        Promise.all( [
           CityModel.find({}), 
        ])
            .then(([CityList]) => res.render(folder_view + '/create',{
                title: module_name,
                layout: layout,
                folder_module: folder_module,
                CityList: multipleMongooseToObject(CityList),
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
        const DistrictModel = DistrictRequireModel.createCon(DBname,collection)
        
        const District = new DistrictModel(req.body);
        District.save() 
            .then((District) => { 
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
        const DistrictModel = DistrictRequireModel.createCon(DBname,collection)
        const CityModel = DistrictRequireModel.createCon(DBname,'City')

        Promise.all( [
            DistrictModel.findById(req.params.id), 
            CityModel.find({})
        ])
            .then(([District,CityList]) => res.render(folder_view + '/edit',{
                title: module_name,
                item: mongooseToObject(District),
                CityList: multipleMongooseToObject(CityList),
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
        const DistrictModel = DistrictRequireModel.createCon(DBname,collection)

        DistrictModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then(() => {
                res.redirect( module_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }
     //get huyen
     getDictrict(req,res,next){
        const DBname  = req.slug;
        const DistrictModel = DistrictRequireModel.createCon(DBname,'District')
        DistrictModel.find({cityId : req.params.idCity})
            .then((district)=>{
                var option = []
                
                for (const [key,val] of Object.entries(district) ){
                    
                    option += `<option value="${val._id}">${val.name}</option>`;
                }
                res.send(option);
                return;

            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const DistrictModel = DistrictRequireModel.createCon(DBname,collection)
        
        DistrictModel.deleteOne({_id: req.params.id}).then().catch(next)
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