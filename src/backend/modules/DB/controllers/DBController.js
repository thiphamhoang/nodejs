
const folder_module = 'DB';
const module_name = 'Cơ sở dữ liệu';
const folder_view = 'modules/'+folder_module+'/views';
const admin_path =  process.env.ADMIN_PATH;
const module_path = admin_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');

const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(uri);
mongoose = require("mongoose");

class DBController {
    show(req, res,next){
        permiUtil.auth(req.userId,'DB_view',res)
        const MongoClient = require("mongodb").MongoClient;

        const url = "mongodb://localhost:27017/";
        const client = new MongoClient(url, { useUnifiedTopology: true }); // useUnifiedTopology removes a warning

        // Connect
        client
        .connect()
        .then(client =>
            client
            .db()
            .admin()
            .listDatabases() // Returns a promise that will resolve to the list of databases
        )
        .then(dbs => {
            // console.log("Mongo databases", dbs);

            res.render(folder_view + '/show',{
                title: module_name,
                dbs: dbs,
                layout: 'mainBackend',
                folder_module: folder_module,
                module_name: module_name,
                admin_path,
                module_path,
                username: req.username
            })
        })
        .finally(() => client.close()); // Closing after getting the data
    }
    //get / cat/ create
    create(req,res,next){
        permiUtil.auth(req.userId,'DB_edit',res)
        res.render(folder_view + '/create', {
            title: 'Thêm '+ module_name,
            layout: 'mainBackend',
            host: req.headers.host,
            folder_module: folder_module,
            module_name: module_name,
            username: req.username,
            admin_path,
            module_path,
        })
    }

    store(req,res,next){ 
        permiUtil.auth(req.userId,'DB_edit',res)
          
        client.connect((err) => {
            if (!err) {
                console.log('connection created');
            }
            const newDB = client.db(req.body.name);
            newDB.createCollection("CatCrm"); // This line i s important. Unless you create collection you can not see your database in mongodb .
        })
        res.redirect(module_path);return;
    }
 
    //get / cat/ edit
    edit(req,res,next){
        permiUtil.auth(req.userId,'DB_edit',res)

        res.render(folder_view + '/edit', {
            title: 'Sửa '+ module_name,
            layout: 'mainBackend',
            host: req.headers.host,
            folder_module: folder_module,
            module_name: module_name,
            username: req.username,
            admin_path,
            module_path,
            name: req.params.name
        })

    }

    //put/ cat
    update(req,res,next){ 
        // permiUtil.auth(req.userId,'DB_edit',res)
        // // tao db mơi va copy qua 
        // client.connect((err) => {
        //     if (!err) {
        //         console.log('connection created');
        //     }
        //     const newDB = client.db(req.body.name);
        //     newDB.createCollection("catcrm"); // This line i s important. Unless you create collection you can not see your database in mongodb .
            
        //     // client.db.copyDatabase(req.body.oldName,req.body.name)
        //     // client.db.dropDatabase(req.body.oldName);
        // })
        // res.redirect(module_path);return;
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        // //JavaScript
        // var con = mongoose.connect('mongodb://localhost/2121');
        // mongoose.connection.on('open', function(){
        //     con.connection.db.dropDatabase(function(err, result){
        //         done();
        //     });
        // });
    }



}

module.exports = new DBController;