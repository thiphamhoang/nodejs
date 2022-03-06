const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const optionSchema = new Schema({ 
    name: 'string',
    value: 'string',
 });

const feildSchema = new Schema({ 
    name: 'string',
    title: 'string',
    des: 'string',
    value: ['string'],
    type: 'string',
    idTheme: {type: mongoose.Schema.Types.ObjectId},
    idRow: {type: mongoose.Schema.Types.ObjectId},
    option: [optionSchema]
});

const RowSchema = new Schema({
    name: { type: String, required: [true,'Tài khoản không được trống'] },
    fileName: { type: String, required: [true,'Tài khoản không được trống'] },
    local: String,
    status: String,
    type: String,
    container: String,
    themeId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theme",
        required: [true,'Giao diện (theme) không được trống']
    },
    //cac truong du lieu
    feild: [feildSchema],
},{
    timestamps: true
});

// su dung hepler trong model
RowSchema.query.sortable = function(req) {
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
  
RowSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});


module.exports = mongoose.model('Row', RowSchema);