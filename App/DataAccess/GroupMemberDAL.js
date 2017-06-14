var GroupMember = require('../Models/GroupMember'),
    q = require('q');

function Create(grMember) {
    var defer = q.defer();
    if (grMember) {
        grMember = new GroupMember(grMember);
        GroupMember.create(grMember, (err, result) => {
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
        defer.reject('Cant Not Paramester.');
    }
    return defer.promise;
}

function FindByUser(id) {
    var defer = q.defer();
    GroupMember.find({ 'UserID': id }, (err, result) => {
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

function PlusMessage(id) {
    GroupMember.findOne({ '_id': id }, (err, i) => {
        if (i) {
            i.Messages = 1;
            i.save();
        }
    })
}

function ViewMessage(code, id) {
    console.log(code + ' - ' +id);
    GroupMember.findOne({ 'UserID': `${id}`, 'To': `${code}` }, (err, i) => {
        if (i) {
            console.log(i);
            i.Messages = 1;
            i.save();
        }
    })
}


module.exports = {
    Create: Create,
    FindByUser: FindByUser,
    PlusMessage: PlusMessage,
    ViewMessage: ViewMessage
}