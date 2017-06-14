var Account = require('../Models/Account'),
    q = require('q');


/**
 * Tìm kiếm tài khoản theo email
 * @param {any} email
 */
function FindByEmail(email) {
    var defer = q.defer();
    Account.findOne({ $and: [{ 'Email': email }, { 'Status': true }] }, (err, result) => {
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

/**
 * Tạo tài khoản
 * @param {any} account
 */
function Create(account) {
    var defer = q.defer();
    if (account) {
        account = new Account(account);
        Account.create(account, (err, result) => {
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
        defer.reject(false);
    }
    return defer.promise;
};

function FindById(id) {
    var defer = q.defer();
    Account.findOne({ $and: [{ '_id': id }, { 'Status': true }] }, (err, result) => {
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

function Offline(id) {
    Account.findOne({ '_id': id }, (err, result) => {
        if (result) {
            result.IsOnline = false;
            result.SocketID = '';
            result.save();
        }
    });
}

function UpdateAvatar(id, path) {
    var defer = q.defer();
    Account.findOne({ '_id': id }, (err, result) => {
        if (err) {
            defer.reject(err);
        } else {
            if (result) {
                result.Avatar = path;
                result.save();
                defer.resolve(result);
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
};

function ChangePassword(id, pass) {
    Account.findOne({ '_id': id }, (err, result) => {
        if (result) {
            result.Password = pass;
            result.save();
        }
    });
}

module.exports = {
    FindByEmail: FindByEmail,
    Create: Create,
    FindById: FindById,
    Offline: Offline,
    UpdateAvatar,
    ChangePassword: ChangePassword
}