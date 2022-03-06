const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    name: {type: String, required: [true, 'Tên không được trống']},
    des: {type: String},
    image: {type: String},
    slug: {type: String},
    menuLocalId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuLocal",
      },
    parentId: {type: String},
    type: {type: String},
    status: {type: String},
    order: {type: Number, default: 0}
},{
    timestamps: true
});




// su dung hepler trong model
MenuSchema.query.sortable = function(req) {
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
MenuSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});
module.exports = mongoose.model('Menu', MenuSchema);