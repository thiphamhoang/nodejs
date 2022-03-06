const MenuModel = require('../backend/modules/menu/MenuModel');

module.exports = {
    orderRecursive: function (list) {
        return order(list);
        function order(list, parentId = 0){
            var i = 0;
            for (const [key, val] of Object.entries(list)) {  
                // update parenid 
                MenuModel.updateOne({_id: val.id}, {parentId: parentId})
                    .then(() => {
                }).catch(error => {console.log(error)})
                
                if(val.children){
                    order(val.children,val.id);
                }
                i++;
                // update thu tu 
                MenuModel.updateOne({_id: val.id}, {order:i})
                    .then(() => {
                })
                .catch(error => {console.log(error)})
                
            };
        }
    },
 
}