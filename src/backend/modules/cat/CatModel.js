const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const CatSchema = new Schema({
    name: {type: String, required: [true, 'Tên không được trống']},
    des: {type: String},
    image: {type: String},
    parentId:  {type: String, required: true},
    slug: {type: String, slug : 'name', unique: true,   required: true},
    title_seo: {type: String},
    des_seo: {type: String},
    key_seo: {type: String},
    type: {type: String},
    status: {type: String},
},{
    timestamps: true
});

// su dung hepler trong model
CatSchema.query.sortable = function(req) {
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
mongoose.plugin(slug);
CatSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});
module.exports = mongoose.model('Cat', CatSchema);