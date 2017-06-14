var mongoose = require('mongoose'),
    q = require('q'),
    db = mongoose.connection;

var MessageSchema = mongoose.Schema({
    UserID: {

    },
    To: {
        type: String
    },
    Author: {
       
    },
    Watched: {
        type: Boolean
    },
    Type: {
        type: String
    },
    CreatedDate: {
        type: Date
    },
    Content: {
        type: String
    }
});

try {
    module.exports = mongoose.model('Message');
} catch (e) {
    module.exports = mongoose.model('Message', MessageSchema, 'Message');
}