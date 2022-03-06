const CustomerRequireModel = require('../customerModel');
const SetupRequireModel = require('../../setup/SetupModel');
const BranchRequireModel = require('../../branch/BranchModel');
const CityRequireModel = require('../../city/CityModel');
const DistrictRequireModel = require('../../district/DistrictModel');
const GroupOfCustomerRequireModel = require('../../groupOfCustomer/groupOfCustomerModel');
const deleteBodyBlank = require('../../../../util/deleteBodyBlank');
const errorUtil =  require('../../../../util/errorNoti');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');

const folder_module = 'customer';
const module_name = 'Khách hàng';
const folder_view = 'modules/'+folder_module+'/views';
const crm_path =  process.env.CRM_PATH;
const module_path = crm_path+'/'+folder_module;
const permiUtil =  require('../../../../util/permission');
const { response } = require('express');
const permiView = 'customer_crm_view';
const permiEdit = 'customer_crm_edit';
const layout = 'mainCrm';
const collection = 'Customer';
const moment = require('moment'); 
// upload anh 
const multer  = require('multer');
//create folder
const fs = require('fs-extra')


class Controller {
    show(req, res,next){
        
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const CustomerModel = CustomerRequireModel.createCon(DBname,collection)
        const SetupModel = SetupRequireModel.createCon(DBname,'setup') //cao dat
        const CityModel = CityRequireModel.createCon(DBname,'City') //cao dat
        const DistrictModel = DistrictRequireModel.createCon(DBname,'District') //cao dat
        const GroupOfCustomerModel = GroupOfCustomerRequireModel.createCon(DBname,'GroupOfCustomer') //cao dat
        const BranchModel = BranchRequireModel.createCon(DBname,'Branch') //cao dat

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
            if(req.query.feild == 'CustomerCodeId'){
                filter.CustomerCodeId = { $regex: '.*' + req.query.key + '.*' } ;
                // tim id ma hang 

            }else{
                filter.name = { $regex: '.*' + req.query.key + '.*' };
            }
        }
        // bo loc 
        //loai
        if(req.query.groupOfCustomerId){
            filter.groupOfCustomerId = req.query.groupOfCustomerId;
        }
        // loai khach hang 
        if(req.query.typeOfCustomer){
            filter.typeOfCustomer = req.query.typeOfCustomer;
        }
        // gioi tinh 
        if(req.query.sex){
            filter.sex = req.query.sex;
        }
        // thnah pho 
        if(req.query.cityId){
            filter.cityId = req.query.cityId;
        }
        console.log(filter);

        Promise.all( [
            CustomerModel.find(filter) .sort({createdAt: 'desc'}).skip(skip).limit(itemPerPage)
            .populate({path:'cityId', model: CityModel})
            .populate({path:'districtId', model: DistrictModel})
            .populate({path:'groupOfCustomerId', model: GroupOfCustomerModel})
            .populate({path:'branchId', model: BranchModel}),
            SetupModel.findOne({name: "displayColCustomer"}),
            CustomerModel.count(),
            itemPerPageDefault,
            filter,
            GroupOfCustomerModel.find({}),
            CityModel.find({}),
          
           
        ])
            .then(([customerList,displayColCustomerVal,TotalCount,itemPerPageDefault,filter,groupOfCustomerList,cityList]) =>  res.render(folder_view + '/show',{
                title: module_name,
                customerList: multipleMongooseToObject(customerList),
                displayColCustomerVal: mongooseToObject(displayColCustomerVal),
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
                groupOfCustomerList: multipleMongooseToObject(groupOfCustomerList),
                cityList: multipleMongooseToObject(cityList),
          
                userId:req.User,
            }))
            .catch(next);

    }
    //get / cat/ create
    create(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const branchModel = BranchRequireModel.createCon(DBname,'branch')
        const cityModel = CityRequireModel.createCon(DBname,'city')
        const GroupOfCusstomerRequireModel = CityRequireModel.createCon(DBname,'groupOfCustomer')
       
        Promise.all( [
            branchModel.find({}), //chi nhanh
            cityModel.find({}),  //thanh pho
            GroupOfCusstomerRequireModel.find({}),  // nhom
            
        ])
            .then(([ branchList,cityList,groupOfCustomerList]) => res.render(folder_view + '/create',{
                title: 'Thêm '+ module_name,
                branchList: multipleMongooseToObject(branchList),
                cityList: multipleMongooseToObject(cityList),
                groupOfCustomerList: multipleMongooseToObject(groupOfCustomerList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
            }))
            .catch(next);

    }

    store(req,res,next){ 
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const CustomerModel =  CustomerRequireModel.createCon(DBname,'Customer') // ma hang hoa
        //xoa du lieu trong 
        
        if(req.body.birthday){
            req.body.birthday = moment(req.body.birthday, 'DD-MM-YYYY');
            // res.json(req.body.birthday);return;
        }

        var formData = deleteBodyBlank.deleteBodyBlank(req.body)

        CustomerModel.count({}, function(err, count){
            formData.code = count+1;
            const Customer  = new CustomerModel(formData);
            Customer.save() 
                .then((Customer) => { 
                    if(req.body.save == 'saveAndNew') {
                        var linkRedirect = module_path +'/createCustomer';
                    }
                    else if(req.body.save == 'saveAndReview'){
                        var linkRedirect = module_path+'/'+ Customer._id + '/editCustomer';
                    }else{
                        var linkRedirect = module_path;
                    }
                    res.redirect(linkRedirect)
                })
                .catch(error => {
                    console.log(error);

                    errorUtil.messageFlash(error,req.session);
                    res.redirect('back'); 
                });
        });;

     
        // res.json(formData);return;
        
    }
//get / cat/ edit
    edit(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const customerModel = CustomerRequireModel.createCon(DBname,'customer')
        const branchModel = BranchRequireModel.createCon(DBname,'branch')
        const cityModel = CityRequireModel.createCon(DBname,'city')
        const GroupOfCusstomerRequireModel = CityRequireModel.createCon(DBname,'groupOfCustomer')

        Promise.all( [
            customerModel.findById(req.params.id), //hthuong hieu
            branchModel.find({}), //hthuong hieu
            cityModel.find({}),  //thanh pho
            GroupOfCusstomerRequireModel.find({}),  //nhom
           
        ])
            .then(([customer,branchList,cityList,groupOfCustomerList]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+ module_name,
                customer: mongooseToObject(customer),
                branchList: multipleMongooseToObject(branchList),
                cityList: multipleMongooseToObject(cityList),
                groupOfCustomerList: multipleMongooseToObject(groupOfCustomerList),
                layout: layout,
                folder_module: folder_module,
                module_name: module_name,
                crm_path,
                module_path,
                username: req.username,
                userId: req.userId
            }))
            .catch(next);
    }

    //put/ cat
    update(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const CustomerModel =  CustomerRequireModel.createCon(DBname,'Customer') // ma hang hoa
        
       
      
        if(req.body.birthday){
            req.body.birthday = moment(req.body.birthday, 'DD-MM-YYYY');
            // res.json(req.body.birthday);return;
        }

        //xoa du lieu trong 
        // var formData = deleteBodyBlank.deleteBodyBlank(req.body)
        var formData = req.body;
        var imgNameNew = req.body.img;

        if(req.body.oldImage != ''){
            if(req.body.deleteImage == 'on'){
                try {
                    fs.unlinkSync(`src/public/img/user/${req.userId}/customer/${req.body.oldImage}`);
                    console.log('successfully deleted ');
                } catch (err) {
                    // handle the error
                console.log(err);
                }
                formData.img = '';
            }
        }

        formData.img = imgNameNew;
    
        // res.json(formData);return;

        CustomerModel.updateOne({_id: req.params.id}, formData, {runValidators: true})
            .then((Customer) => {
                res.redirect(module_path)
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); return;
            })
    }

   
    searchAjax(req,res,next){
        permiUtil.auth(req.userId,permiView,res,req.type,req.slug)
        const DBname = req.slug;
        const CustomerModel =  CustomerRequireModel.createCon(DBname,'Customer') // hang hoa

        const filter = {};
        var key = req.query.key;
        var key = key.toLowerCase();
        if(req.query.feild){
            if(req.query.feild == 'code'){
                filter.code = { $regex: '.*' + key + '.*' } ;
                // tim id ma hang 

            }else if(req.query.feild == 'name'){
                filter.name = { $regex: '.*' + key + '.*' };
            }else if(req.query.feild == 'email'){
                filter.email = { $regex: '.*' + key + '.*' };
            }else if(req.query.feild == 'phone_1'){
                filter.phone_1 = { $regex: '.*' + key + '.*' };
            }else if(req.query.feild == 'phone_2'){
                filter.phone_2 = { $regex: '.*' + key + '.*' };
            }
        }
        // console.log(filter);
        CustomerModel.find(filter).limit('10')
            .then((result) => {
                // console.log(result);
                var li = []
                for (const [key,val] of Object.entries(result) ){
                    if(val.phone_1){
                        var phone_1 = ' | '+val.phone_1;
                    }else{
                        var phone_1 = '';
                    }
                    
                    li += `<li class="liSearch" onclick="selectResult('${val._id}','${val.name}','${val.phone_1}','${val.email}','${val.sex}' )" style="cursor:pointer">${val.name}${phone_1} </li>`;
                }
                res.send(li);
                return;
            });

    }
  

    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const CustomerModel =  CustomerRequireModel.createCon(DBname,'Customer') // hang hoa

        // xao anh 
        CustomerModel.findById(req.params.id)
            .then((customer) => {
                // xoa anh 
                var dir =  `src/public/img/user/${req.userId}/customer/`;
 
                    if (fs.existsSync(dir)) {
                        try {
                            fs.unlinkSync(dir+'/'+customer.img);
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    }
                

            })
            .catch(error => {
                console.log(error);return;
            })

        CustomerModel.deleteOne({_id: req.params.id}).then().catch(next)

        res.redirect('back')
    }
    

    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,permiEdit,res,req.type,req.slug)
        const DBname = req.slug;
        const CustomerModel =  CustomerRequireModel.createCon(DBname,'Customer') // hang hoa

        switch(req.body.action){
            case 'delete':
                //xoa anh
                for(const CustomerId of req.body.ids){
                    CustomerModel.findById(CustomerId)
                        .then((Customer) => {
                            // xoa anh 
                            var dir =  `src/public/img/user/${req.userId}/customer/`;
                       
                                // console.log(imgName);
                                if (fs.existsSync(dir)) {
                                    try {
                                        fs.unlinkSync(dir+'/'+Customer.img);
                                        console.log(`${dir} is deleted!`);
                                    } catch (err) {
                                        console.error(`Error while deleting ${dir}.`);
                                    }
                                }
                            

                        })
                        .catch(error => {
                            console.log(error);return;
                        })
                }
                // xoa document 
                CustomerModel.delete({_id: {$in: req.body.ids} })
                    .then(() => res.redirect('back'))
                    .catch(next)

                break;
            default:
                res.json({message: 'Hành động không hợp lệ'})
        }
    }

}

module.exports = new Controller;