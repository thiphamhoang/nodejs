const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const permiUtil =  require('../../../../util/permission');
const folder_module = 'dashboardCrm';
const module_name = 'Hệ thống quản trị';
const folder_view = 'modules/'+folder_module+'/views';
const errorUtil =  require('../../../../util/errorNoti');

class DashboardController {
   
    show(req, res, next){
        res.render(folder_view + '/show',{
            title: module_name,
            layout: 'mainCrm',
            folder_module: folder_module,
            module_name: module_name,
            username: req.username
        });

    }

}

module.exports = new DashboardController;