const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const GroupModel = new Schema({
    name: {type: String, required: [true, 'Tên không được trống'],unique: true},
    type: {type: String, required: [true, 'Loại tài khoản không được trống'], unique: true},
    status: {type: String, required: [true, 'Trạng thái không được trống']},
},{
    timestamps: true
});


// su dung hepler trong model
GroupModel.query.sortable = function(req) {
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
GroupModel.plugin(uniqueValidator,{
  type: 'mongoose-unique-validator',
  message: 'Nhóm tài khoản trùng'
});

// goi plugin 
GroupModel.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
});
module.exports = mongoose.model('userGroup', GroupModel);