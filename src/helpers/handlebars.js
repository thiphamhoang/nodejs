const Handlebars = require('handlebars');
const moment = require('moment'); 

const jwt = require('jsonwebtoken');

module.exports = {
    sum: (a,b) => a+b,
   
    // sap xep 
    formatNumber: (number) =>{
        return formatDecimal(number);
    },
    firstImage:(images, userId, size, classCss) => {
        for (const [key, value] of Object.entries(images)) {  
            return `<img src="/img/user/${userId}/goods/${value}" height="${size}" class="${classCss}" style="display: block;  margin-left: auto; margin-right: auto;  width: 50%;">`;
        }
    },
    eachJS: (count, data) => {
        var attribute = [];
        for (const [key,val] of Object.entries(data) ){
            attribute += key +':'+ val+'<br> <input type="hidden" class="attribute_" name="attribute['+key+']" value="'+val+'">';
        }
    },
    displayColOrder: () => {
        var col = {
            billOfLadingCode:'Mã vận đơn',
            orderCode:'Mã đơn hàng',
            billCode:'Mã hóa đơn',
            createdTime: 'Thời gian tạo',
            updatedAt: 'Thời gian cập nhật',
            customerName: 'Khách hàng',
            phone: 'Điện thoại',
            address: 'Địa chỉ',
            cityId: 'Tỉnh - TP',
            districtId: 'Quận - Huyện',
            birthday: 'Ngày sinh',
            deliveryPartnerId: 'Đối tác giao hàng',
            branchId: 'Chi nhánh',
            orderReceiverId: 'Người nhận đặt',
            creatorId: 'Người tạo',
            staffId: 'Người bán',
            salesChannelId: 'Kênh bán',
            note: 'Ghi chú',
            totalPrice: 'Tổng tiền hàng',
            salesOff: 'Giảm giá',
            totalPrice: 'Tổng sau giảm giá',
            priceOther: 'Thu khác',
            customerNeedPay: 'Khách cần trả',
            customerPay: 'Khách đã trả',
            deliveryTime: 'Thời gian giao hàng',
            satusOrderId: 'Trạng thái'
           
        }
        colList = [];
        for (const [key, value] of Object.entries(col)) {  
            colList += '<div class="col-md-6">';
                colList += '<div class="form-check">';
                    colList += `<input class="form-check-input displayCol" type="checkbox" name="setup[displayColOrder][]" value="${key}" data-col="col_${key}" id="fo_${key}">`;
                    colList += `<label class="form-check-label" for="fo_${key}">${value} </label>`;
                colList += '</div>';
            colList += '</div>';
        }
      
        return colList;
    },
    displayColCustomer: () => {
        var col = {
            img:'Hình ảnh',
            code:'Mã KH',
            phone:'Số điện thoại',
            email:'Email',
            birthday:'Ngày sinh',
            sex:'Giới tính',
            address:'Địa chỉ',
            cityId:'Tỉnh - TP',
            districtId:'Quận huyện',
            wardsId:'Phường xã',
            typeOfCustomer:'Loại',
            taxCode:'Mã số thuế',
            facebook:'Facebook link',
            groupOfCustomerId:'Nhóm',
            branchId:'Chi nhánh',
            note:'Ghi chú',
        }
        colList = [];
        for (const [key, value] of Object.entries(col)) {  
            colList += '<div class="col-md-6">';
                colList += '<div class="form-check">';
                    colList += `<input class="form-check-input displayCol" type="checkbox" name="setup[displayColCustomer][]" value="${key}" data-col="col_${key}" id="fc_${key}">`;
                    colList += `<label class="form-check-label" for="fc_${key}">${value} </label>`;
                colList += '</div>';
            colList += '</div>';
        }
      
        return colList;
    },
    displayColGoods: () => {
        var col = {
            supplierID:'Nhà cung cấp',
            supplierOrderCount:'SL nhà cung cấp',
            img:'Hình ảnh',
            price:'Giá bán',
            costPrice:'Giá vốn',
            inventoryCount:'SL tồn kho',
            goodsCodeId:'Mã hàng',
            barcode:'Mã vạch',
            groupOfGoodsId:'Nhóm hàng',
            typeOfGoodsId:'Loại hàng',
            saleChannelLink:'Liên kết kênh bán',
            supplierOrderCount:'SL nhà cung cấp',
            brandId:'Thương hiệu',
            customerOrderCount:'SL khách đặt',
            salesStatus:'Trạng thái KD',
            earnPoints:'Tích điểm',
            weight:'Cân nặng',
            directSales:'Bán trực tiếp',
            attribute:'Thuộc tính',
            unitId:'Đơn vị',
        }
        colList = [];
        for (const [key, value] of Object.entries(col)) {  
            colList += '<div class="col-md-6">';
                colList += '<div class="form-check">';
                    colList += `<input class="form-check-input displayCol" type="checkbox" name="setup[displayColGoods][]" value="${key}" data-col="col_${key}" id="f_${key}">`;
                    colList += `<label class="form-check-label" for="f_${key}">${value} </label>`;
                colList += '</div>';
            colList += '</div>';
        }
      
        return colList;
    },
    attributeItem: (data) => {
        if(data){
            var attribute = [];
                for (const [key_att,val_att] of Object.entries(data) ){
                    
                    attribute += key_att +":"+ val_att+"<br> <input type='hidden' class='' name='attribute-"+key_att+"' data='attribute' value='"+val_att+"'>";
                }
            return attribute;
        }else{
            return '';
        }
    },
    sortable: (feild , sort) => {
        const sortType = feild === sort.column ? sort.type : 'default';

        const icons = {
            default: 'fas fa-sort',
            asc: 'fas fa-sort-amount-down-alt',
            desc: 'fas fa-sort-amount-up'
        };

        const  types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc'
        }
        const icon = icons[sortType];
        const type = types[sortType];
        
        // bao mat trach viec haker dung scrip tren url 
        const href = Handlebars.escapeExpression(`?_sort&column=${feild}&type=${type}`);

        const output =  `<a href="${href}"> <i class="${icon}"></i> </a>`;
        return new Handlebars.SafeString(output);
    },
     // kiem tra json 
     json: (value) => {
        return JSON.stringify(value);
    },
    // format gio
    timecurren: (time)=> {
        if(time){
            if(time == 'now'){
                return moment().format('DD/MM/YYYY, HH:mm') ; 
            }else{

                return moment(time, "HH:mm:ss").format('DD/MM/YYYY, HH:mm');
            }
        }
    },
    dateCurren: (date)=> {
        if(date){
            if(date == 'now'){
                return moment().format('DD-MM-YYYY') ; 
            }else{

                return moment(date, "HH:mm:ss").format('DD-MM-YYYY');
            }
        }
    },
    ifStatusValue: (status, onValue, offValue) => {
        if(status == 'on'){
            return onValue;
        }else{
            return offValue;
        }
    },
    ifEquals: (arg1, arg2, option) => {
        if(arg1 == arg2){
            return option;
        }
   
    },
    ifEqualsElse: (arg1, arg2, option, option_2) => {
        if(arg1 == arg2){
            return option;
        }else{
            return option_2;
        }
   
    },
   
    // neu lon hon 0 
    ifBigger: (value, number, result) => {
        if(value > number){
            return result;
        }
    },
    // neu a lon hon b thi tra ve html 
    ifGreaterThan: ( a, b, options) => {
	    if(a > b){
            return options.fn(this);
        }
    },
    ifEqualsHtml: (arg1, arg2, options) => {
        if(arg1 == arg2){
            return options.fn(this);
        }
   
    },
    ifOtherHtml: ( a, b, options) => {
	    if(a !== b){
            return options.fn(this);
        }
    },
    // hien thi trang thai statu
    ifStatusDipay: (value) => {
   
        if(value == 'on'){
            var color = 'text-primary'
        }else{
            var color = 'text-danger'
        }
            return `<span class="me-1">
            <i class="fas fa-check-circle ${color}"></i>
            </span>`;
        
    },
    // phan trang 
    pagination: (count, itemPerPage) => {
        page = Math.ceil(parseInt(count)/parseInt(itemPerPage));
        if(page > 1){
            var pagi = [];
            for (i=1; i<= page; i++) {   
                pagi += `<li class="page-item"><a class="page-link" href="?_pagination&page=${i}&itemPerPage=${itemPerPage}">${i}</a></li>`;
            }
            return pagi;
        }else{
            return ;
        }
    },
    // phan tranh ajax 
    paginationAjax: (count, itemPerPage) => {
        page = Math.ceil(parseInt(count)/parseInt(itemPerPage));
        if(page > 1){
            var pagi = [];
            for (i=1; i<= page; i++) {   
                pagi += `<li class="page-item">
                <span onclick="paination('${i}','${itemPerPage}')" class="page-link" style="cursor:pointer">
                    ${i}
                </span>
                </li>`;
            }
            return pagi;
        }else{
            return ;
        }
    },
    // checkbox danh muc cho bai viet 
    checkboxMultiLevel: (catList) => {
        return nested(catList, checkbox = [], parentId = 0, str = "");
        function nested(catList, checkbox, parentId, str){
            

            // for các danh muc 
            for (const [key, value] of Object.entries(catList)) {   
                var ID = value._id;
            
                
                if(value.parentId == parentId){
                    checkbox += `<div class="form-check">
                    <input class="form-check-input" type="checkbox" name="cat_id[]" value="${value._id}" id="f_${value._id}">
                    <label class="form-check-label" for="f_${value._id}">
                        ${str} ${value.name}
                    </label>
                </div>`;
                checkbox = nested(catList, checkbox, ID, str + "-- ");
                }
            }

            return  checkbox;
        }
    },
    // tao option cho select 
    selectParent: (catList, IdParentCurrent) => {
        return nested(catList,IdParentCurrent, option = [], parentId = 0, str = "");

        function nested(catList,IdParentCurrent, option, parentId, str){
                
            for (const [key, value] of Object.entries(catList)) {   
                var ID = value._id;
                if(IdParentCurrent == ID){
                    var selected = 'selected';
                }else{
                    var selected = '';
                }
                if(value.parentId == parentId){
                    option += `<option data-slug="${value.slug}" data-name="${value.name}" value="${value._id}" ${selected}>${str} ${value.name}</option>`;
                    option = nested(catList,IdParentCurrent, option, ID, str + "--- ");
                }
            }

            return  option;
        }

        // function nested(catList, option, parentId, str) {
        //     for (let k in catList) {
        //         var ID = catList[k]._id;

        //       if ( catList[k].parentId == parentId) {
        //         option += `<option value="">${str} ${catList[k].name}</option>`
        //         option = nested(catList, option, ID, str + "--- ");
               
        //       } 
        //     }
        //     return  option;
        // }

       
     
    },
    //selecMenuparent
    selectMenuParent: (menuList, IdParentCurrent) => {
        return nested(menuList,IdParentCurrent, option = [], parentId = 0, str = "");

        function nested(menuList,IdParentCurrent, option, parentId, str){
                
            for (const [key, value] of Object.entries(menuList)) {   
                var ID = value._id;
                if(IdParentCurrent == ID){
                    var selected = 'selected';
                }else{
                    var selected = '';
                }
        
                if(value.parentId == parentId){
                    option += `<option data-slug="${value.slug}" data-name="${value.name}" value="${value._id}" ${selected}>${str} ${value.name}</option>`;
                    option = nested(menuList,IdParentCurrent, option, ID, str + "--- ");
                }
            }
            return  option;
        } 
     
    },
    // danh muc da cap 
    catMultiLevel: (catList, module_path) => {
        return catRowTable(catList, row = [], parentId = 0, str = "");

        function catRowTable(catList, row, parentId, str){
            for (const [key, value] of Object.entries(catList)) {   
                var ID = value._id;
                if(value.parentId == parentId){
                    row += `<tr>
                    <th scope="row">
                        <input class="form-check-input" type="checkbox" name="ids[]" value="${value._id}">
                    </th>
                    <td>
                        <a href="${value.slug}">
                            ${str} ${value.name}
                        </a>
                    </td>
                    <td>${value.slug}</td>
                    <td>
                        <a href="${module_path}/${value._id}/edit" class="btn btn-primary btn-sm">
                            <i class="fa fa-edit"></i> Sửa
                        </a>
                    
                        <a href="#" data-name="${value.name}" data-id="${value._id}" class="btn btn-danger btn-sm " data-bs-toggle="modal" data-bs-target="#deleteModal">
                            <i class="fa fa-trash"></i> Xóa
                        </a>
                    </td>
                    <td>
                        <a href="/${value.slug}" target="_blank">
                        Xem
                        </a>
                    </td>
                </tr>`;
                row = catRowTable(catList, row, ID, str + "--- ");
                }
            }

        return row;
    }
    },
    //memu da cap
    menuMultiLevel: (menuList, module_function_path, function_sub_name) =>{  
        return recursiveList(menuList);

        function recursiveList(menuList, parentId = 0, str = ""){
            var listHelperOutput = ''; 
           
            for (const [key, el] of Object.entries(menuList)) {  
                var Id = el._id.toString();
                var menuLocalId =  el.menuLocalId._id;  
                // status 
                if(el.status == 'on'){
                    var color = 'text-primary'
                }else{
                    var color = 'text-danger'
                }

                if(el.parentId == parentId){ 
                    listHelperOutput += `<li class="dd-item  dd3-item" data-id="${Id}"><div class="dd-handle dd3-handle"></div><div class="dd3-content">`;
                        listHelperOutput +=  `${el.name} 
                            <span class="menu-ac" style="float:right;font-weight: normal;">
                            <i class="fas fa-check-circle ${color}"></i>    
                            <a href="#" data-name="${el.name}" data-id="${el._id}" class="text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i class="fa fa-trash"></i> Xóa
                                    </a>
                                <a href="${module_function_path}/${menuLocalId}/${function_sub_name}/${Id}/edit">
                                    <i class="fa fa-edit"></i> Sửa
                                </a></span></div>`;  
                        listHelperOutput += '<ol>';     
                            listHelperOutput += recursiveList(menuList, Id, str + "---");  
                       
                        listHelperOutput += '</ol>';    
                    listHelperOutput += `</li>`;
                }
               
            };
          
            return new Handlebars.SafeString(listHelperOutput);
        }
    },
    checkboxPermi: (valueID, groupRoleList)=>{

        for (const [key, el] of Object.entries( groupRoleList)) {  
                var roleId = el.roleId.toString();
                if(valueID == roleId){
                    return 'checked';
                }
         
        }  
    },
    dynamicFeild:(partialType) =>{
        //goi partial , cai dat file index.js o thu muc goc
        // partialsDir: path.join(__dirname,'./backend/modules/theme/views/form'), 
  
        return partialType
    },
    createJson:(feild,callName) => {
        // cach goi o view  
        //{{createJson row.feild 'thi'}}

        var data = {}
        for (const [key, val] of Object.entries(feild)) {  
             data[val.name] = val.value
        }  
        return data[callName];
    }
}