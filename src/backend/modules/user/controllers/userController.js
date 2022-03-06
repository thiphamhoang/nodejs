const UserModel = require('../UserModel');
const GroupModel = require('../GroupModel');
const bcrypt = require('bcrypt');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const permiUtil =  require('../../../../util/permission');
const dotenv = require('dotenv');
dotenv.config();

const folder_module = 'user';
const function_name = 'acc';
const module_name = 'Tài khoản';
const folder_view = 'modules/'+folder_module+'/views/'+function_name;
const admin_path =  process.env.ADMIN_PATH;
const module_function_path = admin_path+'/'+folder_module+'/'+function_name;
const module_path = admin_path+'/'+folder_module;

const mongodb = require('mongodb');
const uri = process.env.SERVER_DB_PATH;
const client = new mongodb.MongoClient(uri);
mongoose = require("mongoose");

class UserController {
    // tim user khach hang 
    searchUserAjax(req,res,next){
        const filter = {};
        if(req.query.feild){
            if(req.query.feild == 'name'){
                filter.username = { $regex: '.*' + req.query.key + '.*' } ;
            }else if(req.query.feild == 'email'){
                filter.email = { $regex: '.*' + req.query.key + '.*' };
            }else if(req.query.feild == 'phone_1'){
                filter.phone_1 = { $regex: '.*' + req.query.key + '.*' };
            }
        }
    
        //loai
        if(req.query.groupId){
            filter.groupId = req.query.groupId;
        }

        UserModel.find(filter)
            .then((user)=>{
                var li = []
                for (const [key,val] of Object.entries(user) ){
                    if(val.phone_1){
                        var phone_1 = ' | '+val.phone_1;
                    }else{
                        var phone_1 = '';
                    }
                    
                    li += `<li class="liSearch" onclick="selectResult('${val._id}','${val.username}','${val.tel}','${val.slug}','${val.groupId}')" style="cursor:pointer">${val.username}${phone_1} </li>`;
                }
                res.send(li);
                return;
            })
            .catch(next);
    }
    // hien danh sach 
    show(req, res,next){
        permiUtil.auth(req.userId,'user_view',res)
        const filter = {};
    
        
        Promise.all( [
            // userQuery,
            //chuc nang sortable(req) la goi tron model 
            UserModel.find(filter).populate('groupId').sort('order'), 
            GroupModel.find({}), 
        ])
            .then(([userList,groupList]) => res.render(folder_view + '/show',{
                title: module_name,
                userList: multipleMongooseToObject(userList),
                groupList: multipleMongooseToObject(groupList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                filter_roles: req.query['roles'],
                admin_path,
                module_function_path,
                module_path,
            }))
            .catch(next);

    }
    // them user 
    create(req,res,next){ 
        permiUtil.auth(req.userId,'user_edit',res)
       
        Promise.all( [
            GroupModel.find({}),
        ])
            .then(([groupList]) => res.render(folder_view + '/create',{
                title: 'Thêm '+ module_name,
                groupList: multipleMongooseToObject(groupList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
            }))
        .catch(next);
    }
   
    // tao  user 
    store(req,res,next){
        // res.json(req.body);return;

        permiUtil.auth(req.userId,'user_edit',res)
        if(typeof req.body.password !== 'undefined'){
            req.body.password = bcrypt.hashSync(req.body.password, 8)
        } 
        if(req.body.groupId == process.env.ID_CUSTOMER_GROUP){
            req.body.slug = req.body.username;
        }

        const  formData = req.body;
        const user  = new UserModel(formData)
        user.save() 
            .then(() => {
                // tao co so du lieu 
                if(req.body.groupId == process.env.ID_CUSTOMER_GROUP){
                    var data = req.body.slug;
                    if(data){
                        client.connect((err) => {
                            if (!err) {
                                console.log('connection created');
                            }
                            const newDB = client.db(data);
                            newDB.createCollection("goods");
                        })
                    }
                }
                res.redirect(module_function_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
        ;
    }

     //get /  edit
     edit(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)

        Promise.all( [
            UserModel.findById(req.params.id),
            GroupModel.find({}), 
        ])
            .then(([user,groupList]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                user: mongooseToObject(user),
                groupList: multipleMongooseToObject(groupList),
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                username: req.username,
                admin_path,
                module_function_path,
                module_path,
            }))
            .catch(next);
    }

    //put/ 
    update(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)
        if(typeof req.body.password !== 'undefined'){
            req.body.password = bcrypt.hashSync(req.body.password, 8)
        } 
        UserModel.updateOne({_id: req.params.id}, req.body,{runValidators: true} )
            .then(() => {
                res.redirect(module_function_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)
        UserModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.redirect(module_function_path)
    }


    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,'user_edit',res)
        switch(req.body.action){
            case 'delete':
                UserModel.delete({_id: {$in: req.body.ids} })
                    .then(() => res.redirect('back'))
                    .catch(next)

                break;
            default:
                res.json({message: 'Hành động không hợp lệ'})
        }
    }
}

module.exports = new UserController;