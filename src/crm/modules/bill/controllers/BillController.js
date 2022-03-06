const BillRequireModel = require('../billModel');
const SetupRequireModel = require('../../setup/SetupModel');
const GoodsRequireModel = require('../../goods/goodsModel');
const OrderRequireModel = require('../../order/orderModel');
const BranchRequireModel = require('../../branch/branchModel');
const PriceOtherRequireModel = require('../../priceOther/PriceOtherModel');
const deliveryPartnerRequireModel = require('../../deliveryPartner/deliveryPartnerModel');
const CityRequireModel = require('../../city/CityModel');
const moment = require('moment'); 
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'bill';
const module_name = 'Hóa đơn';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const { response } = require('express');
const permiView = 'bill_crm_view';
const permiEdit = 'bill_crm_edit';
const layout = 'mainCrm';
const collection = 'Bill';

class Controller {
    show(req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const BillModel = BillRequireModel.createCon(DBname,collection)
        const SetupModel = SetupRequireModel.createCon(DBname,'setup') //cao dat
        const GoodsModel = GoodsRequireModel.createCon(DBname,collection)
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
            if(req.query.feild == 'BillCodeId'){
                filter.BillCodeId = { $regex: '.*' + req.query.key + '.*' } ;
            }else{
                filter.name = { $regex: '.*' + req.query.key + '.*' };
            }
        }
        // bo loc 
        filter.billTemporary = 'off';
        //loai
        if(req.query.typeOfBill){
            filter.typeOfBillId = req.query.typeOfBill;
        }
        // {"attribute.color": 'Trắng', "attribute.style": 'Cao' }

        Promise.all( [
            BillModel.find(filter) .sort({createdAt: 'desc'}).skip(skip).limit(itemPerPage),
            
            SetupModel.findOne({name: "displayColBill"}),
            GoodsModel.find(filter),
            BillModel.count(),
            itemPerPageDefault,
            filter,
           
        ])
            .then(([billList,displayColBillVal,goodsList,TotalCount,itemPerPageDefault,filter]) =>  res.render(folder_view + '/show',{
                title: module_name,
                billList: multipleMongooseToObject(billList),
                
                displayColBillVal: mongooseToObject(displayColBillVal),
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

    store(req,res,next){ 
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const BillModel =  BillRequireModel.createCon(DBname,'Bill') // ma hang hoa
        const OrderModel =  OrderRequireModel.createCon(DBname,'Order') // ma hang hoa
            
        //get order id
        OrderModel.findById(req.params.orderId)
            .then((order) => {
                Promise.all( [
                    BillModel.count({}),
                    order
                ])
                    .then(([countBill,order]) => {

                        var bill =  mongooseToObject(order);
                        bill.billCode =  countBill+1;
                            delete bill._id;
                            const Bill  = new BillModel(bill);
                            Bill.save() 
                                .then((newBill) => {
                                    res.send(newBill.billCode); return;
                                })
                                .catch(error => {
                                    console.log(error);
                                }) ;
        
                    })
                    .catch(next);
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); return;
            })

    }
//get / cat/ edit
    edit(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const BillModel = BillRequireModel.createCon(DBname,'Bill')

        
        if(req.params.typeOfBill == 'Bill'){
            var typeOfBill_name = 'hàng hóa';
        }
        if(req.params.typeOfBill == 'service'){
            var typeOfBill_name = 'dịch vụ';
        }
        if(req.params.typeOfBill == 'combo'){
            var typeOfBill_name = 'combo';
        }
        

        Promise.all( [
            BillModel.findById(req.params.id).populate({path:'combo',model: BillModel}),
            BillCodeModel.find({}), 
            groupOfBillModel.find({}), 
            brandModel.find({}), 
            attributeModel.find({}), 
            attributeModel.findOne({}).limit(1), 
            unitModel.find({}), 
            typeOfBill_name,
            req.params.typeOfBill
           
        ])
            .then(([Bill,BillCodeList,groupOfBillList,brandList,attributeList,attributeFist,unitList,typeOfBill_name,typeOfBill]) => res.render(folder_view + '/editBill',{
                title: 'Sửa '+ typeOfBill_name,
                Bill: mongooseToObject(Bill),
                BillCodeList: multipleMongooseToObject(BillCodeList),
                groupOfBillList: multipleMongooseToObject(groupOfBillList),
                brandList: multipleMongooseToObject(brandList),
                attributeList: multipleMongooseToObject(attributeList),
                attributeFist: mongooseToObject(attributeFist),
                unitList: multipleMongooseToObject(unitList),
                // typeOfBill: multipleMongooseToObject(typeOfBillList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
                typeOfBill_name,
                typeOfBill,
            }))
            .catch(next);
    }

    //put/ cat
    update(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const BillModel =  BillRequireModel.createCon(DBname,'Bill') // ma hang hoa

        // console.log(req.body.delivery);
        if(req.body.delivery.returnDate){
            req.body.delivery.returnDate = moment(req.body.delivery.returnDate, 'DD-MM-YYYY');
            // res.json(req.body.birthday);return;
        }
        //xoa du lieu trong 
        var formData =  req.body
     
        const Bill  = new BillModel(formData);
       

        BillModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then((bill) => {
                // console.log(bill);
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
        const BillModel =  BillRequireModel.createCon(DBname,'Bill') // hang hoa

        const filter = {};
        if(req.query.feild){
            if(req.query.feild == 'BillCodeId'){
                filter.BillCodeId = { $regex: '.*' + req.query.key + '.*' } ;
                // tim id ma hang 

            }else{
                filter.name = { $regex: '.*' + req.query.key + '.*' };
            }
        }
        // console.log(filter);
        BillModel.find(filter).limit('10')
            .then((result) => {
                // console.log(result);
                var li = []
                for (const [key,val] of Object.entries(result) ){
                    if(val.BillCodeId){
                        var BillCodeId  = ' - '+val.BillCodeId;
                    }else{
                        var BillCodeId  = '';
                    }
                    li += `<li class="liSearch" data-id="${val._id}" data-key="${val.name}" style="cursor:pointer">${val.name}${BillCodeId}</li>`;
                }
                res.send(li);
                return;
            });

    }


    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const BillModel =  BillRequireModel.createCon(DBname,'Bill') // hang hoa

        // xao anh 
        BillModel.findById(req.params.id)
            .then((Bill) => {
                // xoa anh 
                var dir =  `src/public/img/Bill/`;
                for (const imgName of Bill.img) { 
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

        BillModel.deleteOne({_id: req.params.id}).then().catch(next)

        res.redirect('back')
    }
    

    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const BillModel =  BillRequireModel.createCon(DBname,'Bill') // hang hoa

        switch(req.body.action){
            case 'delete':
                //xoa anh
                for(const BillId of req.body.ids){
                    BillModel.findById(BillId)
                        .then((Bill) => {
                            // xoa anh 
                            var dir =  `src/public/img/Bill/`;
                            for (const imgName of Bill.img) { 
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
                BillModel.delete({_id: {$in: req.body.ids} })
                    .then(() => res.redirect('back'))
                    .catch(next)

                break;
            default:
                res.json({message: 'Hành động không hợp lệ'})
        }
    }

}

module.exports = new Controller;