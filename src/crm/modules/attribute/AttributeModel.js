
function createCon(DBname,collection) {
    const mongoose = require('mongoose');
    const slug = require('mongoose-slug-generator');

    mongoose.crm = mongoose.createConnection(process.env.SERVER_DB_PATH+'/'+DBname,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
                
    });

    const Schema = mongoose.Schema;

    const optionSchema = new Schema({ 
        name: 'string',
        value: 'string',
       
     });

     
    const ModSchema = new Schema({
        name: {type:String, unique:true}, // mã hang
        option: [optionSchema],
        slug: {type: String, slug : 'name', unique: true},
    },{
        timestamps: true
    });

    mongoose.plugin(slug);

    return mongoose.crm.model(collection, ModSchema);

}
    module.exports =  {createCon} ;