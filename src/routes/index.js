
const authRouter = require('../fontend/authRouter');
const fontendRouter = require('../fontend/fontendRouter');
const { authJwt } = require("../app/middlewares/");
const fs = require('fs-extra')
const path = require('path');
const dotenv = require('dotenv');
const db = require('../config/db');
dotenv.config();

// mac dinh  process.env.MODULES_PATH = /backend/modules
const modulesBackendFolder = path.join(__dirname,'..'+process.env.MODULES_PATH);
const modulesCrmFolder = path.join(__dirname,'..'+process.env.MODULES_CRM_PATH);

function route(app){
    
    app.use(function(req, res, next) {
        // db.connect(req,res)

        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // bacekend
    // foreach tat cac thu muc module 
    fs.readdirSync(modulesBackendFolder).map(fileName => {
        app.use(`${process.env.ADMIN_PATH}/${fileName}`, [authJwt.isAdmin, authJwt.verifyToken], require(`..${process.env.MODULES_PATH}/${fileName}/${fileName}Route`));
    })
    //crm
    fs.readdirSync(modulesCrmFolder).map(fileName => {
        app.use(`${process.env.CRM_PATH}/${fileName}`, [authJwt.isCustomer,authJwt.verifyToken], require(`..${process.env.MODULES_CRM_PATH}/${fileName}/${fileName}Route`));
    })
    //crm

  
    app.use(`${process.env.AUTH_PATH}`, authRouter);
    app.use(`/`, fontendRouter);

}
module.exports = route;