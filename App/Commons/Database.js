var mongoose = require('mongoose'),
    config = require('config');

mongoose.connect(config.get('MongoDB.ConnectionString'), function () {
    console.log('Database Sever: ' + config.get('MongoDB.ConnectionString'));
});

