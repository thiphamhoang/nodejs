
function createCon(DBname,collection) {
    const mongoose = require('mongoose');
    mongoose.crm = mongoose.createConnection(process.env.SERVER_DB_PATH+'/'+DBname,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
                
    });

    const Schema = mongoose.Schema;
    const ModSchema = new Schema({
        name: {type:String, unique:true}, 
    },{
        timestamps: true
    });

    return mongoose.crm.model(collection, ModSchema);

}
    module.exports =  {createCon} ;