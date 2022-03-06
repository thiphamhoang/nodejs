
function createCon(DBname,collection) {
    const mongoose = require('mongoose');
    mongoose.crm = mongoose.createConnection(process.env.SERVER_DB_PATH+'/'+DBname,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
                
    });

    const Schema = mongoose.Schema;
    const ModSchema = new Schema({
        groupId:  {
          type: mongoose.Schema.Types.ObjectId,
          required: [true,'GroupID không được trống']
        },
        roleId:  {
          type: mongoose.Schema.Types.ObjectId,
          required: [true,'RoleID không được trống']
        },
    },{
        timestamps: true
    });

    return mongoose.crm.model(collection, ModSchema);

}
    module.exports =  {createCon} ;