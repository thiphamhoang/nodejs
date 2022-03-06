
function createCon(DBname,collection) {
    const slug = require('mongoose-slug-generator');
    const mongooseDelete = require('mongoose-delete');
    const mongoose = require('mongoose');
    
    mongoose.crm = mongoose.createConnection(process.env.SERVER_DB_PATH+'/'+DBname,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
                
    });

    const Schema = mongoose.Schema;
    //hang hoa
    const ModSchema = new Schema({
  
        img:  'string', //hinh anh
        code: {type: Number, default: 0}, // ma khach hang
        name: 'string', // ho ten khach hang
        phone_1: 'string', //so dien thoai
        phone_2: 'string', //so dien thoai
        email: 'string', // email
        
        birthday: {type:Date ,default: null },//ngay sinh
        sex: 'string',//ngay sinh
        address: 'string',//ngay sinh
        cityId:  {type:  mongoose.Schema.Types.ObjectId, ref: "City", default: null}, // tinh thanh pho
        districtId:  {type:  mongoose.Schema.Types.ObjectId, ref: "District", default: null}, // huyen
        wardsId:  {type:  mongoose.Schema.Types.ObjectId, ref: "Wards", default: null}, // phuong xa
        branchId:  {type:  mongoose.Schema.Types.ObjectId, default: null}, // phuong xa
        typeOfCustomer: 'string', // loai khach hang ca nha hoac cong ty
        taxCode: 'string', // ma so thue
      
        facebook: 'string', //facebook link
        groupOfCustomerId:  {type:  mongoose.Schema.Types.ObjectId, ref: "GroupOfCustomer", default: null}, // phuong xa
        note: 'string', // ghi chu

    },{

        timestamps: true,
    });


    // goi plugin 
    mongoose.plugin(slug);
    ModSchema.plugin(mongooseDelete, {
        deletedAt: true,
        overrideMethods: 'all'
    });


    return mongoose.crm.model(collection, ModSchema);


}
    module.exports =  {createCon} ;