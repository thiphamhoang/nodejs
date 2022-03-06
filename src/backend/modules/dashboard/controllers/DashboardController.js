const MenuLocalModel = require('../../menu/MenuLocalModel');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const permiUtil =  require('../../../../util/permission');
const folder_module = 'dashboard';
const module_name = 'Hệ thống quản trị';
const folder_view = 'modules/'+folder_module+'/views';

class DashboardController {
   
    show(req, res, next){
        permiUtil.auth(req.userId,'dashboard_view',res)

        Promise.all( [
            MenuLocalModel.find({}).sortable(req), 
        ])
            .then(([ menuLocalList]) => res.render(folder_view + '/show',{
                title: module_name,
                menuLocalList: multipleMongooseToObject(menuLocalList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username
            }))
            .catch(next);

    }

}

module.exports = new DashboardController;