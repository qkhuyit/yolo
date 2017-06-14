var mongoose = require('mongoose'),
    q = require('q'),
    db = mongoose.connection;


var NotificationSchema = mongoose.Schema({
    Author: {
    },
    Content: {
        type: String
    },
    Status: {
        type: Boolean
    },
    CreatedDate: {
        type: Date
    },
    To: {
        type: String
    }
});


try {
    module.exports = mongoose.model('Notification');
} catch (e) {
    module.exports = mongoose.model('Notification', NotificationSchema, 'Notification');
}