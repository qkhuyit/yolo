var mongoose = require('mongoose');

var AccountSchema = mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Mobile: {
        type: String,
        required: true,
        unique: true
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    City: {
        type: String,
    },
    Address: {
        type: String
    },
    Sex: {
        type: Boolean
    },
    BirthDate: {
        type: Date
    },
    Password: {
        type: String
    },
    SocketID: {
        type: String
    },
    IsOnline: {
        type: Boolean
    },
    Avatar: {
        type: String
    },
    ConverPhoto: {
        type: String
    },
    LastLogin: {
        type: Date
    },
    Status: {
        type: Boolean
    }
});


try {
    module.exports = mongoose.model('Account');
} catch (e) {
    module.exports = mongoose.model('Account', AccountSchema, 'Account');
}