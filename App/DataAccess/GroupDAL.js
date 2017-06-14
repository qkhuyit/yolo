var Group = require('../Models/Group'),
    q = require('q');


function Create(gr) {
    var defer = q.defer();
    if (gr) {
        gr = new Group(gr);
        Group.create(gr, (err, result) => {
            if (err) {
                defer.reject(err);
            } else {
                if (result) {
                    defer.resolve(result);
                } else {
                    defer.resolve(null);
                }
            }
        });
    } else {
        defer.reject("Cant not gr paramester.");
    }
    return defer.promise;
}

function FindByCode(code) {
    var defer = q.defer();
    Group.findOne({ 'Code': code }, (err, result) => {
        if (err) {
            defer.reject(err);
        } else {
            if (result) {
                defer.resolve(result);
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}

function FindByID(id) {
    var defer = q.defer();
    Group.findOne({ '_id': id }, (err, result) => {
        if (err) {
            defer.reject(err);
        } else {
            if (result) {
                defer.resolve(result);
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}




module.exports = {
    FindByCode: FindByCode,
    Create: Create,
    FindByID: FindByID
}