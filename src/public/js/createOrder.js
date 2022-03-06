function FN(number){
    // return parseInt( number.replace(/[^0-9.]/g, ""));

    // replace(/\[.*\]/,'')
    return parseInt(number.replace(/,/g, ''));
}
//bam but toa hoa dong
function billSubmit(count){
    //cap nhat don hang
    var orderId = $('#orderId_'+count).val();

    // chuyen thanh don han thanh cong 
    
    // tao hoa don
    $.post('/crm/bill/'+orderId+'/store',{}, function(billCode){ 
        var data = { 
            orderTemporary: 'off',
            billCode: billCode
        }
        // chuyen doi don tam thanh don thanh con g
        $.post('/crm/order/'+orderId+'/update?_method=PUT', data, function(response){ 
            console.log(response);
            alert('Bạn đã tọa hóa đơn thành công')
            window.location.reload(true);
        }); 

    }); 
    return;
}

//bam nut dat hang 
function orderSubmit(count){
     //cap nhat don hang
     var orderId = $('#orderId_'+count).val();
 
     var data = { 
         orderTemporary: 'off',
     }

     $.post('/crm/order/'+orderId+'/update?_method=PUT', data, function(response){ 
         console.log(response);
         alert('Bạn đã đặt hàng thành công')
     }); 
     window.location.replace("/crm/order/create");
     return;
}
//tinh dong hang: tong tien, giam gia, thu khac, khach hang tra tien
function order(count, totalPrice,saleOff,priceOther,customerPay){
   
    if(totalPrice == ''){
        var totalPrice = $('#totalPrice_'+count).val();
    }
    // giam gia 
    if(saleOff == ''){
        var saleOff = FN($('#SaleOffPrice_'+count).val());
    }
    ///thu khach
    if(priceOther == ''){
        var priceOther = FN($('#OtherPrice_'+count).val());
    }

    //gan tong tien hang
        $('#totalPrice_html_'+count).html(totalPrice).simpleMoneyFormat();
        $('#totalPrice_'+count).val(totalPrice);

    
    //tinh lai so tien khach can tra
        var customerNeedPay = totalPrice - (saleOff + priceOther);
        $('#customerNeedPay_html_'+count).html(customerNeedPay).simpleMoneyFormat();
        $('#customerNeedPay_'+count).val(customerNeedPay);

    // khach hang tra tien 
    if(customerPay == ''){
        var customerPay = customerNeedPay;
        // gan lai khach hang tra  
        $('#customerPay_'+count).val(customerPay).simpleMoneyFormat();
    }
    

    //tinh lai tien thua
        //so tien khach dua
        var excessCash = customerPay - customerNeedPay;
        // gan 
        $('#excessCash_html_'+count).html(excessCash).simpleMoneyFormat();
        $('#excessCash_'+count).val(excessCash);

    //cap nhat don hang
    var orderId = $('#orderId_'+count).val();
    var salesChannelId = $('#salesChannelId_'+count).val();
    var priceOtherid = $('#selectPriceOther_'+count).val();
    var priceOtherType = $('#selectPriceOther_'+count+' option:selected').data('type');
    var priceOtherTypePercent = $('#OtherPrice_percent_'+count).html();

    var unitSaleOff = $('#selectUnitSaleOff_'+count).val();
    var SaleOffPricePercent = $('#SaleOffPrice_percent_'+count).val();

    var userId = $('#creatorId').val();
    var  branchId = $('#branchId').val();
    var note = $('#note_'+count).val();

    var items = $(".item-append-"+count+" tr").get().map(function (tr) {
        
        return $('input', tr).get().reduce(function (obj,input) {
            var  inputValue = input.value;
            var inputName = input.name;
            if (inputName.indexOf('attribute-') > -1) {
                var inputName = inputName.replace(/attribute-/g,''); 
                if(obj.attribute){
                    obj.attribute[inputName] =  inputValue; 
                }else{
                    obj.attribute = {};
                    obj.attribute[inputName] =  inputValue; 
                }
                // obj['attr'] = [{[inputName] : inputValue}]; 
                console.log(inputValue);
            }else{
                obj[input.name] = inputValue.replace(/,/g,''); 
            }
            return obj;
        }, {});
    });
        console.log(items);
   
   

    var data = { 
        totalPrice: totalPrice,  // tong tien hang
        salesOff: saleOff, // giam gia
        unitSaleOff: unitSaleOff, // don vi giam gia 
        SaleOffPricePercent: SaleOffPricePercent, // pham tran giam gia

        customerNeedPay: customerNeedPay, // so tien khach can tra
        customerPay: customerPay, // so tien khach dua
        excessCash: excessCash, // tien thua tra khac
        
        satusOrderId: '', //trang thai don hang
       
        orderReceiverId: '', //nguoi dat hang
        salesChannelId: salesChannelId, // kenh ban
        paymentMethodId: '', // phuong thuc thanh toan
        note:note, //ghi chu
        priceOther: priceOther, // thu khac
        priceOtherid: priceOtherid, //id thu khac
        priceOtherType: priceOtherType, // loai thu khac
        priceOtherTypePercent: priceOtherTypePercent, //pham tram  thu khac
        items:  items, //cac san pham trong don hang 
        cityId: '', //thanh pho
        districtId: '', //quan huyen
        totalAfterSalesOff: '', // tong sau giam gia 
        billOfLadingCode: '', // ma van don
        billCode: '', //ma hoa dong
        orderTemporary: 'on',
        branchId:  branchId, //chi nhanh
    }
    // nguo tao
    data.creator ={
        creatorId: userId, //nguoi tao
        creatorAdminId: userId, //nguoi tao
    }
   

    // nhan vien tao 
    var staffId = $('#staffId_'+count).val();
    var staffName = $('#staffName_'+count).val();
    var staffTel = $('#staffTel_'+count).val();
    var staffUsername = $('#staffUsername_'+count).val();
    var staffEmail = $('#staffEmail_'+count).val();
    data.staff = {
        staffId: staffId,
        staffAdminId: staffId,
        name: staffName,
        tel: staffTel,
        username: staffUsername,
        email: staffEmail
    }

    // khach hang 
    var customerId = $('#customerId_'+count).val();
    var customerName = $('#customerName_'+count).val();
    var customerPhone = $('#customerPhone_'+count).val();
    var customerEmail = $('#customerEmail_'+count).val();
    var customerSex = $('#customerSex_'+count).val();

    data.customer = {
        customerId: customerId, // khach hang
        name: customerName, // ho ten khach hang
        phone_1: customerPhone, //so dien thoai
        email: customerEmail, // email
        sex: customerSex, // gioi tinh
    };

    // giao hang 
    var deli_cod = $('#deli_checkboxCOD_'+count).val();
    var deli_receiveName = $('#deli_receiveName_'+count).val();
    var deli_PartnerId = $('#deliveryPartnerId_'+count).val();
    var deli_receiveTel = $('#deli_receiveTel_'+count).val();
    
    var deli_receiveAddress = $('#deli_receiveAddress_'+count).val();
    var deli_cityId = $('#deli_cityId_'+count).val();
    var deli_districtId = $('#deli_districtId_'+count).val();
    var deli_weight = $('#deli_weight_'+count).val();
    var deli_unitWeight = $('#deli_unitWeight_'+count).val();
    var deli_dai = $('#deli_dai_'+count).val();
    var deli_rong = $('#deli_rong_'+count).val();
    var deli_cao = $('#deli_cao_'+count).val();
    var deli_goodsAddress = $('#deli_goodsAddress_'+count).val();
    var deli_note = $('#deli_note_'+count).val();

    var deli_returnDate = $('#deli_returnDate_'+count).val();
    var deli_billOfLadingCode = $('#deli_billOfLadingCode_'+count).val();
    

    data.delivery = {};
    data.delivery.cod = deli_cod; // cod
    data.delivery.receiveName = deli_receiveName; // ten nguoi nhan
    data.delivery.partnerId = deli_PartnerId; // doi tac giao hang
    data.delivery.receiveTel = deli_receiveTel; // dien thoai nguoi nhan
    data.delivery.returnDate =deli_returnDate; // ngay gio giao hang
    data.delivery.billOfLadingCode = deli_billOfLadingCode; // ma van don
    data.delivery.receiveAddress = deli_receiveAddress; // dia chi nhan
    data.delivery.cityId = deli_cityId; // thanh pho
    data.delivery.districtId = deli_districtId; // thanh pho
    data.delivery.weight = deli_weight; // trong luong
    data.delivery.unitWeight = deli_unitWeight; // don vi trong luong
    data.delivery.goodsAddress = deli_goodsAddress; // dai chi lay hang
    data.delivery.note = deli_note; // dai chi lay hang
    
    data.delivery.size = {};
    data.delivery.size.dai = deli_dai; // kich thuoc dai
    data.delivery.size.rong = deli_rong; // kich thuoc rong
    data.delivery.size.cao = deli_cao; // kich thuoc cao

    $.post('/crm/order/'+orderId+'/update?_method=PUT', data, function(response){ 
        console.log(response);
    });
    return;
}

//thay doi so luong bang thay
function changeCount(count,priceItem,countItem){
    var countSL_old = document.getElementById('countItem_'+count+'_'+countItem).getAttribute("data-count");
    var countSL = $('#countItem_'+count+'_'+countItem).val();

    // toi thieu so luong bang 1 
    if(countSL < 1 ){alert('Số lượng tối thiểu là 1'); $('#countItem_'+count+'_'+countItem).val(countSL_old);return;}
    if(countSL > 999999999){alert('Số lượng tối đa là 999.999.999');$('#countItem_'+count+'_'+countItem).val(countSL_old);return;}
    
    //gan data count
    $('#countItem_'+count+'_'+countItem).attr('data-count',countSL);

    // tinh  thanh tien  : so luong * don gia
        var priceCountItem = countSL * priceItem;
            // gan 
            $('#priceCountItem_'+count+'_'+countItem).val(priceCountItem).simpleMoneyFormat();
            // gan value 
    
    //tinh tong tien
        var totalPrice_old = $('#totalPrice_'+count).val(); 
        // kiem tra thay doi tang hay giam 
        // tang
        if(countSL > countSL_old){
            // tinh count tang bao nhieu 
            var countIncreate = parseInt(countSL) - parseInt(countSL_old);
            var priceItemIncreate = countIncreate * parseInt(priceItem);
            var totalPrice =  parseInt(totalPrice_old) +  parseInt(priceItemIncreate);
        }
        // neu giam 
        if(countSL < countSL_old){
            var countIncreate = parseInt(countSL_old) - parseInt(countSL);
            var priceItemIncreate = countIncreate * parseInt(priceItem);
            var totalPrice =  parseInt(totalPrice_old) -  parseInt(priceItemIncreate);
        }

       
    //giam gia vs thu khac
        var saleOff = FN($('#SaleOffPrice_'+count).val());
        var priceOther = FN($('#OtherPrice_'+count).val());

    // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice, saleOff,priceOther,customerPay='')
}

function down(count,priceItem,countItem) {
    var countSL_old = $('#countItem_'+count+'_'+countItem).val();
    var countSL = parseInt(countSL_old) - 1;
    // toi thieu so luong bang 1 
    if(countSL < 1 ){alert('Số lượng tối thiểu là 1');return;}
    // gan so thu moi
        $('#countItem_'+count+'_'+countItem).val(countSL);
        $('#countItem_'+count+'_'+countItem).attr('data-count',countSL);

    // tinh  thanh tien  : so luong * don gia
        var priceCountItem = countSL * priceItem;
            // gan 
            $('#priceCountItem_'+count+'_'+countItem).val(priceCountItem).simpleMoneyFormat();
    
    //tinh tong tien
        var totalPrice_old = $('#totalPrice_'+count).val(); 
        var totalPrice = parseInt(totalPrice_old) - parseInt(priceItem);
    //giam gia vs thu khac
        var saleOff = FN($('#SaleOffPrice_'+count).val());
        var priceOther = FN($('#OtherPrice_'+count).val());

    // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice, saleOff,priceOther,customerPay='')
}


function up(count,priceItem,countItem) { 
    var countSL_old = $('#countItem_'+count+'_'+countItem).val();
    var countSL = parseInt(countSL_old) + 1;
    // toi thieu so luong bang 1 
    if(countSL > 999999999){alert('Số lượng tối đa là 999.999.999');return;}
    // gan so thu moi
        $('#countItem_'+count+'_'+countItem).val(countSL);
        $('#countItem_'+count+'_'+countItem).attr('data-count',countSL);
        
    // tinh  thanh tien  : so luong * don gia
        var priceCountItem = countSL * priceItem;
            // gan 
            $('#priceCountItem_'+count+'_'+countItem).val(priceCountItem).simpleMoneyFormat();;
    
    //tinh tong tien
        var totalPrice_old = $('#totalPrice_'+count).val(); 
        var totalPrice = parseInt(totalPrice_old) + parseInt(priceItem);
    //giam gia 
    var saleOff = FN($('#SaleOffPrice_'+count).val());
    var priceOther = FN($('#OtherPrice_'+count).val());


    // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice, saleOff,priceOther,customerPay='')
 }

// chon tab 
function selectTab(count,orderId){
    // hien thi tab tong tien 
    // an tat cac tab 
    $('.contentTabPrice').css('display','none');
    //hien tab dc chon
    $('.contentTabPrice_'+count).css('display','');
    $('#tabCurrent').val(count);
  
}

//khach tra tien 
function customerPayed(count){
    // tong tien 
    var totalPrice = $('#totalPrice_'+count).val();
    // gia giam 
    var saleOff = $('#SaleOffPrice_'+count).val();
    // thu khac 
    var priceOther =  $('#OtherPrice_'+count).val();
 

    //so tien khach dua
    var customerPay =   $('#customerPay_'+count).val();
    
   
    // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice, FN(saleOff),FN(priceOther),FN(customerPay));

}
// thay doi thu khac
function changePriceOther(count){
    // tong so tien 
    var totalPrice = $('#totalPrice_'+count).val();
            if(totalPrice == 0){alert('Bạn chưa chọn hàng hóa'); $('#SaleOffPrice_'+count).val(0); return;}
    // giam gia 
    var saleOff = $('#SaleOffPrice_'+count).val();
    ///thu khach
    var priceOther =  $('#OtherPrice_'+count).val();
            if(priceOther == '') { 
                $('#OtherPrice_'+count).val(0);
            }else{
                var priceOther = FN(priceOther);
            }
      

            // thu khach khong duoc lon hon tong gia 
            if(priceOther > totalPrice){
                alert('Thu khác không được lớn hơn tổng giá'); 
                // gan lai gia 
                $('#OtherPrice_'+count).val(totalPrice).simpleMoneyFormat();
                return;
            }
   
             // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice, FN(saleOff),priceOther,customerPay='')
}

/// thay doi don vi thu khac
function changeUnitPriceOther(count){
    var totalPrice = $('#totalPrice_'+count).val();
        if(totalPrice == 0){alert('Bạn chưa chọn hàng hóa'); $('#OtherPrice_'+count).val(0); return;}
    var saleOff = $('#SaleOffPrice_'+count).val();

    var type = $('#selectPriceOther_'+count+' option:selected').data('type');
    var value =  $('#selectPriceOther_'+count+' option:selected').data('value');
   
    if(type == 'other'){
        $('#OtherPrice_percent_'+count).css('display','none')
        $('#UnitOtherPrice_percent_'+count).css('display','none')
        $('#OtherPrice_'+count).val(0);
        $('#OtherPrice_'+count).removeAttr('disabled');
    }else if(type == 'vnd'){
        $('#OtherPrice_percent_'+count).css('display','none')
        $('#UnitOtherPrice_percent_'+count).css('display','none')
        $('#OtherPrice_'+count).attr('disabled','disabled');
        // an input nhap gia thu khac 
        $('#OtherPrice_'+count).val(value).simpleMoneyFormat();
        
    }else if(type == 'percent'){
        // hien pham thu  khac
        $('#OtherPrice_percent_'+count).css('display','')
        $('#UnitOtherPrice_percent_'+count).css('display','')
        //disable input 
        $('#OtherPrice_'+count).attr('disabled','disabled');
        //chen phan vao span
        $('#OtherPrice_percent_'+count).html(value);

        var priceOther = FN(totalPrice)/100*value;
        // an input nhap gia thu khac 
        $('#OtherPrice_'+count).val(priceOther).simpleMoneyFormat();

    }
    var priceOther = $('#OtherPrice_'+count).val();  
    console.log(saleOff +''+ priceOther);
    // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice,FN(saleOff), FN(priceOther) ,customerPay='')
  
}

//thay doi giam gia 
function changeSalePrice(count){
    // tong so tien 
    var totalPrice = $('#totalPrice_'+count).val();
            if(totalPrice == 0){alert('Bạn chưa chọn hàng hóa'); $('#SaleOffPrice_'+count).val(0); return;}
    // giam gia 
    var saleOff = $('#SaleOffPrice_'+count).val();
        //format gia
        $('#SaleOffPrice_'+count).val(FN(saleOff));
        $('#SaleOffPrice_'+count).simpleMoneyFormat();
        //neu giam tra bang trong tra ve = 0
        if( saleOff == ''){ $('#SaleOffPrice_'+count).val(0);}
        //gia tham ko dc qua gia tong
        if(FN(saleOff) >  totalPrice){
            alert('Giá giảm không được lớn hơn tổng giá')
            $('#SaleOffPrice_'+count).val(totalPrice);
             return;
        }

    // thu khac
    var priceOther =  FN($('#OtherPrice_'+count).val());

     // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice,FN( saleOff),priceOther,customerPay='')
    
}
//thay doi phan tram giam gia 
function changeUnitPercentSalePrice(count){
     // tong so tien 
     var totalPrice = $('#totalPrice_'+count).val();
     if(totalPrice == 0){alert('Bạn chưa chọn hàng hóa'); $('#SaleOffPrice_'+count).val(0); return;}

    //tinh giam gia 
    var SaleOffPrice_percent = $('#SaleOffPrice_percent_'+count).val();
    var saleOff = parseInt(totalPrice)/100 * parseInt(SaleOffPrice_percent);
    //gan vao 
    $('#SaleOffPrice_'+count).val(saleOff).simpleMoneyFormat();

    // thu khac
    var priceOther =  FN($('#OtherPrice_'+count).val());

    // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice, saleOff,priceOther,customerPay='')
}


//thay doi don vi saleoff
function changeUnitSalePrice(count){
    var selectVal = $('#selectUnitSaleOff_'+count).val();

    if(selectVal == 'percent'){
        // hien thi input phan tram 
        $('#SaleOffPrice_percent_'+count).css('display','');
        $('#unitSalePricePercent_'+count).css('display','');
        //disable sua gia giam
        $('#SaleOffPrice_'+count).attr('disabled','disabled');

        // tinh lai gia giam
        $('#SaleOffPrice_'+count).val(0);
        

    }else{
        $('#SaleOffPrice_percent_'+count).css('display','none');
        $('#SaleOffPrice_percent_'+count).val(0);
        $('#unitSalePricePercent_'+count).css('display','none');
        $('#SaleOffPrice_'+count).removeAttr('disabled');
    }
    // tong so tien 
    var totalPrice = $('#totalPrice_'+count).val();
            if(totalPrice == 0){alert('Bạn chưa chọn hàng hóa'); $('#SaleOffPrice_'+count).val(0); return;}
    var priceOther = FN($('#OtherPrice_'+count).val());
    // tong tien, giam gia, thu khac, khach hang tra tien
    order(count, totalPrice,saleOff=0,priceOther,customerPay='')
    
}
//update don hang
function updateOrder(count){
    order(count, totalPrice='',saleOff='',priceOther='',customerPay='')
}
//thay doi nguoi ban
function changeStaff(count){
    var name =  $('#staffId_'+count+' option:selected').data('name');
    $('#staffName_'+count).val(name);

    var username =  $('#staffId_'+count+' option:selected').data('username');
    $('#staffUsername_'+count).val(username);

    var tel =  $('#staffId_'+count+' option:selected').data('tel');
    $('#staffTel_'+count).val(tel);

    var email =  $('#staffId_'+count+' option:selected').data('email');
    $('#staffEmail_'+count).val(email);

    order(count, totalPrice='',saleOff='',priceOther='',customerPay='')
}

// chon hang hoa 
function selectItem(att,idItem, nameItem, priceItem, priceCost){
    var count = $('#tabCurrent').val();
    var countItem = $('.itemTab_'+count).length+1;
    var atttribute  = att.getAttribute("data-attribute");
    // kiem tra count avtive hien tai  va add vao dung tab
    
    $('.item-append-'+count).prepend('<tr class="itemAdd itemTab_'+count+' itemAdd_'+count+'_'+countItem+'">'+
      // so tt 
        '<td class="col_tt_'+count+' col_ttItem_'+countItem+'">'+ countItem+ '</td>'+
        // xoa 
        '<td>'+  '<span onclick="deleteIteam('+count+', '+priceItem+','+countItem+')" class="cursor"><i class="fa fa-trash"></i></span>'+  '</td>'+
        // ten 
        '<td><input type="text" name="name" id="nameItem_'+count+'_'+countItem+'" class="nameItem noBorder" value="'+nameItem+'" disabled></td>'+
        // thuoc tinh 
        '<td class="col_attribute col_attribute_'+count+'" id="col_attribute_'+count+'_'+countItem+'">'+atttribute+'</td>'+
            //so luong 
        '<td>'+
            //nut giam 
            '<span onclick="down('+count+', '+priceItem+','+countItem+')" class="upCount cursorPoiter border me-2 p-1" ><i class="fa fa-chevron-down" aria-hidden="true"></i></span>'+
                 '<input onchange="changeCount('+count+', '+priceItem+','+countItem+')" id="countItem_'+count+'_'+countItem+'" type="number" name="count" data-count="1" value="1" min="1" max="99999999">'+
                 //input id hoang hoa
                 '<input id="IdItem_'+count+'_'+countItem+'" type="hidden" name="idGoods" value="'+idItem+'">'+
                //  gia cost 
                 '<input id="priceCost_'+count+'_'+countItem+'" type="hidden" name="priceCost" value="'+priceCost+'">'+
              
            
            //nut tang
            '<span onclick="up('+count+', '+priceItem+','+countItem+')" class="upCount cursorPoiter border ms-2 p-1"><i class="fa fa-chevron-up" aria-hidden="true"></i></span>'+
        '</td>'+
        // don gia 
        '<td>'+
           '<input type="text" name="priceGoods" id="priceItem_'+count+'_'+countItem+'" class="priceItem noBorder money text-end" value="'+priceItem+'" disabled> đ'+
        '</td>'+
        // thanh tien 
        '<td>'+
           '<input type="text" name="priceTotalCount" id="priceCountItem_'+count+'_'+countItem+'"  class="priceCountItem noBorder money text-end" value="'+priceItem+'" disabled> đ'+
        '</td>'+
    '</tr>');
    $('.money').simpleMoneyFormat();


    // ten vao tong tien hang  totalPrice
    var totalPrice = $('#totalPrice_'+count).val(); 

    // tinh tong tien 
    var totalPrice = FN(totalPrice) + parseInt(priceItem);
    
      //giam gia vs thu khac
      var saleOff = FN($('#SaleOffPrice_'+count).val());
      var priceOther = FN($('#OtherPrice_'+count).val());

  // tong tien, giam gia, thu khac, khach hang tra tien
  order(count, totalPrice, saleOff,priceOther,customerPay='')

}
//xoa item
function deleteIteam(count,priceItem,countItem){

    var totalPrice_old = $('#totalPrice_'+count).val();
    // tinh thanh tien 
    var priceCountItem = FN($('#priceCountItem_'+count+'_'+countItem).val());
    var totalPrice = parseInt(totalPrice_old) - priceCountItem;
    //////
    // go bo iteam dc them vao 
    $('.itemAdd_'+count+'_'+countItem).remove();
    //dat lai so thu tu
    var lengthItem = $('.itemTab_'+count).length;

    // sap xep lai 
    $($('.col_tt_'+count).get().reverse()).each(function(i){
        // thay doi so thu tu
            var tt = i+1; 
            $(this).html(tt);
        // thay doi class 
            $(this).attr('class','col_tt_'+count+' col_ttItem_'+tt)
    });
    


    order(count, totalPrice, saleOff='',priceOther='',customerPay='')

       
}

//tao tab moi 
function addTab(){
   // them don hang tam 
   $.get('/crm/order/createTemporary',function(dataId){
        // tao tab 
        var countTab = $('.tabBill').length+1;   
        // an tab active 
            $('.buttonTab').removeClass('active');
            $('.buttonTab').data('aria-selected','false');

        //an content active 
            $('.contentTab').removeClass('show active')

        //them tab 
        $('#pills-tab').prepend('<li class="nav-item tabBill" role="presentation">'+
            '<button class="nav-link active buttonTab buttonTab_'+countTab+'" id="pills-bill_'+countTab+'-tab" data-bs-toggle="pill" data-bs-target="#pills-bill_'+countTab+'" type="button" role="tab" aria-controls="pills-bill_'+countTab+'" aria-selected="true">'+
                    'Hóa đơn '+countTab+
                    '<span onclick="deteleTab('+countTab+', '+dataId+')" class="ms-1 deleteTab text-danger" style="">X</span>'+
                    //input de them id tab 
                    '<input type="hidden" id="tabIndex_'+countTab+'" class="tabIndex" value="'+countTab+'">'+
            '</button>'+
        '</li>')
        //them tab content 
        $('#pills-tabContent').append('<div class="tab-pane fade show active contentTab contentTab_'+countTab+'" id="pills-bill_'+countTab+'" role="tabpanel" aria-labelledby="pills-bill_'+countTab+'-tab">'+
            '<div class="order-item" style="min-height: 300px;">'+
                    '<table class="table table-striped table-hover" style="font-size: 14px;">'+
                    '<thead>'+
                        '<tr>'+
                            // so tt 
                                '<th scope="col" width="1%"></th>'+
                            // xoa
                                '<th scope="col" width="1%"></th>'+
                            // ten
                                '<th></th>'+
                            // thuoc tinh 
                                '<th scope="col" width="10%"> </th>'+
                            // so luong 
                                '<th></th>'+
                            // godn gia 
                                '<th></th>'+
                            // thanh tien 
                                '<th></th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody class="item-append"></tbody>'+
                    '</table>'+
            '</div>'+
        '</div>')
   });
   

}

// xoa tab 
function deteleTab(count,id){
   $.get('/crm/order/'+id+'/deleteTemporary',function(data,status){
        //    kiem tra active hien tai
        var activeTab =  document.getElementById("pills-bill_"+count+"-tab").getAttribute("aria-selected");
        // hien noi dung tab 1 
        if(activeTab == 'true'){
            // hien tab 
            $('#pills-bill_1-tab').addClass('active');
            // hien content 
            $('#pills-bill_1').addClass('active show');
        }

        console.log('Xóa thành công');
        //xoa tab 
        $('.tabBill_'+count).remove();
        //xoa contennt 
        $('.contentTab_'+count).remove();

        //kiem tra don tam cuoi cung
        var tabLast = $('.tabBill').length;
        // neu tab bang 0 , tab don hang tam moi 
        if(tabLast == 0){
            $.get('/crm/order/createTemporary');
        }
        window.location.replace("/crm/order/create");

   });
}

//////////thay doi doi tac giao hang 
function deliveryPartner(count){
    var deliveryPartnerId = $('#deliveryPartnerId_'+count).val();
    // neu khac 0  => hien thi poup giao hang
    if(deliveryPartnerId != 0){
        // hien nut sua 
        $('#editDelivery_'+count).css('display','');

        
    }
    order(count, totalPrice='', saleOff='',priceOther='',customerPay='')
}
// checkbox thu ho cod

function checkboxCOD(count){
    var customerPay = FN($('#customerNeedPay_html_'+count).html())
    var isCheckbox = $('#deli_checkboxCOD_'+count).prop('checked');
 
    if(isCheckbox == true){
        $('#deli_checkboxCOD_'+count).val(customerPay)
        $('#deli_checkboxCOD_html_'+count).html(customerPay).simpleMoneyFormat();
    }else{
        $('#deli_checkboxCOD_'+count).val(0)
        $('#deli_checkboxCOD_html_'+count).html(0);
    }
    
}
function saveDelivery(count){
    order(count, totalPrice='', saleOff='',priceOther='',customerPay='')
    var myModalEl = document.getElementById('deliveryModal_'+count);
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();

}

////////////////phan trang 
function paination(page, itemPerPage ){
 
    $.get("/crm/goods/paginateAjax?page="+page+"&itemPerPage="+itemPerPage , function(data, status){
        $('#display-goods').html(data);
    });
}

///tim kiem hang hoa 
function searchGoods(){
    var key = $('#searchGoods').val();
    var feild = $('#feildSearchGoods').val();
    console.log(key)
    if(key != ''){
        $.get("/crm/goods/searchOrderAjax?key="+key+'&feild='+feild, function(data, status){
            $('#searchResultGoods').css('display','');
            $('#delete-search-goods').css('display','');
            $('#searchResultGoods').html(data);

        });
    }else{
        $('#delete-search-goods').css('display','none');
        $('#searchResultGoods').css('display','none');
    }
}
// xoa tim kiem hang hoa 
function deleteSearchGoods(){
    $('#delete-search-goods').css('display','none');
    $('#searchGoods').val('');
    $('#searchResultGoods').css('display','none');
}

/////tim kiem khach hang
// go tim kiem khach hang 
function searchCustomer(){
    var key = $('#search').val();
    var feild = $('#feildSearch').val();
    if(key != ''){
        $.get("/crm/customer/searchAjax?key="+key+"&feild="+feild , function(data, status){
            $('#searchResult').css('display','');
            $('#delete-search').css('display','');
            $('#searchResult').html(data);

        });
    }else{
        $('#delete-search').css('display','none');
        $('#searchResult').css('display','none');
    }

}
// xoa tim kiem 
function deleteSearchCustomer(){
    $('#search').val('');
    $('#searchResult').css('display','none');
    $('#delete-search').css('display','none');
    $('#customerId').val('');
}
//lua chon ket qua tim kiem 
function selectResult(customerId,customerName,customerPhone,customerEmail,customerSex){
    var count = $('#tabCurrent').val();
    if(customerSex !==  'undefined'){
        if(customerSex == 'female'){
            var sex = 'Chị';
        }else if(customerSex == 'male'){
            var sex = 'Anh';
        }else{
           var sex = '';
        }
    }else{
        var sex = '';
    }
   
    // so dien thoai 
    if(customerPhone !== 'undefined'){
        $('#customerPhone_'+count).val(customerPhone);
        $('#customerPhone_html_'+count).html(customerPhone);
        
    }else{
        var customerPhone = '';
    }
    $('#customerId_'+count).val(customerId);

    // ho ten 
    $('#customerName_'+count).val(customerName);
    $('#customerName_html_'+count).html(sex+' '+customerName);
 
    if(customerEmail !== 'undefined'){
        $('#customerEmail_'+count).val(customerEmail);
    }
    if(customerSex !== 'undefined'){
        $('#customerSex_'+count).val(customerSex);
    }
    $('#searchResult').css('display','none');
    order(count, totalPrice='', saleOff='',priceOther='',customerPay='')
}

// thay doi truong tim kiem khach hang
function changeFieldSearch(){
    var key = $('#search').val();
    var feild = $(this).val();
    if(key != ''){
        $.get("/crm/customer/searchAjax?key="+key+"&feild="+feild , function(data, status){
            $('#searchResult').css('display','');
            $('#delete-search').css('display','');
            $('#searchResult').html(data);

        });
    }else{
        $('#delete-search').css('display','none');
        $('#searchResult').css('display','none');
    }
}