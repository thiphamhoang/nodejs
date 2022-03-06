
function createCon(DBname,collection) {
    const slug = require('mongoose-slug-generator');
    const mongooseDelete = require('mongoose-delete');
    const mongoose = require('mongoose');

    mongoose.crm = mongoose.createConnection(process.env.SERVER_DB_PATH+'/'+DBname,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
                
    });

    const Schema = mongoose.Schema;

    const imgSchema = new Schema({ 
        name: 'string',
    });

    //hang hoa
    const ModSchema = new Schema({
        goodsCodeId: 'string', // mã hang
        name: 'string', // ten 
        price: {type: 'Number',default: 0}, // gia
        costPrice: {type: 'Number',default: 0}, // gia von
        supplierId: {type:  mongoose.Schema.Types.ObjectId, ref: "Supplier", default: null}, // nha cung cap
        supplierOrderCount: 'Number', // so luong dat nha cung cap
        inventoryCount: 'Number', //so luong tong kho
        customerOrderCount: 'Number', // so luong khach hang dat
        img:  [{
            type: String
        }], //hinh anh
        barcode: 'string', // mã vạch
        groupOfGoodsId: {type:  mongoose.Schema.Types.ObjectId, ref: "GroupOfGoods", default: null}, // nhom hang
        typeOfGoodsId: 'string', // loai hang
        saleChannelLink: 'string', // lien ket kenh ban 
        brandId: {type:  mongoose.Schema.Types.ObjectId, ref: "Brand", default: null}, // thuong hieu
        earnPoints: 'string', //tich diem
        salesStatus: {type: String, default: 'on' }, // trang thai 
        weight: 'string', // trong luong
        directSales: 'string', //ban truc tiep
        attribute: {}, // thuoc tinh
        hot: 'string', //noi bat
        unitId: 'string', // don vi 
        description: 'string', // mo ta
        note: 'string', // mo ta
        combo: [{type:  mongoose.Schema.Types.ObjectId, ref: "Goods", default: null}],
     

    },{
        timestamps: true
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