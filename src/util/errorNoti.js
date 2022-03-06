
module.exports = {
    messageFlash: function (error, reqSession) {
        console.log(error);
        var message_error = [];
        if(error.errors){
            for (const [key, value] of Object.entries(error.errors)) {   
                message_error.push(value.message);
            }
        }
        reqSession.sessionFlash = {
            message: message_error
        } 
        return message_error;
    },
 
}