var mongoose = require('mongoose'),
    db = mongoose.connection;


var FriendSchema = mongoose.Schema({
    UserID: {
        type: String
    },
    FriendID: {
        type: String,
    },
    Status: {
        type: Boolean
    },
    CreatedDate: {
        type: Date
    },
    MessageCount: {
        type: Number
    }
});

try {
    module.exports = mongoose.model('Friend');
} catch (e) {
    module.exports = mongoose.model('Friend', FriendSchema, 'Friend');
}
