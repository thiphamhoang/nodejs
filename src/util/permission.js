const UserModel = require('../backend/modules/user/UserModel');
const RoleModel = require('../backend/modules/user/RoleModel');
const GroupRoleModel = require('../backend/modules/user/GroupRoleModel');

// nhom con 
const StaffGroupRoleRequireModel = require('../crm/modules/staffGroup/StaffGroupRoleModel');
const StaffRequireModel = require('../crm/modules/staff/StaffModel');


module.exports = {
    auth: function (userId, permi,res,type,slug) { 
        if(type == 'subCustomer'){
            const DBname = slug;
            const StaffModel = StaffRequireModel.createCon(DBname,'Staff')
            const StaffGroupRoleModel = StaffGroupRoleRequireModel.createCon(DBname,'StaffGroupRole')
           
            // tim data cua khach hang 
            StaffModel.findById(userId).exec((err, user) => {
                if (err) {  res.send('Không thấy quyền'); return;   }  
                // kiem tra va tim  roleID 
                RoleModel.findOne({name: permi},
                    (err, role) => {
               
                        if (err) {  res.status(500).send('!24 Chưa tạo quyền '+ permi);  return;  }
                        if (role == '' || role == null) {  res.status(500).send('Chưa tạo quyền '+ permi);  return;   }
                        // kiem tra quyen co phan cho group cua user hay khong 
                        StaffGroupRoleModel.findOne({groupId: user.groupId, roleId: role._id },
                            (err, groupRole) => {  
                                // console.log(groupRole)      
                                if (err) {  res.status(500).send({ message: "!30 Chưa phân quyền "+permi });  return;  }
                                if (groupRole == null) {  res.status(500).send({ message: "!31 Chưa phân quyền "+permi }); return; }
                            }
                        );
                        }
                );

            });

        }else{
            UserModel.findById(userId).exec((err, user) => {
                if (err) {  res.status(500).send({ message: err }); return;   }  
                // kiem tra va tim  roleID 
                RoleModel.findOne({name: permi},
                    (err, role) => {
                        if (err) {  res.status(500).send('Chưa tạo quyền '+ permi);  return;  }
                        if (role == '' || role == null) {  res.status(500).send('Chưa tạo quyền '+ permi);  return;   }
                        // kiem tra quyen co phan cho group cua user hay khong 
                        GroupRoleModel.findOne({groupId: user.groupId, roleId: role._id },
                            (err, groupRole) => {  
                                // console.log(groupRole)      
                                if (err) {  res.status(500).send({ message: "Chưa phân quyền "+permi });  return;  }
                                if (groupRole == null) {  res.status(500).send({ message: "Chưa phân quyền "+permi }); return; }
                            }
                        );
                        }
                );

            });
        }
    },
 
}