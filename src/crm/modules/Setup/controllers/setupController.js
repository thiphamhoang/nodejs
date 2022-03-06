const SetupRequireModel = require('../SetupModel');

const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'setup';
const module_name = 'Cài đặt';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const permiView = 'setup_crm_view';
const permiEdit = 'setup_crm_edit';
const layout = 'mainCrm';
const collection = 'Setup';


class SetupController {
    
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const SetupModel = SetupRequireModel.createCon(DBname,collection)
        Promise.all( [
            // catQuery,
            //chuc nang sortable(req) la goi tron model 
            SetupModel.findOne({name : "displayColGoods"}), 
            SetupModel.findOne({name : "displayColCustomer"}), 
            SetupModel.findOne({name : "displayColOrder"}), 
        ])
            .then(([displayColGoodsVal,displayColCustomerVal,displayColOrderVal]) => res.render(folder_view + '/show',{
                title: module_name,
                displayColGoodsVal: mongooseToObject(displayColGoodsVal),
                displayColCustomerVal: mongooseToObject(displayColCustomerVal),
                displayColOrderVal: mongooseToObject(displayColOrderVal),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username
            }))
            .catch(next);

    }
  

    //put/ cat
    update(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const SetupModel = SetupRequireModel.createCon(DBname,collection)

        for (var setupName in req.body.setup) {
            SetupModel.findOneAndUpdate(
                { name: setupName},
                { 
                    "$set": {
                        "valueArray": req.body.setup[setupName]
                    }
                },
                function(error) {
                    if (error) {
                        errorUtil.messageFlash(error,req.session); 
                            res.redirect('back'); return;
                    }
                }
            );
        }
        res.redirect('back'); return;
            
    }

    updateAjax(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const SetupModel = SetupRequireModel.createCon(DBname,collection)

        for (var setupName in req.body.setup) {
            SetupModel.findOneAndUpdate(
                { name: setupName},
                { 
                    "$set": {
                        "valueArray": req.body.setup[setupName]
                    }
                },
                function(error) {
                    if (error) {
                            res.redirect('back'); return;
                    }
                }
            );
        }
        res.send('Lưu thành công');return '';
            
    }

}

module.exports = new SetupController;