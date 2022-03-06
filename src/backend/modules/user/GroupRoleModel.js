const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupRoleModel = new Schema({
    groupId:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userGroup",
      required: [true,'GroupID không được trống']
    },
    roleId:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true,'RoleID không được trống']
    },
},{
    timestamps: true
});


module.exports = mongoose.model('GroupRole', GroupRoleModel);