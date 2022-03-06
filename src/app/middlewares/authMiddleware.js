
const jwt = require('jsonwebtoken');
const TokenModel = require('../../backend/modules/user/TokenModel');
const UserModel = require('../../backend/modules/user/UserModel');
const GroupModel = require('../../backend/modules/user/GroupModel');

// nhom con 
const StaffGroupRequireModel = require('../../crm/modules/staffGroup/StaffGroupModel');
const StaffRequireModel = require('../../crm/modules/staff/StaffModel');

const verifyToken = (req,res,next) => {
   
    if (typeof req.cookies.token == 'undefined'){
        //Không có refresToken
        // res.send({ message: `Bạn chưa đăng nhập` });
        res.render('login', {layout: false});
        return;
    }
    const tokenCookie = req.cookies.token;
    // dau && nghia la ngue co authHeader thi cat chuoi 
    const token = tokenCookie && tokenCookie.split(' ')[1];
    // neu ko co token retunr loi 401

    //kiem tra refreshtoken, neu to tao token moi
    if(!token){
        const refreshToken = req.cookies.refreshToken;
        // neu refreshtoken trong
        if(!refreshToken) {
            // res.send({ message: "Khong co refresToken" });  return;
            res.render('login', {layout: false});
            return;
        }
       
        // tao moi token
        const refreshTokenExists = TokenModel.exists({"refreshToken": refreshToken });
      
        
        if (!refreshTokenExists) {
            // res.send("Token khong ton tai");
           res.send({ message: "Unauthorized!" });  return ;
        }
        // xac minh refreshtoken 
        else{
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,data) =>{
                if(err) { res.send({ message: "Unauthorized!" });  return ; }
                // tao token moi 
                const accessToken = jwt.sign({id: data.id,username:data.username,slug:user.slug,type:user.type}, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '24H',
                })  
                // tao cookie token moi 
                res.cookie('token', 'Bearer ' +accessToken,{
                    maxAge:  60000*60*24,   
                    secure: true,
                    httpOnly: true,
                });
                req.userId = data.id;
                req.username = data.username;
                req.slug = data.slug;
                req.type = data.type;
                next();
            }) 
        
        }
       
    }

    // kiem tra token hien tai 
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decode);
        req.userId = decode.id;
        req.username = decode.username;
        req.slug = decode.slug;
        req.type = decode.type;
        next();

    }catch (error){
        // console.log(error)
        res.sendStatus(403); return;
    }
}


const isAdmin = (req, res, next) => {
    if (typeof req.cookies.token == 'undefined'){
        //Không có refresToken
        // res.send({ message: `Bạn chưa đăng nhập` });
        res.render('login', {layout: false});
        return;
    }
    const tokenCookie = req.cookies.token;
    // dau && nghia la ngue co authHeader thi cat chuoi 
    const token = tokenCookie && tokenCookie.split(' ')[1];
    // neu ko co token retunr loi 401
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decode);
    userId = decode.id;
    
    UserModel.findById(userId).populate('groupId').exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }  
        //get nhom groupROle
        // console.log(user.groupId.type)
        if (user.groupId.type === "admin") {
            next();
            return;
        }
    });
   
};

const isCustomer = (req, res, next) => {
    if (typeof req.cookies.token == 'undefined'){
        //Không có refresToken
        // res.send({ message: `Bạn chưa đăng nhập` });
        res.render('login', {layout: false});
        return;
    }
    const tokenCookie = req.cookies.token;
    // dau && nghia la ngue co authHeader thi cat chuoi 
    const token = tokenCookie && tokenCookie.split(' ')[1];
    // neu ko co token retunr loi 401
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decode);
    userId = decode.id;
    const DBname = decode.slug;
    const StaffModel = StaffRequireModel.createCon(DBname,'Staff')
    const StaffGroupModel = StaffGroupRequireModel.createCon(DBname,'StaffGroup')
    // neu tai khoan thuoc nhom con 

    if(decode.type  == 'subCustomer'){
        StaffModel.findById(userId).exec((err, user) => {
            if (err) { res.send('Bạn không có quyền ở Middleware');   }  
            next();  return;
        });

    }
    //la tai khoan goc
    else{

        UserModel.findById(userId).populate('groupId').exec((err, user) => {
            if (err) { res.send('Bạn không có quyền ở Middleware');   } 

            if(user.groupId.type === "customer") { 
                    next();  return;
            }else{
                console.log(error); res.send('Bạn không có quyền ở Middleware'); 
            }
        });
    }
};



const authJwt = {
    verifyToken,
    isAdmin,
    isCustomer
  };
module.exports = authJwt;