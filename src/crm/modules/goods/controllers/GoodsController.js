const GoodsRequireModel = require('../goodsModel');
const goodsCodeRequireModel = require('../../goodsCode/goodsCodeModel');
const groupOfGoodsRequireModel = require('../../groupOfGoods/groupOfGoodsModel');
const brandRequireModel = require('../../brand/brandModel');
const attributeRequireModel = require('../../attribute/attributeModel');
const unitRequireModel = require('../../unit/unitModel');
const deleteBodyBlank = require('../../../../util/deleteBodyBlank');
const SetupRequireModel = require('../../setup/SetupModel');
const fs = require('fs-extra')
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const deleteUtil =  require('../../../../util/deleteRecursive');
const errorUtil =  require('../../../../util/errorNoti');
const folder_module = 'goods';
const module_name = 'Hàng hóa';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const { response } = require('express');
const permiView = 'goods_crm_view';
const permiEdit = 'goods_crm_edit';
const layout = 'mainCrm';
const collection = 'Goods';

class Controller {
    paginateAjax (req, res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const GoodsModel = GoodsRequireModel.createCon(DBname,collection)
        const goodsCodeModel =  goodsCodeRequireModel.createCon(DBname,'goodsCode') // ma hang hoa
        const groupOfGoodsModel =  groupOfGoodsRequireModel.createCon(DBname,'groupOfGoods') // nhom hang hoa
        const brandModel =  brandRequireModel.createCon(DBname,'brand') // thuong hieu

        //phan trang 
        var itemPerPageDefault = 12
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

        Promise.all( [
            GoodsModel.find({})
                .populate({ path: 'groupOfGoodsId', model: groupOfGoodsModel, select: 'name' })  //nhom hang
                .populate({ path: 'brandId', model: brandModel, select: 'name' })  //nhom hang
                .sort({createdAt: 'desc'}).skip(skip).limit(itemPerPage),
           
        ])
            .then(([goodsList]) =>  {
                var col = []
                for (const [key,val] of Object.entries(goodsList) ){
                    if(val.img){
                        for (const [key_img,val_img] of Object.entries(val.img) ){
                            if(key_img == 0){
                                var imgItem = `<img src="/img/user/${userId}/goods/${val_img}"  class="absolute h-100" style="display: block;  margin-left: auto; margin-right: auto;  width: 50%;">`;
                            }
                        }
                    }else{
                        var img = '';
                    }
                    col += `<div class="col-md-2 bg-light">
                    <div data-id="${val._id}" data-name="${val.name}" data-price="${val.price}"  class="mod-goods select-item mb-2" style="cursor: pointer;">
                        <div class="mod-goods-price-img" style="position: relative;">
                            <div class="mod-goods-price text-success" style="font-size:12px;  position:absolute;  bottom: 0; background-color: #fff;  z-index: 999;">
                                <span class="money">${val.price}</span> đ
                            </div>
                            <div class="mod-goods-img bg-light" style="margin: 0 auto; overflow: hidden; position: relative; height: 100px;">
                               ${imgItem}
                            </div>
                        </div>
                        <div class="mod-goods-name text-center my-1 fw-bold" style="font-size:12px">
                            ${val.name}
                        </div>
                    </div>
                </div>`;
                }
                res.send(col);
                return;

            })
            .catch(next);

    }
    show(req, res,next){
        
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const GoodsModel = GoodsRequireModel.createCon(DBname,collection)
        const goodsCodeModel =  goodsCodeRequireModel.createCon(DBname,'goodsCode') // ma hang hoa
        const groupOfGoodsModel =  groupOfGoodsRequireModel.createCon(DBname,'groupOfGoods') // nhom hang hoa
        const brandModel =  brandRequireModel.createCon(DBname,'brand') // thuong hieu
        const SetupModel = SetupRequireModel.createCon(DBname,'setup') //cao dat
        const attributeModel = attributeRequireModel.createCon(DBname,'attribute') //cao dat

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
            if(req.query.feild == 'goodsCodeId'){
                filter.goodsCodeId = { $regex: '.*' + req.query.key + '.*' } ;
                // tim id ma hang 

            }else{
                filter.name = { $regex: '.*' + req.query.key + '.*' };
            }
        }
        // bo loc 
        //loai
        if(req.query.typeOfGoods){
            filter.typeOfGoodsId = req.query.typeOfGoods;
        }
        // nhom 
        if(req.query.groupOfGoods){
            filter.groupOfGoodsId = req.query.groupOfGoods;
        }
        // thuong hieu 
        if(req.query.brand){
            filter.brandId = req.query.brand;
        }
        // thuoc tinh

        if(req.query.attribute){
            // go bo thuoc tinh trong 
            

                var obj = req.query.attribute
                Object.keys(obj).forEach(key => {
                    if (obj[key] === null || obj[key] === '') {
                    delete obj[key];
                    }
                });
                req.query.attribute = obj;
                // filter.attribute = req.query.attribute;

                //  filter  = delete filter.regex;
                //  console.log(array);

                // filter.attribute = array;
                
                // console.log(req.query.attribute);

                filter.attribute = {$in: [req.query.attribute] };
                var filterAttriVal =  req.query.attribute;

        }else{
            var filterAttriVal = '';
        }

        // console.log(req.userId);
 
        // {"attribute.color": 'Trắng', "attribute.style": 'Cao' }

        Promise.all( [
            GoodsModel.find(filter)
                .populate({ path: 'groupOfGoodsId', model: groupOfGoodsModel, select: 'name' })  //nhom hang
                .populate({ path: 'brandId', model: brandModel, select: 'name' })  //nhom hang
                .sort({createdAt: 'desc'}).skip(skip).limit(itemPerPage),
            SetupModel.findOne({name: "displayColGoods"}),
            GoodsModel.count(),
            itemPerPageDefault,
            filter,
            groupOfGoodsModel.find({}),
            brandModel.find({}),
            attributeModel.find({}),
            filterAttriVal,
            req.userId,
        ])
            .then(([goodsList,displayColGoodsVal,TotalCount,itemPerPageDefault,filter,groupOfGoodsList,brandList,attributeList,filterAttriVal,userId]) =>  res.render(folder_view + '/show',{
                title: module_name,
                goodsList: multipleMongooseToObject(goodsList),
                displayColGoodsVal: mongooseToObject(displayColGoodsVal),
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
                groupOfGoodsList: multipleMongooseToObject(groupOfGoodsList),
                brandList: multipleMongooseToObject(brandList),
                attributeList: multipleMongooseToObject(attributeList),
                filterAttriVal,

                userId,
            }))
            .catch(next);

    }
    //get / cat/ create
    createGoods(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsCodeModel =  goodsCodeRequireModel.createCon(DBname,'goodsCode') // ma hang hoa
        const groupOfGoodsModel =  groupOfGoodsRequireModel.createCon(DBname,'groupOfGoods') // nhom hang hoa
        const brandModel =  brandRequireModel.createCon(DBname,'brand') // thuong hieu
        const attributeModel =  attributeRequireModel.createCon(DBname,'attribute') // thuoc tinh
        const unitModel =  unitRequireModel.createCon(DBname,'unit') // don vi
        if(req.params.typeOfGoods == 'goods'){
            var typeOfGoods_name = 'hàng hóa';
        }
        if(req.params.typeOfGoods == 'service'){
            var typeOfGoods_name = 'dịch vụ';
        }
        if(req.params.typeOfGoods == 'combo'){
            var typeOfGoods_name = 'combo';
        }
        Promise.all( [
            goodsCodeModel.find({}), 
            groupOfGoodsModel.find({}), 
            brandModel.find({}), 
            attributeModel.find({}), 
            attributeModel.findOne({}).limit(1), 
            unitModel.find({}), 
            typeOfGoods_name,
            req.params.typeOfGoods,
        ])
            .then(([goodsCodeList,groupOfGoodsList,brandList,attributeList,attributeFist,unitList,typeOfGoods_name,typeOfGoods]) => res.render(folder_view + '/createGoods',{
                title: 'Thêm '+ typeOfGoods_name,
                goodsCodeList: multipleMongooseToObject(goodsCodeList),
                groupOfGoodsList: multipleMongooseToObject(groupOfGoodsList),
                brandList: multipleMongooseToObject(brandList),
                attributeList: multipleMongooseToObject(attributeList),
                attributeFist: mongooseToObject(attributeFist),
                unitList: multipleMongooseToObject(unitList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
                typeOfGoods_name,
                typeOfGoods

            }))
            .catch(next);

    }

    storeGoods(req,res,next){ 
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel =  GoodsRequireModel.createCon(DBname,'goods') // ma hang hoa
        
        // go bo thuoc tinh null trong attribute
        // res.json(req.body.attribute);return;

        var obj = req.body.attribute
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === '') {
            delete obj[key];
            }
        });
        req.body.attribute = obj;

        // if(req.body.attribute){
        //     var obj = req.body.attribute
        //     Object.keys(obj).forEach(key => {
        //         if (obj[key] === null || obj[key] === '') {
        //           delete obj[key];
        //         }
        //       });
        //     req.body.attribute = obj;
        // }

        // res.json(req.body.attribute);return;
        //xoa du lieu trong 
        var formData = deleteBodyBlank.deleteBodyBlank(req.body)
 
        // res.json(formData);return;
        const goods  = new goodsModel(formData);
        goods.save() 
            .then((goods) => { 
                if(req.body.save == 'saveAndNew') {
                    var linkRedirect = module_path +'/createGoods';
                }
                else if(req.body.save == 'saveAndReview'){
                    var linkRedirect = module_path+'/'+ goods._id + '/editGoods';
                }else{
                    var linkRedirect = module_path;
                }
                res.redirect(linkRedirect)
            })
            .catch(error => {
                console.log(error);

                // errorUtil.messageFlash(error,req.session);
                // res.redirect('back'); 
            })
        ;
    }
//get / cat/ edit
    editGoods(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel = GoodsRequireModel.createCon(DBname,'goods')
        const goodsCodeModel =  goodsCodeRequireModel.createCon(DBname,'goodsCode') // ma hang hoa
        const groupOfGoodsModel =  groupOfGoodsRequireModel.createCon(DBname,'groupOfGoods') // nhom hang hoa
        const brandModel =  brandRequireModel.createCon(DBname,'brand') // thuong hieu
        const attributeModel =  attributeRequireModel.createCon(DBname,'attribute') // thuoc tinh
        const unitModel =  unitRequireModel.createCon(DBname,'unit') // don vi
        
        if(req.params.typeOfGoods == 'goods'){
            var typeOfGoods_name = 'hàng hóa';
        }
        if(req.params.typeOfGoods == 'service'){
            var typeOfGoods_name = 'dịch vụ';
        }
        if(req.params.typeOfGoods == 'combo'){
            var typeOfGoods_name = 'combo';
        }
        

        Promise.all( [
            goodsModel.findById(req.params.id).populate({path:'combo',model: goodsModel}),
            goodsCodeModel.find({}), 
            groupOfGoodsModel.find({}), 
            brandModel.find({}), 
            attributeModel.find({}), 
            attributeModel.findOne({}).limit(1), 
            unitModel.find({}), 
            typeOfGoods_name,
            req.params.typeOfGoods,
            req.userId,
        ])
            .then(([goods,goodsCodeList,groupOfGoodsList,brandList,attributeList,attributeFist,unitList,typeOfGoods_name,typeOfGoods,userId]) => res.render(folder_view + '/editGoods',{
                title: 'Sửa '+ typeOfGoods_name,
                goods: mongooseToObject(goods),
                goodsCodeList: multipleMongooseToObject(goodsCodeList),
                groupOfGoodsList: multipleMongooseToObject(groupOfGoodsList),
                brandList: multipleMongooseToObject(brandList),
                attributeList: multipleMongooseToObject(attributeList),
                attributeFist: mongooseToObject(attributeFist),
                unitList: multipleMongooseToObject(unitList),
                // typeOfGoods: multipleMongooseToObject(typeOfGoodsList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
                typeOfGoods_name,
                typeOfGoods,
                userId,
            }))
            .catch(next);
    }

    //put/ cat
    updateGoods(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel =  GoodsRequireModel.createCon(DBname,'goods') // ma hang hoa

        var obj = req.body.attribute
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === '') {
            delete obj[key];
            }
        });
        req.body.attribute = obj;

        // if(req.body.attribute){
        //     var obj = req.body.attribute
        //     Object.keys(obj).forEach(key => {
        //         if (obj[key] === null || obj[key] === '') {
        //           delete obj[key];
        //         }
        //       });
        //     req.body.attribute = obj;
        // }


        //xoa du lieu trong 
        var formData = deleteBodyBlank.deleteBodyBlank(req.body)

        // res.json(req.body);return;

        goodsModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then((goods) => {
                if(req.body.save == 'saveAndNew') {
                    var linkRedirect = module_path+'/createGoods';
                }
                else if(req.body.save == 'saveAndReview'){
                    var linkRedirect = module_path+'/'+req.params.id + '/editGoods';
                }else{
                    var linkRedirect = module_path;
                }
                res.redirect(linkRedirect)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); return;
            })
    }

   
    searchAjax(req,res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel =  GoodsRequireModel.createCon(DBname,'goods') // hang hoa

        const filter = {};
        var key = req.query.key;
        var key = key.toLowerCase();
        if(req.query.feild){
            if(req.query.feild == 'goodsCodeId'){
                filter.goodsCodeId = { $regex: '.*' + key + '.*' } ;
                // tim id ma hang 

            }else{
                filter.name = { $regex: '.*' + key + '.*' };
            }
        }else{
            filter.name = { $regex: '.*' + key + '.*' };
        }
        console.log(filter);
        goodsModel.find(filter).limit('10')
            .then((result) => {
                console.log(result);
                var li = []
                for (const [key,val] of Object.entries(result) ){
                    if(val.goodsCodeId){
                        var goodsCodeId  = ' - '+val.goodsCodeId;
                    }else{
                        var goodsCodeId  = '';
                    }
                    if(val.price){
                        var price  = ' - '+val.price+' đ';
                    }else{
                        var price  = '';
                    }
                    
                    li += `<li class="liSearch" data-id="${val._id}" data-key="${val.name}" style="cursor:pointer">${val.name}${goodsCodeId}${price}  </li>`;
                }
                res.send(li);
                return;
            });

    }
    searchOrderAjax(req,res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel =  GoodsRequireModel.createCon(DBname,'goods') // hang hoa

        const filter = {};
        var key = req.query.key;
        var key = key.toLowerCase();
        if(req.query.feild){
            if(req.query.feild == 'goodsCodeId'){
                filter.goodsCodeId = { $regex: '.*' + key + '.*' } ;
                // tim id ma hang 

            }else{
                filter.name = { $regex: '.*' + key + '.*' };
            }
        }else{
            filter.name = { $regex: '.*' + key + '.*' };
        }
        console.log(filter);
        goodsModel.find(filter).limit('10')
            .then((result) => {
                // console.log(result);
                var li = []
                for (const [key,val] of Object.entries(result) ){
                    if(val.goodsCodeId){
                        var goodsCodeId  = ' - '+val.goodsCodeId;
                    }else{
                        var goodsCodeId  = '';
                    }
                    if(val.price){
                        var price  = ' - '+val.price+' đ';
                    }else{
                        var price  = '';
                    }
                    // each thuoc tinh  
                    var attribute = [];
                    for (const [key_att,val_att] of Object.entries(val.attribute) ){
                     
                        attribute += key_att +":"+ val_att+"<br> <input type='hidden' class='' name='attribute-"+key_att+"' data='attribute' value='"+val_att+"'>";
                    }
                       // var inputAttr = `<input name='attribute' value='${attribute}' type='hidden' id=''>`;
                    // console.log(val.attribute);
                    
                    li += `<li onclick="selectItem(this,'${val._id}','${val.name}','${val.price}','${val.costPrice}')" data-attribute="${attribute}" class="liSearch"  style="cursor:pointer">${val.name}${goodsCodeId}${price}  </li>`;
                }
                res.send(li);
                return;
            });

    }
    //xoa annh
    imageDestroy(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel =  GoodsRequireModel.createCon(DBname,'goods') // hang hoa

        goodsModel.findById(req.params.id)
            .then((goods) => {
                // xoa anh 
                // console.log(req.params.imgName);
                goods.img.remove(req.params.imgName);
                // xoa file anh 
                var dir =  `src/public/img/user/${req.userId}/goods/`;
                if (fs.existsSync(dir)) {
                    try {
                        fs.unlinkSync(dir+'/'+req.params.imgName);
                        console.log(`${dir} is deleted!`);
                        res.send('Xóa thành công');return;
                    } catch (err) {
                        console.error(`Error while deleting ${dir}.`);
                    }
                }
                goods.save(function (error) {
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
        const goodsModel =  GoodsRequireModel.createCon(DBname,'goods') // hang hoa

        // xao anh 
        goodsModel.findById(req.params.id)
            .then((goods) => {
                // xoa anh 
                var dir =  `src/public/img/goods/`;
                for (const imgName of goods.img) { 
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

        goodsModel.deleteOne({_id: req.params.id}).then().catch(next)

        res.redirect('back')
    }
    

    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const goodsModel =  GoodsRequireModel.createCon(DBname,'goods') // hang hoa

        switch(req.body.action){
            case 'delete':
                //xoa anh
                for(const goodsId of req.body.ids){
                    goodsModel.findById(goodsId)
                        .then((goods) => {
                            // xoa anh 
                            var dir =  `src/public/img/user/${req.userId}/goods/`;
                            for (const imgName of goods.img) { 
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
                goodsModel.delete({_id: {$in: req.body.ids} })
                    .then(() => res.redirect('back'))
                    .catch(next)

                break;
            default:
                res.json({message: 'Hành động không hợp lệ'})
        }
    }

}

module.exports = new Controller;