var Friend = require('../Models/Friend'),
    q = require('q');

function FindFriend(userId, friendId) {
    var defer = q.defer();
    Friend.findOne({ 'UserID': userId, 'FriendID': friendId }, (err, friend) => {
        if (err) {
            defer.reject(err);
        } else {
            if (friend) {
                defer.resolve(friend);
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}

function Create(friend) {
    var defer = q.defer();
    friend = new Friend(friend);
    Friend.create(friend, (err, result) => {
        if (err) {
            defer.reject(err);
        } else {
            if (result) {
                defer.resolve(result)
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}

function FindRequestByUser(id) {
    var defer = q.defer();
    Friend.find({ 'UserID': id, 'Status': false }, (err, friend) => {
        if (err) {
            defer.reject(err);
        } else {
            if (friend) {
                defer.resolve(friend);
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}

function FindByID(id) {
    var defer = q.defer();
    Friend.findOne({ '_id': id}, (err, friend) => {
        if (err) {
            defer.reject(err);
        } else {
            if (friend) {
                defer.resolve(friend);
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}

function FindAllByUser(userID) {
    var defer = q.defer();
    Friend.find({ 'UserID': userID, 'Status': true }, null, { sort: { 'CreatedDate':'descending'}}, (err, result) => {
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

function PlusMessage(userId, friendId) {
    Friend.findOne({ "UserID": userId, "FriendID": friendId }, (err, result) => {
        if (result) {
            result.MessageCount += 1;
            result.save();
        }
    });
}

function ViewMessage(userId, friendId) {
    Friend.findOne({ "UserID": userId, "FriendID": friendId }, (err, result) => {
        if (result) {
            result.MessageCount = 0;
            result.save();
        }
    });
}

module.exports = {
    FindFriend: FindFriend,
    Create: Create,
    FindRequestByUser: FindRequestByUser,
    FindByID: FindByID,
    FindAllByUser: FindAllByUser,
    PlusMessage: PlusMessage,
    ViewMessage: ViewMessage
}