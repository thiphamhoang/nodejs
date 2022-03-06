const mongoose = require('mongoose');

mongoose.connect(process.env.SERVER_DB_ADMIN_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(con => {
    console.log('ket noi thanh cong local')
})
.catch(error => {
    console.log('error: ' + error)
});

module.exports = mongoose;
