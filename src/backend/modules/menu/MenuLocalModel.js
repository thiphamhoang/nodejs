const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const MenuLocalSchema = new Schema({
    name: {type: String, required: [true, 'Tên không được trống']},
    type: {type: String},
    status: {type: String},
},{
    timestamps: true
});

// su dung hepler trong model
MenuLocalSchema.query.sortable = function(req) {
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

// goi plugin 
MenuLocalSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});
module.exports = mongoose.model('MenuLocal', MenuLocalSchema);