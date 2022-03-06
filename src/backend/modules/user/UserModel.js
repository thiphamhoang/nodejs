const mongoose = require('mongoose');

const mongooseDelete = require('mongoose-delete');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: [true,'Tài khoản không được trống'], unique: true },
    email: String,
    password: {type: String,  required: [true, 'Mật khẩu không được trống'],minLength: [6, 'Mật khẩu tối thiểu 6 tự']},
    name: String,
    tel: String,
    note: String,
    status: String,
    slug: {type: String},
    groupId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userGroup",
        required: [true,'Phân quyền không được trống']
      },
},{
    timestamps: true
});

// su dung hepler trong model
UserSchema.query.sortable = function(req) {
    if(req.query.hasOwnProperty('_sort')){
        // validate chi nhan gia tri asc hoạc desc 
        const isValidtype = ['asc','desc'].includes(req.query.type); 
        return this.sort({
            // mac dinh neu sai gia tri thi nhan desc 
            [req.query.column] : isValidtype ? req.query.type : 'desc',
        })
    }
    return this;
  }
  
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});
// goi plugin 

UserSchema.plugin(uniqueValidator,{
    type: 'mongoose-unique-validator',
    message: 'Tài khoản trùng'
});



try {
    module.exports = mongoose.model('User', UserSchema);
}catch(error){
    module.exports = mongoose.model('User');
}