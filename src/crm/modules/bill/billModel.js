
function createCon(DBname,collection) {
    const slug = require('mongoose-slug-generator');
    const mongooseDelete = require('mongoose-delete');
    const mongoose = require('mongoose');

    mongoose.crm = mongoose.createConnection(process.env.SERVER_DB_PATH+'/'+DBname,{
        useNewUrlParser: true,
        useUnifiedTopology: true,     
    });

    const Schema = mongoose.Schema;

    const itemSchema = new Schema({ 
        idGoods:  'string', // id hang hoa
        count: 'number',
        name: 'string', // ten 
        priceGoods: {type: 'Number',default: 0}, // gia
        priceTotalCount: {type: 'Number',default: 0}, // thanh tien
        priceCost: {type: 'Number',default: 0}, // gia von
        attribute: {}, // thuoc tinh
    });
   

    const ModSchema = new Schema({
        billCode: 'string', //ma hoa dong
        orderCode: 'string', //ma dat hang
        items: [itemSchema], //danh sach don dat hang
        satusOrderId: 'string', // trang thai don hang
        creator:{
            creatorId: {type:  mongoose.Schema.Types.ObjectId,  default: null}, // nguoi tao
            creatorAdminId: {type:  mongoose.Schema.Types.ObjectId,  default: null}, // nguoi tao
        },
        salesChannelId: 'string', // kenh ban
       
        paymentMethodId:  'string', // phuong thuc thanh toan
        customer: {
            customerId: 'string', // nguoi tao
            name: 'string', // ho ten khach hang
            phone_1: 'string', //so dien thoai
            email: 'string', // email
            sex: 'string', //gioi tinh
        }, 

        cityId: 'string', //thanh pho
        districtId: 'string', //quan huyen
        branchId: 'string', //chi nhanh
        customerNeedPay: {type: 'Number',default: 0}, // so tien khach hang can tra , tien sau khi giam gia 
        customerPay: {type: 'Number',default: 0}, // so tien khach hang da tra , tin khach dua
       
        excessCash: {type: 'Number',default: 0}, // so tien thua tra khach
        totalPrice: {type: 'Number',default: 0}, // tong tien hang sau giam gia 
        salesOff: {type: 'Number',default: 0}, // giam gia 
        unitSaleOff: 'string', // don vi giam gia
        SaleOffPricePercent: {type: 'Number',default: 0}, // pham tram giam gia
        staff: {
            staffId: {type:  mongoose.Schema.Types.ObjectId, default: null}, // nguoi ban
            staffAdminId: {type:  mongoose.Schema.Types.ObjectId, default: null}, // nguoi ban
            name: 'string', // ho ten nhan vien
            tel: 'string', //so dien thoai
            email: 'string', // email
            username: 'string', // email
        }, 
        priceOther: {type: 'Number',default: 0}, // thu khac
        priceOtherType: 'string', // loai thu khac
        priceOtherTypePercent: {type: 'Number',default: 0}, // phan tram thu khac
        priceOtherid: 'string',// id thu khac

        orderCode: 'String', //ma dat hang
        billCode: 'String', //ma hoa dong
        note: 'string', //ghi chu
        delivery: {
            returnDate: 'Date', // thoi gian tao
            cod: {type: 'Number',default: 0}, // thoi gian 
            partnerId: 'string', // doi tac 
            receiveName: 'string', // ten nguoi nhan 
            receiveTel: 'string', // dien thoai nguoi nhan 
            receiveAddress: 'string', // dia chi nguoi nhan 
            cityId: 'string', // tinh tp nguoi nhan 
            districtId: 'string', // quan hiuen nguoi nhan 
            weight: 'string', // trong luong
            unitWeight: 'string', // trong luong
            note: 'string', // ghi chu
            size: {
                dai: {type: 'Number',default: 0}, //dai
                rong: {type: 'Number',default: 0}, //dai
                cao: {type: 'Number',default: 0} //dai
            }, // trong luong
            goodsAddress: 'string', // dia chi lay hang
            billOfLadingCode: 'string', // ma van don
        },
        orderTemporary: 'string', //don tam
       
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