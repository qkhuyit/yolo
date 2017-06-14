var mongoose = require('mongoose'),
    q = require('q'),
    db = mongoose.connection;


var GroupSchema = mongoose.Schema({
    Name: {
        type: String
    },
    Description: {
        type: String
    },
    Avatar: {
        type: String
    },
    Admin: {
    },
    Members: [],
    Code: {
        type: String
    }
});

try {
  module.exports = mongoose.model('Group');
} catch (e) {
    module.exports = mongoose.model('Group', GroupSchema, 'Group');
}