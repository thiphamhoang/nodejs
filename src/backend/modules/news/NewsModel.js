const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    name: {type: String, required: [true, 'Tên không được trống'] },
    des: {type: String},
    content: {type: String},
    img: {type: String},
    slug: {type: String, slug : 'name', unique: true},
    title_seo: {type: String},
    des_seo: {type: String},
    key_seo: {type: String},
    status: {type: String},
    cat_id: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cat"
        }
      ]
},{
    timestamps: true
});


// su dung hepler trong model
NewsSchema.query.sortable = function(req) {
    if(req.query.hasOwnProperty('_sort')){
        // validate chi nhan gia tri asc hoạc desc 
        const isValidtype = ['asc','desc'].includes(req.query.type); 
        req.query.column = 'createdAt';
       
        return this.sort({
            // mac dinh neu sai gia tri thi nhan desc 
            [req.query.column] : isValidtype ? req.query.type : 'desc',
        })
    }else{
        return this.sort([['updatedAt', 'descending']])
    }
    return this;
}

// goi plugin 
mongoose.plugin(slug);
NewsSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});
module.exports = mongoose.model('News', NewsSchema);