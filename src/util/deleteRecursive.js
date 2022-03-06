const MenuModel = require('../backend/modules/menu/MenuModel');
const CatModel = require('../backend/modules/cat/CatModel');

module.exports = {
    deleteMenu: function (menuId) {
        return deleteOne(menuId);

        function deleteOne(menuId){
            // kiem tra menu con 
            MenuModel.findOne({parentId: menuId})
                .then((menuSub) =>{
                    if(menuSub){
                        deleteOne(menuSub._id)
                    }
                })
                .catch()
            // xoa 
            MenuModel.deleteOne({_id: menuId})
            .then()
            .catch()
        }
    },
    deleteCat: function (catId) {
        return deleteOne(catId);

        function deleteOne(catId){
            // kiem tra menu con 
            CatModel.findOne({parentId: catId})
                .then((catSub) =>{
                    if(catSub){
                        deleteOne(catSub._id)
                    }
                })
                .catch()
            // xoa 
            CatModel.deleteOne({_id: catId})
            .then()
            .catch()
        }
    },
 
}