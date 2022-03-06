
function createCon(DBname,collection) {
    const mongoose = require('mongoose');
    mongoose.crm = mongoose.createConnection(process.env.SERVER_DB_PATH+'/'+DBname,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
                
    });

    const Schema = mongoose.Schema;
    const ModSchema = new Schema({
        username: { type: String, required: [true,'Tài khoản không được trống'], unique: true },
        email: String,
        password: {type: String,  required: [true, 'Mật khẩu không được trống'],minLength: [6, 'Mật khẩu tối thiểu 6 tự']},
        name: String,
        tel: String,
        note: String,
        status: String,
        slug: {type: String},
        type: String,
        groupId:  {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Phân quyền không được trống']
          },
    },{
        timestamps: true
    });

    return mongoose.crm.model(collection, ModSchema);

}
    module.exports =  {createCon} ;