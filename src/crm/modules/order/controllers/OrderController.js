const OrderRequireModel = require('../orderModel');
const SetupRequireModel = require('../../setup/SetupModel');
const GoodsRequireModel = require('../../goods/goodsModel');
const BranchRequireModel = require('../../branch/branchModel');
const CustomerRequireModel = require('../../customer/customerModel');
const PriceOtherRequireModel = require('../../priceOther/PriceOtherModel');
const deliveryPartnerRequireModel = require('../../deliveryPartner/deliveryPartnerModel');
const CityRequireModel = require('../../city/CityModel');
const DistrictRequireModel = require('../../district/DistrictModel');
const SalesChannelRequireModel = require('../../salesChannel/SalesChannelModel');
const StaffRequireModel = require('../../staff/StaffModel');
const UserModel = require('../../../../backend/modules/user/UserModel');

const deleteBodyBlank = require('../../../../util/deleteBodyBlank');
const moment = require('moment'); 
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'order';
const module_name = 'Đơn hàng';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const { response } = require('express');
const permiView = 'order_crm_view';
const permiEdit = 'order_crm_edit';
const layout = 'mainCrm';
const collection = 'Order';

class Controller {
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel = OrderRequireModel.createCon(DBname,collection)
        const SetupModel = SetupRequireModel.createCon(DBname,'setup') //cao dat
        const GoodsModel = GoodsRequireModel.createCon(DBname,'Goods')
        const CustomerModel = CustomerRequireModel.createCon(DBname,'Customer')
        const CityModel = CityRequireModel.createCon(DBname,'City')
        const DistrictModel = DistrictRequireModel.createCon(DBname,'District')
        const DeliveryPartnerModel = deliveryPartnerRequireModel.createCon(DBname,'deliveryPartner')
        const BranchModel = BranchRequireModel.createCon(DBname,'Branch')
        const SalesChannelModel = SalesChannelRequireModel.createCon(DBname,'SalesChannel')
        const StaffModel = StaffRequireModel.createCon(DBname,'Staff')

        //phan trang 
        var itemPerPageDefault = 20
        if(req.query.page){
            var page = req.query.page; 
        }else{ 
            var  page = 1;
        }
        if(req.query.itemPerPage){
            var  itemPerPage = req.query.itemPerPage;
        }else{
            var  itemPerPage = itemPerPageDefault;
        }
        var skip = page * itemPerPage - itemPerPage;

        // tim kiem 
        const filter = {};
        if(req.query.feild){
            if(req.query.feild == 'OrderCodeId'){
                filter.OrderCodeId = { $regex: '.*' + req.query.key + '.*' } ;
            }else{
                filter.name = { $regex: '.*' + req.query.key + '.*' };
            }
        }
        // bo loc 
        filter.orderTemporary = 'off';
        //loai
        if(req.query.typeOfOrder){
            filter.typeOfOrderId = req.query.typeOfOrder;
        }
        // {"attribute.color": 'Trắng', "attribute.style": 'Cao' }

        Promise.all( [
            OrderModel.find(filter) .sort({createdAt: 'desc'}).skip(skip).limit(itemPerPage)
                .populate({path: 'customer.customerId',model: CustomerModel, populate:[{path:'cityId' ,model:CityModel},{path:'districtId' ,model:DistrictModel}]})
                .populate({path: 'delivery.partnerId',model: DeliveryPartnerModel})
                .populate({path: 'branchId',model: BranchModel})
                .populate({path: 'creator.creatorId', model: StaffModel})
                .populate({path: 'creator.creatorAdminId', model: UserModel})
                .populate({path: 'staff.staffId', model: StaffModel})
                .populate({path: 'staff.staffAdminId', model: UserModel})
                .populate({path: 'salesChannelId', model: SalesChannelModel})
            ,
            SetupModel.findOne({name: "displayColOrder"}),
            GoodsModel.find(filter),
            OrderModel.countDocuments(),
            itemPerPageDefault,
            filter,
           
        ])
            .then(([orderList,displayColOrderVal,goodsList,TotalCount,itemPerPageDefault,filter]) =>  res.render(folder_view + '/show',{
                title: module_name,
                orderList: multipleMongooseToObject(orderList),
                
                displayColOrderVal: mongooseToObject(displayColOrderVal),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
                key: req.query.key,
                feild: req.query.feild,
                TotalCount,
                itemPerPageDefault,
                filter,
            }))
            .catch(next);

    }
    //get / cat/ create
    createTemporary(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel = OrderRequireModel.createCon(DBname,collection)
        Promise.all( [
            OrderModel.count({})
        ])
            .then(([countOrder]) => {
                var newcountOrder = countOrder+1;
                // console.log(orderTemName);
                const OrderTemporary  = new OrderModel({
                        creatorId:req.userId,
                        orderTemporary: 'on',
                        orderCode:newcountOrder,
                        staff:{staffId: req.userId}
                    });
                OrderTemporary.save() 
                    .then((Order) => {
                        res.send(Order._id);return;
                    })
                    .catch(error => {
                        console.log(error);
                        // errorUtil.messageFlash(error,req.session);
                        // res.redirect('back'); 
                    }) ;
            })
            .catch(next);
    }
    deleteTemporary(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel = OrderRequireModel.createCon(DBname,collection)

        OrderModel.deleteOne({_id: req.params.id}).then().catch(next)
        res.send('Xóa thành công');return;
    }
    create(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel = GoodsRequireModel.createCon(DBname,'goods')
        const branchModel = BranchRequireModel.createCon(DBname,'branch')
        const PriceOtherModel = PriceOtherRequireModel.createCon(DBname,'PriceOther')
        const OrderModel = OrderRequireModel.createCon(DBname,collection)
        const deliveryPartnerModel = deliveryPartnerRequireModel.createCon(DBname,'deliveryPartner')
        const cityModel = CityRequireModel.createCon(DBname,'city')
        const StaffModel = StaffRequireModel.createCon(DBname,'Staff')
        const SalesChannelModel = SalesChannelRequireModel.createCon(DBname,'SalesChannel')

        // tao don hang hang neu chua co dơn hàng 
        //kiem tra so luong dat hang
        //phan trang 
        var itemPerPageDefault = 12;
        if(req.query.page){  var page = req.query.page;  }else{  var  page = 1; }
        if(req.query.itemPerPage){  var  itemPerPage = req.query.itemPerPage;  }else{  var  itemPerPage = itemPerPageDefault;  }
        var skip = page * itemPerPage - itemPerPage;
      
        Promise.all( [
            goodsModel.find({}).sort({createdAt: 'desc'}).skip(skip).limit(itemPerPage), //hang hoa
            OrderModel.find({orderTemporary:'on',creatorId:req.userId}).sort({createdAt: 'desc'}),//order tam
            branchModel.find({}),  //chi nhanh
            PriceOtherModel.find({}),  //chi nhanh
            deliveryPartnerModel.find({}),  //chi nhanh
            cityModel.find({}),  //thanh pho
            StaffModel.find({}),  //nhan vien
            SalesChannelModel.find({}),  //nhan vien
            req.username,
            req.userId,
            req.name,
            OrderModel.countDocuments(),
            OrderModel.find({orderTemporary:'on',creatorId:req.userId}).countDocuments(),
            itemPerPageDefault,
        ])
            .then(([goodsList,orderTemList, branchList,priceOtherList,deliveryPartnerList,cityList,staffList,salesChannelList,username,userId,name,TotalCount,orderTemporaryCount,itemPerPageDefault]) => res.render(folder_view + '/create',{
                title: 'Thêm '+ module_name,
                goodsList: multipleMongooseToObject(goodsList),
                orderTemList: multipleMongooseToObject(orderTemList),
                branchList: multipleMongooseToObject(branchList),
                priceOtherList: multipleMongooseToObject(priceOtherList),
                deliveryPartnerList: multipleMongooseToObject(deliveryPartnerList),
                cityList: multipleMongooseToObject(cityList),
                staffList: multipleMongooseToObject(staffList),
                salesChannelList: multipleMongooseToObject(salesChannelList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username,
                name,
                userId,
                TotalCount,
                orderTemporaryCount,
                itemPerPageDefault,

            }))
            .catch(next);

    }

//get / cat/ edit
    edit(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel = OrderRequireModel.createCon(DBname,'Order')

        
        if(req.params.typeOfOrder == 'Order'){
            var typeOfOrder_name = 'hàng hóa';
        }
        if(req.params.typeOfOrder == 'service'){
            var typeOfOrder_name = 'dịch vụ';
        }
        if(req.params.typeOfOrder == 'combo'){
            var typeOfOrder_name = 'combo';
        }
        

        Promise.all( [
            OrderModel.findById(req.params.id).populate({path:'combo',model: OrderModel}),
            OrderCodeModel.find({}), 
            groupOfOrderModel.find({}), 
            brandModel.find({}), 
            attributeModel.find({}), 
            attributeModel.findOne({}).limit(1), 
            unitModel.find({}), 
            typeOfOrder_name,
            req.params.typeOfOrder
           
        ])
            .then(([Order,OrderCodeList,groupOfOrderList,brandList,attributeList,attributeFist,unitList,typeOfOrder_name,typeOfOrder]) => res.render(folder_view + '/editOrder',{
                title: 'Sửa '+ typeOfOrder_name,
                Order: mongooseToObject(Order),
                OrderCodeList: multipleMongooseToObject(OrderCodeList),
                groupOfOrderList: multipleMongooseToObject(groupOfOrderList),
                brandList: multipleMongooseToObject(brandList),
                attributeList: multipleMongooseToObject(attributeList),
                attributeFist: mongooseToObject(attributeFist),
                unitList: multipleMongooseToObject(unitList),
                // typeOfOrder: multipleMongooseToObject(typeOfOrderList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
                typeOfOrder_name,
                typeOfOrder,
            }))
            .catch(next);
    }

    //put/ cat
    update(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel =  OrderRequireModel.createCon(DBname,'Order') // ma hang hoa

        // console.log(req.body.delivery);
        if(req.body.delivery){
            if(req.body.delivery.returnDate){
                req.body.delivery.returnDate = moment(req.body.delivery.returnDate, 'DD-MM-YYYY');
                // res.json(req.body.birthday);return;
            }
            if(req.body.delivery.partnerId == ''){
                req.body.delivery.partnerId = new mongoose.Types.ObjectId();
            }
        }
        if(req.body.customer){
            if(req.body.customer.customerId==''){
                req.body.customer.customerId = new mongoose.Types.ObjectId();
            }
        }
        console.log(req.body.salesChannelId);

        if(req.body.salesChannelId==''){
            req.body.salesChannelId = new mongoose.Types.ObjectId();
        }
        //xoa du lieu trong 
        // req.body.delivery = deleteBodyBlank.deleteBodyBlank(req.body.delivery)

        const Order  = new OrderModel(req.body);
       
        OrderModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then((order) => {
                // console.log(order);
                res.send('Lưu thành công');return;
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); return;
            })
    }

   
    searchAjax(req,res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel =  OrderRequireModel.createCon(DBname,'Order') // hang hoa

        const filter = {};
        if(req.query.feild){
            if(req.query.feild == 'OrderCodeId'){
                filter.OrderCodeId = { $regex: '.*' + req.query.key + '.*' } ;
                // tim id ma hang 

            }else{
                filter.name = { $regex: '.*' + req.query.key + '.*' };
            }
        }
        // console.log(filter);
        OrderModel.find(filter).limit('10')
            .then((result) => {
                // console.log(result);
                var li = []
                for (const [key,val] of Object.entries(result) ){
                    if(val.OrderCodeId){
                        var OrderCodeId  = ' - '+val.OrderCodeId;
                    }else{
                        var OrderCodeId  = '';
                    }
                    li += `<li class="liSearch" data-id="${val._id}" data-key="${val.name}" style="cursor:pointer">${val.name}${OrderCodeId}</li>`;
                }
                res.send(li);
                return;
            });

    }
    //xoa annh
    imageDestroy(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel =  OrderRequireModel.createCon(DBname,'Order') // hang hoa

        OrderModel.findById(req.params.id)
            .then((Order) => {
                // xoa anh 
                // console.log(req.params.imgName);
                Order.img.remove(req.params.imgName);
                // xoa file anh 
                var dir =  `src/public/img/Order/`;
                if (fs.existsSync(dir)) {
                    try {
                        fs.unlinkSync(dir+'/'+req.params.imgName);
                        console.log(`${dir} is deleted!`);
                        res.send('Xóa thành công');return;
                    } catch (err) {
                        console.error(`Error while deleting ${dir}.`);
                    }
                }
                Order.save(function (error) {
                    if (error) {
                        errorUtil.messageFlash(error,req.session);
                            res.redirect('back'); 
                    } else {
                       
                    }
                })
                
                res.send('Xóa thành công');return;
            })
            .catch(error => {
                console.log(error);return;
            })
            res.send('Xóa thành công');return;
    }

    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel =  OrderRequireModel.createCon(DBname,'Order') // hang hoa

        // xao anh 
        OrderModel.findById(req.params.id)
            .then((Order) => {
                // xoa anh 
                var dir =  `src/public/img/Order/`;
                for (const imgName of Order.img) { 
                    console.log(imgName);
                    if (fs.existsSync(dir)) {
                        try {
                            fs.unlinkSync(dir+'/'+imgName);
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    }
                }

            })
            .catch(error => {
                console.log(error);return;
            })

        OrderModel.deleteOne({_id: req.params.id}).then().catch(next)

        res.redirect('back')
    }
    

    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const OrderModel =  OrderRequireModel.createCon(DBname,'Order') // hang hoa

        switch(req.body.action){
            case 'delete':
                //xoa anh
                for(const OrderId of req.body.ids){
                    OrderModel.findById(OrderId)
                        .then((Order) => {
                            // xoa anh 
                            var dir =  `src/public/img/Order/`;
                            for (const imgName of Order.img) { 
                                console.log(imgName);
                                if (fs.existsSync(dir)) {
                                    try {
                                        fs.unlinkSync(dir+'/'+imgName);
                                        console.log(`${dir} is deleted!`);
                                    } catch (err) {
                                        console.error(`Error while deleting ${dir}.`);
                                    }
                                }
                            }

                        })
                        .catch(error => {
                            console.log(error);return;
                        })
                }
                // xoa document 
                OrderModel.delete({_id: {$in: req.body.ids} })
                    .then(() => res.redirect('back'))
                    .catch(next)

                break;
            default:
                res.json({message: 'Hành động không hợp lệ'})
        }
    }

}

module.exports = new Controller;