const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    refreshToken: {type: String},
    username: {type: String},
    email: {type: String},
    password: {type: String},
},{
    timestamps: true
});

try {
    module.exports = mongoose.model('Token', TokenSchema);
}catch(error){
    module.exports = mongoose.model('Token');
}