const rowModel = require('../../backend/modules/theme/RowModel');
const themeModel = require('../../backend/modules/theme/ThemeModel');

const  {multipleMongooseToObject} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { render } = require('node-sass');
dotenv.config();

const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(uri);


class Controller {  
    //get /news
    index(req, res,next){
        // client.connect((err) => {
        //     if (!err) {
        //         console.log('connection created');
        //     }
        //     const newDB = client.db("YourNewDatabases");
        //     newDB.createCollection("YourCreatedCollectionNames"); // This line i s important. Unless you create collection you can not see your database in mongodb .
        // })

        Promise.all( [
            // userQuery,
            //chuc nang sortable(req) la goi tron model 
            rowModel.find({themeId: req.params.idTheme}).populate('themeId').sort('order'), 
        ])
            .then(([rowList]) => res.render('home',{
                title: 'Trang chu',
                rowList: multipleMongooseToObject(rowList),
                layout: 'main',
               
            }))
            .catch(next);

    }
    cat(req, res,next){

        Promise.all( [
            // userQuery,
            //chuc nang sortable(req) la goi tron model 
            rowModel.find({themeId: req.params.idTheme}).populate('themeId').sort('order'), 
        ])
            .then(([rowList]) => res.render('home',{
                title: 'Trang chu',
                rowList: multipleMongooseToObject(rowList),
                layout: 'main',
               
            }))
            .catch(next);

    }
  
}

module.exports = new Controller;