var mongoose = require('mongoose'),
    q = require('q'),
    db = mongoose.connection;


var GroupMemberSchema = mongoose.Schema({
    GroupID: {
        type: String
    },
    UserID: {
        type: String
    },
    Active: {
        type: Boolean
    },
    Messages : {
        type: Number
    }
});

try {
    module.exports = mongoose.model('GroupMember');
} catch (e) {
    module.exports = mongoose.model('GroupMember', GroupMemberSchema, 'GroupMember');
}