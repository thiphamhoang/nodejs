const TokenModel = require('../../backend/modules/user/TokenModel');
const UserModel = require('../../backend/modules/user/UserModel');
const RoleModel = require('../../backend/modules/user/RoleModel');
const GroupModel = require('../../backend/modules/user/GroupModel');
// nhom con 
const StaffGroupRequireModel = require('../../crm/modules/staffGroup/StaffGroupModel');
const StaffRequireModel = require('../../crm/modules/staff/StaffModel');

const  {multipleMongooseToObject} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// const axios = require('axios');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
dotenv.config();
const errorUtil =  require('../../util/errorNoti');


class AuthController {  
    getRegis(req,res){
        res.render('regis');
    }
    postRegis(req,res){
        const user = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
          });
        
        user.save((err, user) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            req.body.roles  = ["user"];

            // chon loai user 
            if (req.body.roles) {
                RoleModel.find(
                    {
                    name: { $in: req.body.roles }
                    },
                    (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
            
                    user.roles = roles.map(role => role._id);

                    user.save(err => {
                        if (err) {
                        res.status(500).send({ message: err });
                        return;
                        }
            
                        res.send({ message: "User was registered successfully!" });
                    });
                    }
                );
            } else {
                RoleModel.findOne({ name: "user" }, (err, role) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
        
                user.roles = [role._id];
                    user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
        
                    res.send({ message: "User was registered successfully!" });
                });
              });
            }
          });
    }
    getLogin(req,res){
        var slug = req.params.slug;
        if(slug){
            var urlLogin = '/auth/'+slug;
        }else{
            var urlLogin = '/auth/webux/login';
        }
        res.render('login', {
            layout: false,
            urlLogin
        });
    }
    
    postLogin(req,res){
        const DBname = req.params.slug;
        const StaffModel = StaffRequireModel.createCon(DBname,'Staff')
        const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,'StaffGroup')

        // tìm kim tra tai khoan cu user 
        StaffModel.findOne({username: req.body.username}).populate({path:'groupId', model:StaffGroupModel})
        .exec((err, user) => {
        
            // neu to tai user o khach hang 
            if(user){
                 // neu user trong thi kiem tra tai khoang con
                 if(!user){ req.session.sessionFlash = { message: 'Sai mật khẩu hoặc tài khoản'};  res.redirect('back');return; }
                 // console.log(user);
                 req.userSlug = user.slug;
                 //username khi nguoi dung log
                 const username = req.body.username;
                 //neu co user thi  tao jwt 
                 const accessToken = jwt.sign({id: user._id,username:user.username,slug:user.slug,type: user.type }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24H',})
                 // tao cookie luu o cline 
                 res.cookie('token', 'Bearer ' +accessToken,{ maxAge: 60000*60*24,  secure: true,httpOnly: true,});
                 // xac thuc password 
                 var passwordIsValid = bcrypt.compareSync(req.body.password,  user.password);
                 if (!passwordIsValid) { return res.status(401).send({ accessToken: null, message: "Invalid Password!" }); }
                 // tao token 
                 const refreshToken = jwt.sign({ id: user._id,username:user.username,slug:user.slug,type:user.type }, process.env.REFRESH_TOKEN_SECRET)  
                 // tao cookie luu o cline 
                 res.cookie('refreshToken', refreshToken,{ maxAge: 60000*60*24*7, });
                 //luu tru refreshTOken
                     // kiem tra xem refresh da được lưu trữ hay chua 
                     var query = {"username": username},
                     update = { "refreshToken": refreshToken},
                     options = { upsert: true, new: true, setDefaultsOnInsert: true };
                     // Find the document
                     TokenModel.findOneAndUpdate(query, update, options, function(error, result) { if (error) return 'Loi lu refresh Token';  });
                     
                    res.redirect(process.env.LOGIN_REDIRECT_CRM_PATH);return;
            }
            //neu khong ton tai o database khach hang, login database admin
            else{
                    UserModel.findOne({"username": req.body.username}).populate("groupId")
                    .exec((err, user) => {
                        // neu user trong thi kiem tra tai khoang con
                        if(!user){ req.session.sessionFlash = { message: 'Sai mật khẩu hoặc tài khoản'};  res.redirect('back');return; }
                        // console.log(user);
                        req.userSlug = user.slug;
                        //username khi nguoi dung log
                        const username = req.body.username;
                        //neu co user thi  tao jwt 
                        const accessToken = jwt.sign({id: user._id,username:user.username,slug:user.slug }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24H',})
                        // tao cookie luu o cline 
                        res.cookie('token', 'Bearer ' +accessToken,{ maxAge: 60000*60*24,  secure: true,httpOnly: true,});
                        // xac thuc password 
                        var passwordIsValid = bcrypt.compareSync(req.body.password,  user.password);
                        if (!passwordIsValid) { return res.status(401).send({ accessToken: null, message: "Invalid Password!" }); }
                        // tao token 
                        const refreshToken = jwt.sign({ id: user._id,username:user.username,slug:user.slug }, process.env.REFRESH_TOKEN_SECRET)  
                        // tao cookie luu o cline 
                        res.cookie('refreshToken', refreshToken,{ maxAge: 60000*60*24*7, });
                        //luu tru refreshTOken
                            // kiem tra xem refresh da được lưu trữ hay chua 
                            var query = {"username": username},
                            update = { "refreshToken": refreshToken},
                            options = { upsert: true, new: true, setDefaultsOnInsert: true };
                            // Find the document
                            TokenModel.findOneAndUpdate(query, update, options, function(error, result) { if (error) return 'Loi lu refresh Token';  });
                            // console.log(user);
                            if(user.groupId.type == 'admin'){
                                var link_redirect = process.env.LOGIN_REDIRECT_PATH;
                            }else if(user.groupId.type == 'customer'){
                                var link_redirect = process.env.LOGIN_REDIRECT_CRM_PATH;
                            }else if(user.groupId.type == 'agency'){
                                res.send('Chưa cài đặt nhóm agency');return;
                            }
                    
                            res.redirect(link_redirect);return;
            
                    } )
            }

        });

        

    }
   
    Logout(req,res,next){
        if (typeof req.cookies.token !== 'undefined'){
            const tokenCookie = req.cookies.token;

            // dau && nghia la ngue co authHeader thi cat chuoi 
            const token = tokenCookie && tokenCookie.split(' ')[1];
            // xoa cookie 
            res.clearCookie('token');
            res.clearCookie('refreshToken');
            // xoa token
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // console.log(decode);

            TokenModel.deleteOne({username:decode.username}).then().catch(error => {
                console.log(error)
            })

            res.redirect(process.env.AUTH_PATH+'/'+process.env.URL_LOGIN)
        }else{
            res.redirect(process.env.AUTH_PATH+'/'+process.env.URL_LOGIN)
        }
    }
}

module.exports = new AuthController;